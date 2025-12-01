// apps/web/src/utils/jwt.ts
// Utility to decode JWT and check expiry

export interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return decoded;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string): boolean {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;
  // exp is in seconds since epoch
  return Date.now() / 1000 > decoded.exp;
}
