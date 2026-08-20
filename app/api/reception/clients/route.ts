import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { session, errorResponse } = await verifyAuth(request, ['OWNER', 'RECEPTIONIST']);
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').toLowerCase();

    const clients = db.getUsers().filter((u) => u.role === 'CLIENT');
    const appointments = db.getAppointments();

    const result = clients
      .filter(
        (c) =>
          !query ||
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          (c.phone && c.phone.toLowerCase().includes(query))
      )
      .map((client) => {
        const clientApts = appointments.filter((a) => a.client_id === client.id);
        const totalVisits = clientApts.filter((a) => a.status === 'COMPLETED').length;
        const upcomingApt = clientApts.find(
          (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
        );
        return {
          ...client,
          totalVisits,
          totalAppointments: clientApts.length,
          upcomingAppointment: upcomingApt || null,
          recentAppointments: clientApts.slice(0, 3),
        };
      });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
