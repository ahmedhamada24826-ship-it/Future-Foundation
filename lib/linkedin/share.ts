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
  const publicAppUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://kemics.academy').replace(/\/+$/, '');
  const targetUrl =
    params.targetUrl ||
    (params.applicationId
      ? `${publicAppUrl}/acceptance/${encodeURIComponent(params.applicationId)}`
      : `${publicAppUrl}/future-foundation`);

  const defaultPostText = params.customText || 
`🎉 I’m excited to share that I’ve been accepted into Future Foundation by Kemix Acadmey!

I’m looking forward to developing my personal and technical skills, exploring new domains, and taking an inspiring step toward the future.

✨ Program: Future Foundation
🎓 Academy: Kemix Acadmey
💡 "بناء مهاراتك اليوم.. لمستقبل الغد"

#FutureFoundation #KemixAcadmy #Learning #Skills #Future #Education #Growth`;

  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({
    url: targetUrl,
  })}`;

  return {
    shareUrl,
    postText: defaultPostText,
  };
}
