import { cookies } from 'next/headers';
import { verifyAdminToken, AdminJwtPayload } from './jwt';

export const ADMIN_COOKIE_NAME = 'kemics_admin_token';

export async function getCurrentAdmin(): Promise<AdminJwtPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdmin(): Promise<AdminJwtPayload> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error('UNAUTHORIZED');
  }
  return admin;
}
