import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide both email and password' },
        { status: 400 }
      );
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, error: 'This account has been deactivated. Please contact salon management.' },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, user.password_hash || '');
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const sessionPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = await signToken(sessionPayload);

    const { password_hash, ...safeUser } = user;

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: safeUser,
      token,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
