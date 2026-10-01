import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth/session';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'لم يتم رفع أي ملف' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const ext = path.extname(file.name) || '.png';
    const cleanName = file.name
      .replace(ext, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const filename = `partner-${cleanName}-${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'images', 'partners');
    fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/images/partners/${filename}`;

    return NextResponse.json({
      success: true,
      message: 'تم رفع الشعار بنجاح',
      url: relativeUrl,
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, message: 'فشل رفع الملف' }, { status: 500 });
  }
}
