import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET all services (public or all for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    // If 'all' is requested, verify if OWNER or return active only
    const services = db.getServices(!all);
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create service (OWNER only)
export async function POST(request: NextRequest) {
  const { session, errorResponse } = await verifyAuth(request, ['OWNER']);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { name, category, price, duration_minutes, description, image_url, is_active } = body;

    if (!name || price === undefined || duration_minutes === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and duration are required' },
        { status: 400 }
      );
    }

    const newService = db.createService({
      name,
      category: category || 'Hair Care',
      price: Number(price),
      duration_minutes: Number(duration_minutes),
      description: description || '',
      image_url: image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop',
      is_active: is_active !== undefined ? is_active : true,
    });

    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      data: newService,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
