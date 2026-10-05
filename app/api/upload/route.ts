import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getCurrentAdmin } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const IMAGE_TYPES: Record<string, { extension: string; matches: (bytes: Buffer) => boolean }> = {
  'image/jpeg': {
    extension: 'jpg',
    matches: (bytes) => bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
  'image/png': {
    extension: 'png',
    matches: (bytes) =>
      bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  },
  'image/webp': {
    extension: 'webp',
    matches: (bytes) =>
      bytes.length >= 12 &&
      bytes.toString('ascii', 0, 4) === 'RIFF' &&
      bytes.toString('ascii', 8, 12) === 'WEBP',
  },
};

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const formFile = formData.get('file');

    if (!formFile || typeof formFile === 'string') {
      return NextResponse.json({ success: false, message: 'لم يتم رفع أي ملف' }, { status: 400 });
    }
    const file = formFile;

    const imageType = IMAGE_TYPES[file.type];
    if (!imageType) {
      return NextResponse.json(
        { success: false, message: 'صيغة الصورة غير مدعومة. استخدم PNG أو JPG أو WebP' },
        { status: 400 }
      );
    }
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'يجب ألا يتجاوز حجم الصورة 4 ميجابايت' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, '');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { success: false, message: 'رفع الشعارات غير مهيأ. أضف إعدادات Supabase Storage إلى البيئة' },
        { status: 503 }
      );
    }

    let storageBaseUrl: string;
    try {
      const storageUrl = new URL(supabaseUrl);
      if (storageUrl.protocol !== 'https:') {
        return NextResponse.json(
          { success: false, message: 'يجب أن يستخدم SUPABASE_URL اتصال HTTPS' },
          { status: 500 }
        );
      }
      storageBaseUrl = storageUrl.origin;
    } catch {
      return NextResponse.json(
        { success: false, message: 'إعداد SUPABASE_URL غير صالح' },
        { status: 500 }
      );
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'partner-logos';
    const filename = `${randomUUID()}.${imageType.extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!imageType.matches(buffer)) {
      return NextResponse.json(
        { success: false, message: 'محتوى الملف لا يطابق صيغة الصورة المحددة' },
        { status: 400 }
      );
    }

    const objectUrl = `${storageBaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${filename}`;
    const storageResponse = await fetch(objectUrl, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': file.type,
        'x-upsert': 'false',
      },
      body: buffer,
    });
    if (!storageResponse.ok) {
      const errorDetails = await storageResponse.text();
      console.error('Supabase Storage upload failed:', storageResponse.status, errorDetails);
      return NextResponse.json(
        { success: false, message: 'تعذر حفظ الشعار في التخزين الدائم. تحقق من إعدادات الحاوية' },
        { status: 502 }
      );
    }

    const relativeUrl = `${storageBaseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${filename}`;

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
