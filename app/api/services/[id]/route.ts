import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await verifyAuth(request, ['OWNER']);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const body = await request.json();

    const updated = db.updateService(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
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
  const { errorResponse } = await verifyAuth(request, ['OWNER']);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const success = db.deleteService(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
