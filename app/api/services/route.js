import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true }); // Namata anuwa alphabetical order ekata gannawa

    if (error) throw error;

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, duration_minutes } = body;

    const { data, error } = await supabase
      .from('services')
      .insert([
        { name, description, price, duration_minutes, is_active: true }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Service added successfully!', data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, name, description, price, duration_minutes, is_active } = body;

    const { data, error } = await supabase
      .from('services')
      .update({ 
        name, 
        description, 
        price, 
        duration_minutes, 
        is_active 
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Service updated successfully!', data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}