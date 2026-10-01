import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getCurrentAdmin } from '@/lib/auth/session';
import { sendAcceptanceEmail } from '@/lib/email/service';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: { id: string };
}

// POST: Send or Resend Acceptance Email
export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const ip = getClientIp(req);
    // Rate limit email triggers to avoid provider rate limits (max 20 per minute)
    const rateLimit = checkRateLimit(`email_send_${admin.userId}_${ip}`, { windowMs: 60 * 1000, max: 20 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: 'تم تجاوز الحد الأقصى لإرسال الرسائل. يرجى الانتظار قليلاً.' },
        { status: 429 }
      );
    }

    const { id } = params;
    const applicant = await prisma.applicant.findFirst({
      where: { OR: [{ id: id }, { applicationId: id }] },
    });

    if (!applicant) {
      return NextResponse.json({ success: false, message: 'المتقدم غير موجود' }, { status: 404 });
    }

    // If applicant is not accepted yet, automatically mark as accepted
    let acceptedDate = applicant.acceptedAt || new Date();
    if (applicant.status !== 'ACCEPTED') {
      await prisma.applicant.update({
        where: { id: applicant.id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: acceptedDate,
        },
      });
    }

    console.log(`[ADMIN-EMAIL-TRIGGER] Admin ${admin.email} triggering email for applicant ${applicant.applicationId}`);

    const emailResult = await sendAcceptanceEmail({
      applicantId: applicant.id,
      email: applicant.email,
      fullName: applicant.fullName,
      applicationId: applicant.applicationId,
      acceptedAt: acceptedDate,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: `فشل إرسال البريد الإلكتروني: ${emailResult.error || 'خطأ في مزود البريد'}`,
        },
        { status: 500 }
      );
    }

    const updatedApplicant = await prisma.applicant.findUnique({
      where: { id: applicant.id },
      include: {
        emailLogs: {
          orderBy: { sentAt: 'desc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: emailResult.deliveryStatus === 'MOCKED' 
        ? 'تمت محاكاة إرسال البريد بنجاح في بيئة التطوير'
        : 'تم إرسال بريد القبول الرسمي بنجاح',
      deliveryStatus: emailResult.deliveryStatus,
      data: updatedApplicant,
    });
  } catch (error: any) {
    console.error('[MANUAL-EMAIL-ERROR]', error?.message || error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
