import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    const { data: inventory, error } = await supabase
      .from('inventory')
      .select('*')
      .order('item_name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: inventory });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { item_name, category, current_stock, min_threshold } = body;

    const { data, error } = await supabase
      .from('inventory')
      .insert([
        { item_name, category, current_stock, min_threshold }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Inventory item added successfully!', data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, current_stock } = body;

    const { data, error } = await supabase
      .from('inventory')
      .update({ 
        current_stock, 
        last_updated: new Date().toISOString() 
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Stock updated successfully!', data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}