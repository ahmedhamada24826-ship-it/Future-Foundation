import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { validateRegistrationInput, generateNextApplicationId } from '@/lib/validation/applicant';
import { getCurrentAdmin } from '@/lib/auth/session';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';

// POST: Public Applicant Registration
export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting: Max 10 registrations per minute per IP to prevent spam & abuse
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`reg_${ip}`, { windowMs: 60 * 1000, max: 10 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'تم تجاوز الحد المسموح من المحاولات. يرجى الانتظار دقيقة والمحاولة مرة أخرى.',
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Validate & Sanitize Input
    const validation = validateRegistrationInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors, message: 'يرجى مراجعة البيانات المدخلة وتصحيح الأخطاء.' },
        { status: 400 }
      );
    }

    const { sanitizedData } = validation;

    // 3. Check Duplicate Email
    const existing = await prisma.applicant.findUnique({
      where: { email: sanitizedData.email },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          errors: { email: 'هذا البريد الإلكتروني مسجل بالفعل.' },
          message: 'هذا البريد الإلكتروني مسجل بالفعل.',
        },
        { status: 409 }
      );
    }

    // 4. Concurrency-safe Next Unique Application ID
    const applicationId = await generateNextApplicationId();
    const interestsString = JSON.stringify(sanitizedData.interests);

    // 5. Save to Database
    const applicant = await prisma.applicant.create({
      data: {
        applicationId,
        fullName: sanitizedData.fullName,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        governorate: sanitizedData.governorate,
        age: sanitizedData.age,
        educationLevel: sanitizedData.educationLevel,
        occupation: sanitizedData.occupation,
        interests: interestsString,
        motivation: sanitizedData.motivation,
        linkedinUrl: sanitizedData.linkedinUrl,
        referralSource: sanitizedData.referralSource,
        status: 'PENDING',
      },
    });

    console.log(`[REGISTRATION-SUCCESS] Registered: ${applicant.applicationId} (${applicant.email})`);

    return NextResponse.json(
      {
        success: true,
        message: 'تم استلام طلبك بنجاح',
        data: {
          id: applicant.id,
          applicationId: applicant.applicationId,
          fullName: applicant.fullName,
          email: applicant.email,
          registeredAt: applicant.registeredAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[REGISTRATION-ERROR]', error?.message || error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.' },
      { status: 500 }
    );
  }
}

// GET: Admin List Applicants with Search, Filters & Pagination
export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').trim();
    const status = searchParams.get('status') || 'ALL';
    const emailStatus = searchParams.get('emailStatus') || 'ALL';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '15', 10)));
    const sortBy = ['registeredAt', 'fullName', 'status', 'age'].includes(searchParams.get('sortBy') || '')
      ? (searchParams.get('sortBy') as string)
      : 'registeredAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';

    const where: any = {};

    // Filter by Status
    if (status && status !== 'ALL' && ['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      where.status = status;
    }

    // Filter by Email Status
    if (emailStatus === 'SENT') {
      where.emailSentAt = { not: null };
    } else if (emailStatus === 'PENDING') {
      where.status = 'ACCEPTED';
      where.emailSentAt = null;
    } else if (emailStatus === 'FAILED') {
      where.emailLastError = { not: null };
    }

    // Search by Name, Email, Phone, Application ID, Governorate
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { applicationId: { contains: search } },
        { governorate: { contains: search } },
      ];
    }

    const total = await prisma.applicant.count({ where });
    const applicants = await prisma.applicant.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: { emailLogs: true },
        },
      },
    });

    // Overview Stats
    const [totalCount, pendingCount, acceptedCount, rejectedCount, emailsSentCount, emailsPendingCount] =
      await Promise.all([
        prisma.applicant.count(),
        prisma.applicant.count({ where: { status: 'PENDING' } }),
        prisma.applicant.count({ where: { status: 'ACCEPTED' } }),
        prisma.applicant.count({ where: { status: 'REJECTED' } }),
        prisma.applicant.count({ where: { emailSentAt: { not: null } } }),
        prisma.applicant.count({ where: { status: 'ACCEPTED', emailSentAt: null } }),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        applicants,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
        stats: {
          total: totalCount,
          pending: pendingCount,
          accepted: acceptedCount,
          rejected: rejectedCount,
          emailsSent: emailsSentCount,
          emailsPending: emailsPendingCount,
        },
      },
    });
  } catch (error: any) {
    console.error('[ADMIN-LIST-ERROR]', error?.message || error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
