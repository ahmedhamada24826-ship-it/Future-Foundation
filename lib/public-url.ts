function normalizePublicUrl(value: string | undefined): string | null {
  if (!value?.trim()) {
    return null;
  }

  const candidate = value.trim();
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

export function getPublicAppUrl(fallback = 'https://kemics.academy'): string {
  const configuredUrl =
    normalizePublicUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizePublicUrl(process.env.APP_URL) ||
    normalizePublicUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    normalizePublicUrl(process.env.VERCEL_URL) ||
    normalizePublicUrl(fallback);

  if (!configuredUrl) {
    throw new Error('No valid public application URL is configured.');
  }

  return configuredUrl;
}
