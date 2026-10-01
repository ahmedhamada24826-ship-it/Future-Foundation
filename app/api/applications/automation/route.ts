import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth/session';
import { processAutomaticAcceptance } from '@/lib/automation/processor';

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const result = await processAutomaticAcceptance();

    return NextResponse.json({
      success: true,
      message: `تمت المعالجة التلقائية بنجاح: تم قبول ${result.acceptedCount} طلب، وإرسال ${result.emailsSentCount} بريد إلكتروني.`,
      data: result,
    });
  } catch (error: any) {
    console.error('Automation Trigger Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
