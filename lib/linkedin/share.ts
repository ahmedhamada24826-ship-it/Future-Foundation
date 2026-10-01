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
  const targetUrl = params.targetUrl || 'https://kemics.academy/future-foundation';

  const defaultPostText = params.customText || 
`🎉 I’m excited to share that I’ve been accepted into Future Foundation by Kemix Acadmey!

I’m looking forward to developing my personal and technical skills, exploring new domains, and taking an inspiring step toward the future.

✨ Program: Future Foundation
🎓 Academy: Kemix Acadmey
💡 "بناء مهاراتك اليوم.. لمستقبل الغد"

#FutureFoundation #KemixAcadmy #Learning #Skills #Future #Education #Growth`;

  const encodedSummary = encodeURIComponent(defaultPostText);
  const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedSummary}`;

  return {
    shareUrl,
    postText: defaultPostText,
  };
}
