"use client";

import { useEffect, useState } from "react";
import { Clock, User, Scissors } from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointments');
        const result = await res.json();
        if (result.success) {
          setAppointments(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50';
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900/50';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900/50';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage and view all upcoming bookings.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {appointments.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No appointments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date & Time</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Service</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {appointments.map((apt: any) => (
                    <tr key={apt.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            {new Date(apt.appointment_time).toLocaleString('en-US', {
                              weekday: 'short', month: 'short', day: 'numeric',
                              hour: 'numeric', minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{apt.profiles?.full_name || 'Guest User'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Scissors className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {apt.services?.name || 'Unknown Service'}
                            <span className="text-xs text-muted-foreground ml-2">
                              ({apt.services?.duration_minutes}m)
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                          {apt.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
