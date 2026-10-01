import jwt from 'jsonwebtoken';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is missing in production!');
    }
    return 'kemics_dev_jwt_secret_future_foundation_temporary_2026';
  }
  return secret;
}

export interface AdminJwtPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export function signAdminToken(payload: AdminJwtPayload): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: '7d', algorithm: 'HS256' });
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret, { algorithms: ['HS256'] }) as AdminJwtPayload;
  } catch (err) {
    return null;
  }
}
