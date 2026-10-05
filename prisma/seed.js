const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const INITIAL_PARTNERS = [
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
    logoUrl: '/images/partners/partner-vinance-transparent.png',
    darkCard: true,
    order: 3,
    isActive: true,
  },
  {
    name: 'COBRA CODE',
    category: 'مجتمع البرمجة والتطوير',
    logoUrl: '/images/partners/partner-cobra-code-transparent.png',
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

async function main() {
  console.log('🌱 Starting safe production-ready database seed & initialization...');

  // 1. Create or Update Default Admin User (Safe & Idempotent)
  const adminEmail = (process.env.ADMIN_EMAIL || 'kemixacademy1@gmail.com').trim().toLowerCase();
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'admin123456';
  const passwordHash = await bcrypt.hash(initialPassword, 10);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        name: 'Kemix Admin',
        email: adminEmail,
        passwordHash: passwordHash,
        role: 'SUPER_ADMIN',
      },
    });
    console.log(`✅ Admin account created: ${adminEmail}`);
  } else {
    await prisma.adminUser.update({
      where: { email: adminEmail },
      data: { passwordHash: passwordHash },
    });
    console.log(`✅ Admin account verified and password updated: ${adminEmail}`);
  }

  // 2. Create or Update Default System Settings (Safe & Idempotent)
  const defaultSettings = [
    { key: 'program_name', value: 'Future Foundation' },
    { key: 'main_tagline', value: 'بناء مهاراتك اليوم.. لمستقبل الغد' },
    { key: 'supporting_tagline', value: 'رحلتك تبدأ من هنا مجانًا' },
    { key: 'acceptance_delay_hours', value: '24' },
    { key: 'auto_acceptance_enabled', value: 'true' },
    { key: 'auto_email_enabled', value: 'true' },
    { key: 'email_delay_seconds', value: '60' },
    { key: 'email_sender_name', value: process.env.EMAIL_SENDER_NAME || 'Kemix Acadmey' },
    { key: 'email_sender_address', value: process.env.EMAIL_FROM || adminEmail },
    {
      key: 'linkedin_share_text',
      value: `🎉 I’m excited to share that I’ve been accepted into Future Foundation by Kemix Acadmey!\n\nI’m looking forward to developing my personal and technical skills, exploring new domains, and taking an inspiring step toward the future.\n\n#FutureFoundation\n#KemixAcadmy\n#Learning\n#Skills\n#Future`,
    },
    { key: 'program_website_url', value: process.env.APP_URL || 'https://kemics.academy' },
    { key: 'partners_title', value: 'شركاء النجاح' },
    { key: 'partners_subtitle', value: 'نعتز بالتعاون والشراكة مع نخبة من المؤسسات والكيانات والمجتمعات الرائدة لدعم الشباب وبناء مهارات المستقبل.' },
    { key: 'partners_badge', value: 'شركاء المسيرة والنجاح' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {}, // Preserve any customized values in production
      create: { key: s.key, value: s.value },
    });
  }
  console.log('✅ System settings initialized/preserved.');

  // 3. Seed Initial Partners if table is empty (Safe & Non-destructive)
  const partnersCount = await prisma.partner.count();
  if (partnersCount === 0) {
    for (const partner of INITIAL_PARTNERS) {
      await prisma.partner.create({ data: partner });
    }
    console.log(`✅ Seeded ${INITIAL_PARTNERS.length} default success partners.`);
  } else {
    console.log(`ℹ️ Partners already exist (${partnersCount} found). Skipping partner creation.`);
  }

  console.log('🎉 Production database initialization completed safely without deleting any data.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
