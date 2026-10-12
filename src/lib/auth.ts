import crypto from 'crypto';
import { User, Session, UserRole } from './types';

const SESSION_SECRET = process.env.AUTH_SECRET || 'zuas-ghana-efootball-championship-secret-key-2026';
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Hash password securely with PBKDF2
 */
export function hashPassword(password: string, existingSalt?: string): { salt: string; hash: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

/**
 * Verify user password
 */
export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const result = hashPassword(password, salt);
  return result.hash === hash;
}

/**
 * Creates a signed session token: base64(payload).signature
 */
export function createSessionToken(user: User): Session {
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS).toISOString();
  const sessionData = {
    userId: user.id,
    email: user.email,
    role: user.role,
    displayName: user.displayName,
    expiresAt,
  };

  const payloadStr = JSON.stringify(sessionData);
  const payloadBase64 = Buffer.from(payloadStr).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadBase64).digest('base64url');

  const token = `${payloadBase64}.${signature}`;

  return {
    token,
    userId: user.id,
    email: user.email,
    role: user.role,
    displayName: user.displayName,
    expiresAt,
  };
}

/**
 * Verifies signed session token and extracts session data
 */
export function verifySessionToken(token: string): Session | null {
  if (!token || !token.includes('.')) return null;

  try {
    const [payloadBase64, signature] = token.split('.');
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadBase64).digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const sessionData = JSON.parse(payloadJson);

    // Check expiry
    if (new Date(sessionData.expiresAt).getTime() < Date.now()) {
      return null;
    }

    return {
      token,
      userId: sessionData.userId,
      email: sessionData.email,
      role: sessionData.role as UserRole,
      displayName: sessionData.displayName,
      expiresAt: sessionData.expiresAt,
    };
  } catch (e) {
    return null;
  }
}

/**
 * Role-Based Access Control checker
 */
export function hasRequiredRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  if (userRole === 'ADMIN') return true; // Superadmin has access to everything
  return allowedRoles.includes(userRole);
}
