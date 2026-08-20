import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { AuthSession, UserRole } from './types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'salon-crown-aesthetics-super-secret-key-2026-secure-jwt-token'
);

const AUTH_COOKIE_NAME = 'auth_token';

// Hash Password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare Password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Sign JWT Token
export async function signToken(payload: AuthSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

// Verify JWT Token
export async function verifyToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as UserRole,
      name: payload.name as string,
    };
  } catch (error) {
    return null;
  }
}

// Extract and verify session from request (Cookies or Bearer Header)
export async function getSessionFromRequest(request?: NextRequest): Promise<AuthSession | null> {
  let token: string | undefined;

  if (request) {
    // 1. Check Authorization Header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // 2. Check Cookie in request
    if (!token) {
      token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    }
  }

  // 3. Check Next.js server cookie store if still not found
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    } catch {
      // In some context cookies() might throw
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

// Server-side RBAC Guard for Route Handlers
export async function verifyAuth(
  request: NextRequest,
  allowedRoles?: UserRole[]
): Promise<{ session: AuthSession | null; errorResponse: NextResponse | null }> {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return {
      session: null,
      errorResponse: NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required' },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    return {
      session: null,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: `Forbidden: Access restricted to [${allowedRoles.join(', ')}]`,
        },
        { status: 403 }
      ),
    };
  }

  return { session, errorResponse: null };
}

export { AUTH_COOKIE_NAME };
