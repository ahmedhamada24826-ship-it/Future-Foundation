import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getCurrentAdmin } from '@/lib/auth/session';
import { ensureDefaultPartners } from '@/lib/db/seed-partners';
import { getSystemSettings, updateSystemSettings } from '@/lib/settings/settings';

export const dynamic = 'force-dynamic';

// GET: Fetch partners and section texts
export async function GET(req: NextRequest) {
  try {
    await ensureDefaultPartners();

    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    const where = all ? {} : { isActive: true };
    const partners = await prisma.partner.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });

    const settings = await getSystemSettings();

    const sectionInfo = {
      title: settings['partners_title'] || 'شركاء النجاح',
      subtitle:
        settings['partners_subtitle'] ||
        'نعتز بالتعاون والشراكة مع نخبة من المؤسسات والكيانات والمجتمعات الرائدة لدعم الشباب وبناء مهارات المستقبل.',
      badge: settings['partners_badge'] || 'شركاء المسيرة والنجاح',
    };

    return NextResponse.json({
      success: true,
      data: partners,
      section: sectionInfo,
    });
  } catch (error: any) {
    console.error('Fetch Partners Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// POST: Add new partner or update section texts (Admin only)
export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // If updating section texts
    if (body.type === 'section_texts') {
      const updatedSettings = await updateSystemSettings({
        partners_title: body.title,
        partners_subtitle: body.subtitle,
        partners_badge: body.badge,
      });
      return NextResponse.json({
        success: true,
        message: 'تم تحديث نصوص القسم بنجاح',
        section: {
          title: updatedSettings['partners_title'],
          subtitle: updatedSettings['partners_subtitle'],
          badge: updatedSettings['partners_badge'],
        },
      });
    }

    // Otherwise adding new partner
    const { name, category, logoUrl, darkCard, order, isActive } = body;

    if (!name || !logoUrl) {
      return NextResponse.json(
        { success: false, message: 'اسم الشريك ورابط الشعار مطلوبان' },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.create({
      data: {
        name: name.trim(),
        category: (category || '').trim(),
        logoUrl: logoUrl.trim(),
        darkCard: Boolean(darkCard),
        order: Number(order) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'تمت إضافة الشريك بنجاح',
      data: partner,
    });
  } catch (error: any) {
    console.error('Create Partner Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
