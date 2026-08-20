import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET all reviews (Public or filtered by serviceId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId') || undefined;

    const reviews = db.getReviews(serviceId);
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST review (CLIENT only)
export async function POST(request: NextRequest) {
  const { session, errorResponse } = await verifyAuth(request, ['CLIENT']);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { appointment_id, rating, comment } = body;

    if (!appointment_id || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID, rating (1-5), and comment are required' },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const appointment = db.getAppointmentById(appointment_id);
    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    // Rule: Must be own appointment
    if (appointment.client_id !== session!.id) {
      return NextResponse.json(
        { success: false, error: 'You can only review your own appointments' },
        { status: 403 }
      );
    }

    // Rule: Appointment must be COMPLETED
    if (appointment.status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Reviews can only be submitted after your appointment is completed' },
        { status: 400 }
      );
    }

    // Rule: Prevent duplicate reviews for the same appointment
    const existingReviews = db.getReviews();
    const alreadyReviewed = existingReviews.some((r) => r.appointment_id === appointment_id);
    if (alreadyReviewed || appointment.review_submitted) {
      return NextResponse.json(
        { success: false, error: 'A review has already been submitted for this appointment' },
        { status: 400 }
      );
    }

    const client = db.getUserById(session!.id);
    const service = db.getServiceById(appointment.service_id);

    const newReview = db.createReview({
      appointment_id,
      client_id: session!.id,
      client_name: client?.name || session!.name,
      client_avatar: client?.avatar_url,
      service_id: appointment.service_id,
      service_name: service?.name || 'Salon Service',
      rating: ratingNum,
      comment,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your valuable feedback! Your review has been published.',
      data: newReview,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
