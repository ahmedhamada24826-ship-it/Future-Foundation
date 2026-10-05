import { getPublicAppUrl } from '@/lib/public-url';

export interface LinkedInShareParams {
  fullName?: string;
  applicationId?: string;
  customText?: string;
  targetUrl?: string;
}

export function generateLinkedInShareUrl(params: LinkedInShareParams): {
  shareUrl: string;
  postText: string;
} {
  const publicAppUrl = getPublicAppUrl();
  const targetUrl =
    params.targetUrl ||
    (params.applicationId
      ? `${publicAppUrl}/acceptance/${encodeURIComponent(params.applicationId)}`
      : `${publicAppUrl}/future-foundation`);

  const defaultPostText = params.customText?.trim() ||
`🎉 I’m excited to share that I’ve been accepted into Future Foundation by KEMIX Academy!
${params.fullName ? `\n👤 Name: ${params.fullName}` : ''}

I’m looking forward to developing my personal and technical skills, exploring new domains, and taking an inspiring step toward the future.

✨ Program: Future Foundation
🎓 Academy: KEMIX Academy
💡 "بناء مهاراتك اليوم.. لمستقبل الغد"

${params.applicationId ? `📝 Application ID: ${params.applicationId}\n\n` : ''}#FutureFoundation #KEMIXAcademy #Learning #Skills #Future #Education #Growth`;

  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({
    url: targetUrl,
  })}`;
  const postText = defaultPostText.includes(targetUrl)
    ? defaultPostText
    : `${defaultPostText.trim()}\n\n${targetUrl}`;

  return {
    shareUrl,
    postText,
  };
}
