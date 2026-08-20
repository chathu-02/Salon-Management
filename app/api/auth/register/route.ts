import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Clients register with role 'CLIENT' only
    const newUser = db.createUser({
      name,
      email,
      password_hash: hashedPassword,
      role: 'CLIENT',
      phone: phone || '',
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop`,
      is_active: true,
    });

    const sessionPayload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    };

    const token = await signToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      message: 'Registration successful! Welcome to The Crown Aesthetics.',
      user: newUser,
      token,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
