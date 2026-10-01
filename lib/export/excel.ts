import * as XLSX from 'xlsx';
import { Applicant } from '@prisma/client';

/**
 * Neutralizes Excel / CSV formula injection.
 * If a string begins with '=', '+', '-', '@', '\t', '\r', prefix with single quote `'`.
 */
function sanitizeFormulaInjection(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  const dangerousChars = ['=', '+', '-', '@', '\t', '\r'];
  if (dangerousChars.some((char) => str.startsWith(char))) {
    return `'${str}`;
  }
  return str;
}

export function formatApplicantForExport(applicant: Applicant) {
  let interestsText = applicant.interests;
  try {
    const parsed = JSON.parse(applicant.interests);
    if (Array.isArray(parsed)) {
      interestsText = parsed.join(', ');
    }
  } catch (e) {
    // leave as is
  }

  return {
    'رقم الطلب (Application ID)': sanitizeFormulaInjection(applicant.applicationId),
    'الاسم الكامل': sanitizeFormulaInjection(applicant.fullName),
    'البريد الإلكتروني': sanitizeFormulaInjection(applicant.email),
    'رقم الهاتف': sanitizeFormulaInjection(applicant.phone),
    'المحافظة': sanitizeFormulaInjection(applicant.governorate),
    'العمر': applicant.age,
    'المستوى التعليمي': sanitizeFormulaInjection(applicant.educationLevel),
    'الوظيفة / الحالة': sanitizeFormulaInjection(applicant.occupation),
    'مجالات الاهتمام': sanitizeFormulaInjection(interestsText),
    'سبب الانضمام / الدافع': sanitizeFormulaInjection(applicant.motivation),
    'رابط لينكد إن': sanitizeFormulaInjection(applicant.linkedinUrl || ''),
    'مصدر المعرفة': sanitizeFormulaInjection(applicant.referralSource),
    'حالة الطلب': sanitizeFormulaInjection(applicant.status),
    'تاريخ التسجيل': applicant.registeredAt ? new Date(applicant.registeredAt).toLocaleString('ar-EG') : '',
    'تاريخ القبول': applicant.acceptedAt ? new Date(applicant.acceptedAt).toLocaleString('ar-EG') : '',
    'تاريخ إرسال البريد': applicant.emailSentAt ? new Date(applicant.emailSentAt).toLocaleString('ar-EG') : 'لم يتم الإرسال',
    'محاولات الإرسال': applicant.emailSendAttempts,
    'آخر خطأ في الإرسال': sanitizeFormulaInjection(applicant.emailLastError || ''),
  };
}

export function generateExcelBuffer(applicants: Applicant[]): Buffer {
  const data = applicants.map(formatApplicantForExport);
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  const colWidths = [
    { wch: 18 }, // Application ID
    { wch: 24 }, // Full Name
    { wch: 30 }, // Email
    { wch: 16 }, // Phone
    { wch: 14 }, // Governorate
    { wch: 8 },  // Age
    { wch: 24 }, // Education
    { wch: 22 }, // Occupation
    { wch: 30 }, // Interests
    { wch: 40 }, // Motivation
    { wch: 30 }, // LinkedIn
    { wch: 16 }, // Referral
    { wch: 14 }, // Status
    { wch: 20 }, // Registered At
    { wch: 20 }, // Accepted At
    { wch: 20 }, // Email Sent At
    { wch: 14 }, // Attempts
    { wch: 30 }, // Error
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Applicants');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

export function generateCsvBuffer(applicants: Applicant[]): Buffer {
  const data = applicants.map(formatApplicantForExport);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  // Add UTF-8 BOM so Excel opens Arabic correctly in CSV
  return Buffer.concat([Buffer.from('\uFEFF', 'utf-8'), Buffer.from(csv, 'utf-8')]);
}
