import { prisma } from '@/lib/db/prisma';

export const INITIAL_PARTNERS = [
  {
    name: 'سند شباب الدلتا',
    category: 'وزارة الشباب والرياضة',
    logoUrl: '/images/partners/partner-delta-youth.png',
    darkCard: false,
    order: 1,
    isActive: true,
  },
  {
    name: 'اتحاد طلاب تحيا مصر',
    category: 'محافظة كفر الشيخ',
    logoUrl: '/images/partners/partner-tahya-misr.png',
    darkCard: false,
    order: 2,
    isActive: true,
  },
  {
    name: 'VINANCE',
    category: 'شريك تكنولوجي واستثماري',
    logoUrl: '/images/partners/partner-vinance.png',
    darkCard: true,
    order: 3,
    isActive: true,
  },
  {
    name: 'COBRA CODE',
    category: 'مجتمع البرمجة والتطوير',
    logoUrl: '/images/partners/partner-cobra-code.png',
    darkCard: true,
    order: 4,
    isActive: true,
  },
  {
    name: 'N-Wave',
    category: 'حلول وإبداع رقمي',
    logoUrl: '/images/partners/partner-n-wave.png',
    darkCard: false,
    order: 5,
    isActive: true,
  },
];

export async function ensureDefaultPartners() {
  try {
    const count = await prisma.partner.count();
    if (count === 0) {
      for (const partner of INITIAL_PARTNERS) {
        await prisma.partner.create({ data: partner });
      }
    }
  } catch (e) {
    console.error('Error seeding default partners:', e);
  }
}
