import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getCurrentAdmin } from '@/lib/auth/session';

interface RouteContext {
  params: { id: string };
}

// GET: Single Applicant Details with Email Logs
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const applicant = await prisma.applicant.findFirst({
      where: {
        OR: [{ id: id }, { applicationId: id }],
      },
      include: {
        emailLogs: {
          orderBy: { sentAt: 'desc' },
        },
      },
    });

    if (!applicant) {
      return NextResponse.json({ success: false, message: 'المتقدم غير موجود' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: applicant,
    });
  } catch (error: any) {
    console.error('Get Applicant Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// PATCH: Update Applicant Status or details
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const existing = await prisma.applicant.findFirst({
      where: { OR: [{ id: id }, { applicationId: id }] },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: 'المتقدم غير موجود' }, { status: 404 });
    }

    const updateData: any = {};

    if (body.status && ['PENDING', 'ACCEPTED', 'REJECTED'].includes(body.status)) {
      updateData.status = body.status;
      if (body.status === 'ACCEPTED' && !existing.acceptedAt) {
        updateData.acceptedAt = new Date();
      } else if (body.status === 'PENDING') {
        updateData.acceptedAt = null;
      }
    }

    if (body.fullName) updateData.fullName = body.fullName.trim();
    if (body.phone) updateData.phone = body.phone.trim();
    if (body.governorate) updateData.governorate = body.governorate.trim();
    if (body.occupation) updateData.occupation = body.occupation.trim();
    if (body.motivation) updateData.motivation = body.motivation.trim();
    if (body.notes !== undefined) updateData.notes = body.notes;

    const updated = await prisma.applicant.update({
      where: { id: existing.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات المتقدم بنجاح',
      data: updated,
    });
  } catch (error: any) {
    console.error('Update Applicant Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete Applicant
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const existing = await prisma.applicant.findFirst({
      where: { OR: [{ id: id }, { applicationId: id }] },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: 'المتقدم غير موجود' }, { status: 404 });
    }

    await prisma.applicant.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف طلب المتقدم بنجاح',
    });
  } catch (error: any) {
    console.error('Delete Applicant Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
