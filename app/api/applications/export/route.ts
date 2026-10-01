import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getCurrentAdmin } from '@/lib/auth/session';
import { generateExcelBuffer, generateCsvBuffer } from '@/lib/export/excel';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'xlsx';
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ALL';
    const emailStatus = searchParams.get('emailStatus') || 'ALL';

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (emailStatus === 'SENT') {
      where.emailSentAt = { not: null };
    } else if (emailStatus === 'PENDING') {
      where.status = 'ACCEPTED';
      where.emailSentAt = null;
    } else if (emailStatus === 'FAILED') {
      where.emailLastError = { not: null };
    }

    if (search.trim()) {
      const q = search.trim();
      where.OR = [
        { fullName: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
        { applicationId: { contains: q } },
        { governorate: { contains: q } },
      ];
    }

    const applicants = await prisma.applicant.findMany({
      where,
      orderBy: { registeredAt: 'desc' },
    });

    const timestamp = new Date().toISOString().split('T')[0];

    if (format === 'csv') {
      const csvBuffer = generateCsvBuffer(applicants);
      return new NextResponse(new Uint8Array(csvBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="future-foundation-applicants-${timestamp}.csv"`,
        },
      });
    }

    // Default to XLSX Excel
    const excelBuffer = generateExcelBuffer(applicants);
    return new NextResponse(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="future-foundation-applicants-${timestamp}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error('Export Error:', error);
    return NextResponse.json({ success: false, message: 'Export failed' }, { status: 500 });
  }
}
