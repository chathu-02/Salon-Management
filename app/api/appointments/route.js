import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase'; 

export async function GET() {
  try {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_time,
        status,
        profiles:customer_id (full_name, phone_number),
        services:service_id (name, price, duration_minutes)
      `)
      .order('appointment_time', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_id, service_id, staff_id, appointment_time } = body;

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          customer_id,
          service_id,
          staff_id,
          appointment_time,
          status: 'pending'
        }
      ])
      .select();

    if (error) throw error;


    return NextResponse.json({ success: true, message: 'Appointment booked successfully!', data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}