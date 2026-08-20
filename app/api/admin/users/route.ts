import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, hashPassword } from '@/lib/auth';
import { UserRole } from '@/lib/types';

// GET users (OWNER only)
export async function GET(request: NextRequest) {
  const { session, errorResponse } = await verifyAuth(request, ['OWNER']);
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const role = (searchParams.get('role') as UserRole) || undefined;
    const search = searchParams.get('search') || undefined;

    let users = db.getUsers();
    if (role) {
      users = users.filter((u) => u.role === role);
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create staff/user (OWNER only)
export async function POST(request: NextRequest) {
  const { session, errorResponse } = await verifyAuth(request, ['OWNER']);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { name, email, password, role = 'RECEPTIONIST', phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = db.createUser({
      name,
      email,
      password_hash: hashedPassword,
      role: role as UserRole,
      phone: phone || '',
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop`,
      is_active: true,
    });

    return NextResponse.json({
      success: true,
      message: `${role} account created successfully!`,
      data: newUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
