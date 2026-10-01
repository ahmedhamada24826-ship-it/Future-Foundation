import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getCurrentAdmin } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { id: string };
}

// PUT: Update partner by ID (Admin only)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const existing = await prisma.partner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'الشريك غير موجود' }, { status: 404 });
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.category !== undefined) updateData.category = body.category.trim();
    if (body.logoUrl !== undefined) updateData.logoUrl = body.logoUrl.trim();
    if (body.darkCard !== undefined) updateData.darkCard = Boolean(body.darkCard);
    if (body.order !== undefined) updateData.order = Number(body.order);
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

    const updated = await prisma.partner.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'تم تعديل بيانات الشريك بنجاح',
      data: updated,
    });
  } catch (error: any) {
    console.error('Update Partner Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete partner by ID (Admin only)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const existing = await prisma.partner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'الشريك غير موجود' }, { status: 404 });
    }

    await prisma.partner.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'تم حذف الشريك بنجاح',
    });
  } catch (error: any) {
    console.error('Delete Partner Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
