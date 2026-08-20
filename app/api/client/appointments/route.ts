import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET appointments for authenticated client
export async function GET(request: NextRequest) {
  const { session, errorResponse } = await verifyAuth(request, ['CLIENT', 'OWNER', 'RECEPTIONIST']);
  if (errorResponse) return errorResponse;

  try {
    const appointments = db.getAppointments({ clientId: session!.id });
    return NextResponse.json({ success: true, data: appointments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
