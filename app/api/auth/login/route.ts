import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { signAdminToken } from '@/lib/auth/jwt';
import { ADMIN_COOKIE_NAME } from '@/lib/auth/session';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting: Max 5 login attempts per 5 minutes per IP to prevent brute-forcing
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`login_${ip}`, { windowMs: 5 * 60 * 1000, max: 5 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'تم تجاوز الحد الأقصى من محاولات تسجيل الدخول. يرجى الانتظار 5 دقائق والمحاولة ثانية.',
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      console.warn(`[AUTH-FAILURE] Unknown admin email attempt: ${email} from IP: ${ip}`);
      return NextResponse.json(
        { success: false, message: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      console.warn(`[AUTH-FAILURE] Invalid password for: ${email} from IP: ${ip}`);
      return NextResponse.json(
        { success: false, message: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      );
    }

    const token = signAdminToken({
      userId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    console.log(`[AUTH-SUCCESS] Admin logged in: ${admin.email} (${admin.name})`);

    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('[AUTH-ERROR]', error?.message || error);
    return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
