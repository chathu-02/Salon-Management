import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, AUTH_COOKIE_NAME } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = db.getUserById(session.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const { password_hash, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch session' },
      { status: 500 }
    );
  }
}
