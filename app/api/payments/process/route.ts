import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { PaymentMethod, PaymentStatus } from '@/lib/types';

export async function POST(request: NextRequest) {
  const { session, errorResponse } = await verifyAuth(request, ['OWNER', 'RECEPTIONIST', 'CLIENT']);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { payment_id, appointment_id, payment_method, mark_appointment_completed } = body;

    let payment = payment_id ? db.getPayments().find((p) => p.id === payment_id) : undefined;

    if (!payment && appointment_id) {
      payment = db.getPayments().find((p) => p.appointment_id === appointment_id);
    }

    if (!payment) {
      return NextResponse.json({ success: false, error: 'Payment record not found' }, { status: 404 });
    }

    // Role check: CLIENT can only pay their own payment
    if (session!.role === 'CLIENT' && payment.client_id !== session!.id) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const updatedPayment = db.updatePayment(payment.id, {
      payment_status: 'PAID',
      payment_method: (payment_method || payment.payment_method) as PaymentMethod,
      paid_at: new Date().toISOString(),
      transaction_id: 'TXN-CONFIRMED-' + Date.now().toString(36).toUpperCase(),
    });

    // If receptionist or owner requests to mark appointment completed, or if appointment is confirmed
    if (payment.appointment_id) {
      const apt = db.getAppointmentById(payment.appointment_id);
      if (apt) {
        if (mark_appointment_completed || session!.role === 'RECEPTIONIST' || session!.role === 'OWNER') {
          db.updateAppointment(apt.id, {
            status: mark_appointment_completed ? 'COMPLETED' : 'CONFIRMED',
          });
        } else if (apt.status === 'PENDING') {
          db.updateAppointment(apt.id, { status: 'CONFIRMED' });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment processed and verified successfully!',
      data: updatedPayment,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
