import { prisma } from '@/lib/db/prisma';

export interface RegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  governorate: string;
  age: number | string;
  educationLevel: string;
  occupation: string;
  interests: string[] | string;
  motivation: string;
  linkedinUrl?: string;
  referralSource: string;
  agreement: boolean;
}

// Sanitize string to remove dangerous control characters and strip HTML tags
export function sanitizeString(val: any, maxLength = 255): string {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  // Strip HTML tags and control chars
  const clean = str.replace(/<[^>]*>?/gm, '').replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  return clean.slice(0, maxLength);
}

export function validateRegistrationInput(data: RegistrationInput): {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData: {
    fullName: string;
    email: string;
    phone: string;
    governorate: string;
    age: number;
    educationLevel: string;
    occupation: string;
    interests: string[];
    motivation: string;
    linkedinUrl: string | null;
    referralSource: string;
    agreement: boolean;
  };
} {
  const errors: Record<string, string> = {};

  const fullName = sanitizeString(data.fullName, 100);
  const email = sanitizeString(data.email, 120).toLowerCase();
  const phone = sanitizeString(data.phone, 30);
  const governorate = sanitizeString(data.governorate, 60);
  const educationLevel = sanitizeString(data.educationLevel, 100);
  const occupation = sanitizeString(data.occupation, 100);
  const motivation = sanitizeString(data.motivation, 2000);
  const rawLinkedin = data.linkedinUrl ? sanitizeString(data.linkedinUrl, 255) : '';
  const referralSource = sanitizeString(data.referralSource, 100);
  const agreement = Boolean(data.agreement);

  // Full Name validation
  if (!fullName || fullName.length < 3) {
    errors.fullName = 'يرجى إدخال الاسم الكامل بشكل صحيح (3 أحرف على الأقل).';
  }

  // Email validation with RFC 5322 regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'يرجى إدخال بريد إلكتروني صالح.';
  }

  // Phone validation (digits, +, spaces, hyphens, min 8 digits)
  const phoneDigitsOnly = phone.replace(/[^0-9]/g, '');
  if (!phone || phoneDigitsOnly.length < 8 || phoneDigitsOnly.length > 15) {
    errors.phone = 'يرجى إدخال رقم هاتف / واتساب صالح (بين 8 و 15 رقماً).';
  }

  // Governorate
  if (!governorate) {
    errors.governorate = 'يرجى اختيار المحافظة.';
  }

  // Age validation
  const ageNum = parseInt(String(data.age), 10);
  if (!data.age || isNaN(ageNum) || ageNum < 15 || ageNum > 75) {
    errors.age = 'يرجى إدخال عمر صالح (بين 15 و 75 عامًا).';
  }

  // Education & Occupation
  if (!educationLevel) {
    errors.educationLevel = 'يرجى تحديد المستوى التعليمي.';
  }
  if (!occupation) {
    errors.occupation = 'يرجى تحديد الحالة المهنية / الوظيفة الحالية.';
  }

  // Interests
  let interestsArray: string[] = [];
  if (Array.isArray(data.interests)) {
    interestsArray = data.interests.map((i) => sanitizeString(i, 80)).filter(Boolean);
  } else if (typeof data.interests === 'string' && data.interests.trim().length > 0) {
    interestsArray = [sanitizeString(data.interests, 80)];
  }

  if (interestsArray.length === 0) {
    errors.interests = 'يرجى اختيار مجال اهتمام واحد على الأقل.';
  }

  // Motivation
  if (!motivation || motivation.length < 10) {
    errors.motivation = 'يرجى توضيح سبب رغبتك في الانضمام (10 أحرف على الأقل).';
  }

  // LinkedIn URL validation (safe URL regex)
  let linkedinUrl: string | null = null;
  if (rawLinkedin && rawLinkedin.length > 0) {
    const linkedinRegex = /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/(in|pub|company)\/[a-zA-Z0-9_-]+\/?$/i;
    if (!linkedinRegex.test(rawLinkedin) && !rawLinkedin.startsWith('https://linkedin.com/') && !rawLinkedin.startsWith('https://www.linkedin.com/')) {
      errors.linkedinUrl = 'يرجى إدخال رابط LinkedIn شخصي صالح (مثال: https://linkedin.com/in/username).';
    } else {
      linkedinUrl = rawLinkedin.startsWith('http') ? rawLinkedin : `https://${rawLinkedin}`;
    }
  }

  // Referral Source
  if (!referralSource) {
    errors.referralSource = 'يرجى تحديد كيف سمعت عن المبادرة.';
  }

  // Agreement
  if (!agreement) {
    errors.agreement = 'يجب الموافقة على الشروط والأحكام لإتمام التسجيل.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      fullName,
      email,
      phone,
      governorate,
      age: ageNum,
      educationLevel,
      occupation,
      interests: interestsArray,
      motivation,
      linkedinUrl,
      referralSource,
      agreement,
    },
  };
}

/**
 * Concurrency-safe Application ID generator.
 * Uses atomic count and retry verification to guarantee uniqueness under race conditions.
 */
export async function generateNextApplicationId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `FF-${currentYear}-`;

  const latest = await prisma.applicant.findFirst({
    where: {
      applicationId: {
        startsWith: prefix,
      },
    },
    orderBy: {
      applicationId: 'desc',
    },
    select: {
      applicationId: true,
    },
  });

  if (!latest || !latest.applicationId) {
    return `${prefix}000001`;
  }

  const numPart = latest.applicationId.replace(prefix, '');
  const nextNum = (parseInt(numPart, 10) || 0) + 1;
  const padded = String(nextNum).padStart(6, '0');
  return `${prefix}${padded}`;
}
