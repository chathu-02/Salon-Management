import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { AppointmentStatus, PaymentMethod, PaymentStatus } from '@/lib/types';

// GET all appointments (OWNER & RECEPTIONIST only)
export async function GET(request: NextRequest) {
  const { session, errorResponse } = await verifyAuth(request, ['OWNER', 'RECEPTIONIST']);
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || undefined;
    const status = (searchParams.get('status') as AppointmentStatus) || undefined;
    const search = searchParams.get('search') || undefined;

    const appointments = db.getAppointments({ date, status, search });
    return NextResponse.json({ success: true, data: appointments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create appointment (All authenticated roles)
export async function POST(request: NextRequest) {
  const { session, errorResponse } = await verifyAuth(request, ['OWNER', 'RECEPTIONIST', 'CLIENT']);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const {
      service_id,
      appointment_date,
      appointment_time,
      notes,
      payment_method = 'CASH',
      custom_client_name,
      custom_client_phone,
      custom_client_email,
      target_client_id,
    } = body;

    if (!service_id || !appointment_date || !appointment_time) {
      return NextResponse.json(
        { success: false, error: 'Service, date, and time are required' },
        { status: 400 }
      );
    }

    const service = db.getServiceById(service_id);
    if (!service) {
      return NextResponse.json({ success: false, error: 'Selected service not found' }, { status: 404 });
    }

    // Determine client info based on authenticated user & role
    let clientId = session!.id;
    let clientName = session!.name;
    let clientEmail = session!.email;
    let clientPhone = '';

    if (session!.role === 'CLIENT') {
      // Strict rule: Clients can only book for themselves
      const user = db.getUserById(session!.id);
      clientId = session!.id;
      clientName = user?.name || session!.name;
      clientEmail = user?.email || session!.email;
      clientPhone = user?.phone || '';
    } else {
      // Staff (Owner / Receptionist) booking on behalf of customer
      if (target_client_id) {
        const targetUser = db.getUserById(target_client_id);
        if (targetUser) {
          clientId = targetUser.id;
          clientName = targetUser.name;
          clientEmail = targetUser.email;
          clientPhone = targetUser.phone || '';
        }
      } else if (custom_client_name) {
        clientName = custom_client_name;
        clientPhone = custom_client_phone || '';
        clientEmail = custom_client_email || 'walkin@thecrown.com';
        // Generate or look up walk-in user
        let existingUser = db.getUserByEmail(clientEmail);
        if (!existingUser) {
          existingUser = db.createUser({
            name: clientName,
            email: clientEmail,
            role: 'CLIENT',
            phone: clientPhone,
            is_active: true,
          });
        }
        clientId = existingUser.id;
      }
    }

    const appointmentStatus: AppointmentStatus =
      payment_method === 'ONLINE' ? 'CONFIRMED' : 'PENDING';
    const paymentStatus: PaymentStatus =
      payment_method === 'ONLINE' ? 'PAID' : 'PENDING';

    const newApt = db.createAppointment({
      client_id: clientId,
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone,
      service_id,
      appointment_date,
      appointment_time,
      status: appointmentStatus,
      notes: notes || '',
    });

    // Create corresponding payment ledger entry
    const newPayment = db.createPayment({
      appointment_id: newApt.id,
      client_id: clientId,
      client_name: clientName,
      amount: service.price,
      payment_method: payment_method as PaymentMethod,
      payment_status: paymentStatus,
      transaction_id:
        payment_method === 'ONLINE'
          ? 'TXN-ONLINE-' + Date.now().toString(36).toUpperCase()
          : 'TXN-SALON-' + Date.now().toString(36).toUpperCase(),
      paid_at: paymentStatus === 'PAID' ? new Date().toISOString() : null,
    });

    // Link payment ID to appointment
    db.updateAppointment(newApt.id, { payment_id: newPayment.id });

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully!',
      data: {
        ...newApt,
        service,
        payment: newPayment,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
