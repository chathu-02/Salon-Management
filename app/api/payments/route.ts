import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { PaymentStatus } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { session, errorResponse } = await verifyAuth(request, ['OWNER', 'RECEPTIONIST']);
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') as PaymentStatus) || undefined;
    const clientId = searchParams.get('clientId') || undefined;

    const payments = db.getPayments({ status, clientId });
    return NextResponse.json({ success: true, data: payments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
