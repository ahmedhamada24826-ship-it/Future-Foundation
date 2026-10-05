import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

export const INITIAL_PARTNERS = [
  {
    name: 'اتحاد طلاب تحيا مصر',
    category: 'محافظة كفر الشيخ',
    logoUrl: '/images/partners/partner-tahya-misr.png',
    darkCard: false,
    order: 1,
    isActive: true,
  },
  {
    name: 'VINANCE',
    category: 'شريك تكنولوجي واستثماري',
    logoUrl: '/images/partners/partner-vinance-transparent.png',
    darkCard: true,
    order: 2,
    isActive: true,
  },
  {
    name: 'COBRA CODE',
    category: 'مجتمع البرمجة والتطوير',
    logoUrl: '/images/partners/partner-cobra-code-transparent.png',
    darkCard: true,
    order: 3,
    isActive: true,
  },
  {
    name: 'Nerva AI',
    category: 'حلول الذكاء الاصطناعي',
    logoUrl: '/images/partners/partner-nerva-ai.png',
    darkCard: false,
    order: 4,
    isActive: true,
  },
  {
    name: 'سفر الكتابة',
    category: '',
    logoUrl: '/images/partners/partner-safar-al-ketaba.png',
    darkCard: false,
    order: 5,
    isActive: true,
  },
  {
    name: 'Sand Delta',
    category: '',
    logoUrl: '/images/partners/partner-sand-delta.png',
    darkCard: false,
    order: 6,
    isActive: true,
  },
];

export async function ensureDefaultPartners() {
  const logoUrls = INITIAL_PARTNERS.map((partner) => partner.logoUrl);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await prisma.$transaction(
        async (transaction) => {
          const existing = await transaction.partner.findMany({
            where: { logoUrl: { in: logoUrls } },
            select: { logoUrl: true },
          });
          const existingLogoUrls = new Set(existing.map((partner) => partner.logoUrl));
          const missingPartners = INITIAL_PARTNERS.filter(
            (partner) => !existingLogoUrls.has(partner.logoUrl)
          );

          if (missingPartners.length > 0) {
            await transaction.partner.createMany({ data: missingPartners });
          }
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      );
      return;
    } catch (error) {
      const isSerializationConflict =
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034';
      if (!isSerializationConflict || attempt === 2) {
        throw error;
      }
    }
  }
}
