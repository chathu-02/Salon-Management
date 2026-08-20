import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { AppointmentStatus, PaymentStatus } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, errorResponse } = await verifyAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const appointment = db.getAppointmentById(id);

    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    // Role check: CLIENT can only view their own
    if (session!.role === 'CLIENT' && appointment.client_id !== session!.id) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: appointment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, errorResponse } = await verifyAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const appointment = db.getAppointmentById(id);

    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    const body = await request.json();
    const { status, appointment_date, appointment_time, notes } = body;

    // RBAC validation
    if (session!.role === 'CLIENT') {
      // Must be own appointment
      if (appointment.client_id !== session!.id) {
        return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
      }

      // Client can only cancel or request reschedule
      if (status && status !== 'CANCELLED') {
        return NextResponse.json(
          { success: false, error: 'Clients can only cancel or reschedule their bookings' },
          { status: 403 }
        );
      }
    }

    const updates: Partial<typeof appointment> = {};
    if (status) updates.status = status as AppointmentStatus;
    if (appointment_date) updates.appointment_date = appointment_date;
    if (appointment_time) updates.appointment_time = appointment_time;
    if (notes !== undefined) updates.notes = notes;

    const updated = db.updateAppointment(id, updates);

    // If appointment is marked COMPLETED by staff and payment is still PENDING with cash/card, we can also auto-update or sync payment if requested
    if (status === 'COMPLETED' && appointment.payment_id && (session!.role === 'OWNER' || session!.role === 'RECEPTIONIST')) {
      const payment = db.getPayments().find((p) => p.id === appointment.payment_id);
      if (payment && payment.payment_status === 'PENDING') {
        db.updatePayment(payment.id, {
          payment_status: 'PAID',
          paid_at: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment updated successfully',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
