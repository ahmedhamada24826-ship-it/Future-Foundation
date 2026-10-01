import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth/session';
import { getSystemSettings, updateSystemSettings } from '@/lib/settings/settings';

export const dynamic = 'force-dynamic';

// GET: Fetch System Settings
export async function GET() {
  try {
    const settings = await getSystemSettings();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error('Fetch Settings Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// POST: Update System Settings (Admin only)
export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const updated = await updateSystemSettings(body);

    return NextResponse.json({
      success: true,
      message: 'تم حفظ الإعدادات بنجاح',
      data: updated,
    });
  } catch (error: any) {
    console.error('Update Settings Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
