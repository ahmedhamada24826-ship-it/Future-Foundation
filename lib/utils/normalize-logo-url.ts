export function normalizeLogoUrl(value: string): string {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';

  const raw = trimmed.replace(/\s+/g, '').replace(/\?usp=sharing$/i, '');

  const googleDriveIdMatch = raw.match(/(?:https?:\/\/)?(?:www\.)?(?:drive\.google\.com|docs\.google\.com)\/(?:file\/d\/|uc\?export=view&id=|open\?id=|thumbnail\?id=|d\/)?([A-Za-z0-9_-]{10,})/i);
  if (googleDriveIdMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${googleDriveIdMatch[1]}`;
  }

  const fileViewMatch = raw.match(/(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)(?:\/view|$)/i);
  if (fileViewMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${fileViewMatch[1]}`;
  }

  const userContentMatch = raw.match(/(?:https?:\/\/)?drive\.usercontent\.google\.com\/(?:download\?id=|uc\?export=view&id=)([A-Za-z0-9_-]+)/i);
  if (userContentMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${userContentMatch[1]}`;
  }

  return trimmed;
}
