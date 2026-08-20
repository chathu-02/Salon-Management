import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, hashPassword } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, errorResponse } = await verifyAuth(request, ['OWNER']);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, phone, is_active, role, password } = body;

    const user = db.getUserById(id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Owner cannot deactivate their own current account
    if (user.id === session!.id && is_active === false) {
      return NextResponse.json(
        { success: false, error: 'Cannot deactivate your own owner account' },
        { status: 400 }
      );
    }

    const updates: Partial<typeof user> = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (is_active !== undefined) updates.is_active = is_active;
    if (role && (role === 'OWNER' || role === 'RECEPTIONIST' || role === 'CLIENT')) {
      updates.role = role;
    }
    if (password && password.length >= 6) {
      updates.password_hash = await hashPassword(password);
    }

    const updated = db.updateUser(id, updates);

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, errorResponse } = await verifyAuth(request, ['OWNER']);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const user = db.getUserById(id);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Prevent deleting owner
    if (user.role === 'OWNER' || user.id === session!.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete primary Salon Owner account' },
        { status: 400 }
      );
    }

    const success = db.deleteUser(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'User account removed successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
