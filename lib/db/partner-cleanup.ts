import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/db/prisma';

export async function cleanupBrokenPartnerLinks() {
  try {
    const partners = await prisma.partner.findMany();

    for (const partner of partners) {
      if (!partner.logoUrl) {
        await prisma.partner.delete({ where: { id: partner.id } });
        continue;
      }

      if (!partner.logoUrl.startsWith('/')) continue;

      const isLegacyUploadedAsset = partner.logoUrl.includes('partner-image-');
      if (isLegacyUploadedAsset) {
        await prisma.partner.delete({ where: { id: partner.id } });
        continue;
      }

      const publicPath = path.join(process.cwd(), 'public', partner.logoUrl.replace(/^\/+/, ''));
      if (!fs.existsSync(publicPath)) {
        await prisma.partner.delete({ where: { id: partner.id } });
      }
    }
  } catch (e) {
    console.error('Error cleaning broken partner links:', e);
  }
}
