import { prisma } from '@/lib/db/prisma';

export interface SystemSettings {
  program_name: string;
  main_tagline: string;
  supporting_tagline: string;
  acceptance_delay_hours: number;
  auto_acceptance_enabled: boolean;
  auto_email_enabled: boolean;
  email_delay_seconds: number;
  email_sender_name: string;
  email_sender_address: string;
  linkedin_share_text: string;
  program_website_url: string;
  partners_title?: string;
  partners_subtitle?: string;
  partners_badge?: string;
  [key: string]: any;
}

const DEFAULT_SETTINGS: SystemSettings = {
  program_name: 'Future Foundation',
  main_tagline: 'بناء مهاراتك اليوم.. لمستقبل الغد',
  supporting_tagline: 'رحلتك تبدأ من هنا مجانًا',
  acceptance_delay_hours: 24,
  auto_acceptance_enabled: true,
  auto_email_enabled: true,
  email_delay_seconds: 60,
  email_sender_name: 'Kemix Acadmey',
  email_sender_address: 'kemixacademy1@gmail.com',
  linkedin_share_text: `🎉 I’m excited to share that I’ve been accepted into Future Foundation by Kemix Acadmey!\n\nI’m looking forward to developing my personal and technical skills, exploring new domains, and taking an inspiring step toward the future.\n\n#FutureFoundation\n#KemixAcadmy\n#Learning\n#Skills\n#Future`,
  program_website_url: 'https://kemics.academy',
  partners_title: 'شركاء النجاح',
  partners_subtitle:
    'نعتز بالتعاون والشراكة مع نخبة من المؤسسات والكيانات والمجتمعات الرائدة لدعم الشباب وبناء مهارات المستقبل.',
  partners_badge: 'شركاء المسيرة والنجاح',
};

export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    const rows = await prisma.setting.findMany();
    const map = new Map<string, string>();
    rows.forEach((r) => map.set(r.key, r.value));

    return {
      program_name: map.get('program_name') || DEFAULT_SETTINGS.program_name,
      main_tagline: map.get('main_tagline') || DEFAULT_SETTINGS.main_tagline,
      supporting_tagline: map.get('supporting_tagline') || DEFAULT_SETTINGS.supporting_tagline,
      acceptance_delay_hours: Number(map.get('acceptance_delay_hours')) || DEFAULT_SETTINGS.acceptance_delay_hours,
      auto_acceptance_enabled: map.has('auto_acceptance_enabled')
        ? map.get('auto_acceptance_enabled') === 'true'
        : DEFAULT_SETTINGS.auto_acceptance_enabled,
      auto_email_enabled: map.has('auto_email_enabled')
        ? map.get('auto_email_enabled') === 'true'
        : DEFAULT_SETTINGS.auto_email_enabled,
      email_delay_seconds: Number(map.get('email_delay_seconds')) !== undefined && !isNaN(Number(map.get('email_delay_seconds'))) && map.get('email_delay_seconds') !== null
        ? Number(map.get('email_delay_seconds'))
        : DEFAULT_SETTINGS.email_delay_seconds,
      email_sender_name: map.get('email_sender_name') || process.env.EMAIL_SENDER_NAME || DEFAULT_SETTINGS.email_sender_name,
      email_sender_address: process.env.EMAIL_FROM || map.get('email_sender_address') || DEFAULT_SETTINGS.email_sender_address,
      linkedin_share_text: map.get('linkedin_share_text') || DEFAULT_SETTINGS.linkedin_share_text,
      program_website_url: map.get('program_website_url') || process.env.APP_URL || DEFAULT_SETTINGS.program_website_url,
      partners_title: map.get('partners_title') || DEFAULT_SETTINGS.partners_title,
      partners_subtitle: map.get('partners_subtitle') || DEFAULT_SETTINGS.partners_subtitle,
      partners_badge: map.get('partners_badge') || DEFAULT_SETTINGS.partners_badge,
    };
  } catch (error) {
    console.error('Error loading settings from DB:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
  for (const [key, val] of Object.entries(settings)) {
    if (val !== undefined && val !== null) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(val) },
        create: { key, value: String(val) },
      });
    }
  }
  return getSystemSettings();
}
