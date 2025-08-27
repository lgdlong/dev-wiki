// JWT utility for server-side validation in middleware
import { jwtVerify, type JWTPayload } from "jose";

export interface JwtPayload extends JWTPayload {
  sub: string | undefined;
  email: string;
  role: "admin" | "mod" | "user" | "guest";
  name: string;
  avatar?: string;
  provider?: string;
}

export class JWTValidator {
  private static secret: Uint8Array | null = null;

  private static getSecret(): Uint8Array {
    if (!this.secret) {
      const secretString = process.env.JWT_SECRET;
      if (!secretString) {
        throw new Error("JWT_SECRET environment variable is required");
      }
      this.secret = new TextEncoder().encode(secretString);
    }
    return this.secret;
  }

  /**
   * Validates and decodes a JWT token
   * @param token JWT token string
   * @returns Decoded payload or null if invalid
   */
  static async validateToken(token: string): Promise<JwtPayload | null> {
    try {
      const { payload } = await jwtVerify(token, this.getSecret());

      // Validate required fields
      if (!payload.sub || !payload.email || !payload.role) {
        return null;
      }

      // Validate role is one of the expected values
      const validRoles = ["admin", "mod", "user", "guest"];
      if (!validRoles.includes(payload.role as string)) {
        return null;
      }

      return payload as JwtPayload;
    } catch (error) {
      // Token is invalid, expired, or malformed
      console.warn(
        "JWT validation failed:",
        error instanceof Error ? error.message : "Unknown error",
      );
      return null;
    }
  }

  /**
   * Extracts JWT token from NextRequest headers or cookies
   * @param request NextRequest object
   * @returns JWT token string or null
   */
  static extractToken(request: any): string | null {
    // Try Authorization header first (Bearer token)
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.slice(7);
    }

    // Try token from cookies as fallback
    const tokenCookie = request.cookies.get("token");
    if (tokenCookie?.value) {
      return tokenCookie.value;
    }

    return null;
  }
}
