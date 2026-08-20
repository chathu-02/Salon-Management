"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from '@/components/DashboardLayout';
import {
  Calendar,
  CreditCard,
  Users,
  CheckCircle2,
  Clock,
  UserCheck,
  PlusCircle,
  Scissors,
  ArrowRight,
  RefreshCw,
  Search,
  Sparkles,
  Phone,
  DollarSign,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  UserPlus
} from "lucide-react";
import { Appointment } from "@/lib/types";

export default function ReceptionDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, apptRes] = await Promise.all([
        fetch("/api/reception/stats"),
        fetch("/api/appointments")
      ]);

      const statsData = await statsRes.json();
      const apptData = await apptRes.json();

      if (statsData.success) {
        setStats(statsData.data);
      }
      if (apptData.success) {
        // Sort by date/time
        setAppointments(apptData.data || []);
      }
    } catch (err) {
      console.error("Failed to load reception dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh local list
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus as any } : a))
        );
        // Refresh stats
        fetch("/api/reception/stats")
          .then((r) => r.json())
          .then((d) => {
            if (d.success) setStats(d.data);
          });
      }
    } catch (e) {
      console.error("Error updating appointment status", e);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredAppointments = appointments
    .filter((a) => {
      const q = searchQuery.toLowerCase();
      return (
        (a.client_name || "").toLowerCase().includes(q) ||
        (a.service?.name || "").toLowerCase().includes(q) ||
        (a.client_phone || "").toLowerCase().includes(q) ||
        (a.status || "").toLowerCase().includes(q)
      );
    })
    .slice(0, 6);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Confirmed
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> Pending Check-in
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/70">
            {status}
          </span>
        );
    }
  };

  return (
    <DashboardLayout
      allowedRole="RECEPTIONIST"
      title="Receptionist Front Desk"
      subtitle="Today's live schedule, customer arrivals, walk-in bookings, and desk payment collection."
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#B38B4D] border-t-transparent animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-[#B38B4D] font-mono animate-pulse">
            Loading Live Desk Data...
          </p>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          
          {/* 1. Live Front Desk Header & Quick Controls */}
          <div className="bg-[#021a12] p-6 rounded-3xl border border-[#B38B4D]/35 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#B38B4D]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
                    Front Desk Active &bull; Live Terminal
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] font-serif">
                  Welcome to The Crown Reception
                </h2>
                <p className="text-xs sm:text-sm text-white/60 font-light">
                  Manage client arrivals, expedite salon check-ins, record cash/card billing, and manage walk-ins in real-time.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/reception/appointments"
                  className="btn-3d px-5 py-3 rounded-2xl bg-gradient-to-r from-[#B38B4D] via-[#c59e5f] to-[#B38B4D] bg-[length:200%_auto] animate-shimmer-btn text-[#021a12] text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-[0_0_20px_rgba(179,139,77,0.3)]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Walk-in Booking</span>
                </Link>

                <Link
                  href="/reception/payments"
                  className="btn-ghost-3d px-5 py-3 rounded-2xl bg-white/5 hover:bg-[#B38B4D]/15 text-[#F5F5F0] border border-[#B38B4D]/40 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md"
                >
                  <CreditCard className="w-4 h-4 text-[#B38B4D]" />
                  <span>Collect Payment (POS)</span>
                </Link>

                <button
                  onClick={fetchDashboardData}
                  title="Refresh desk data"
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:text-[#B38B4D] hover:border-[#B38B4D]/40 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* 2. Operational KPI Metric Cards (3D Interactive Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Today's Appointments */}
            <div className="card-3d bg-[#021a12] border border-[#B38B4D]/35 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">Today's Schedule</p>
                <div className="w-10 h-10 rounded-2xl bg-[#B38B4D]/15 border border-[#B38B4D]/30 flex items-center justify-center text-[#B38B4D] group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-[#F5F5F0] mt-3 font-serif">
                {stats.todayAppointmentsCount}
              </h3>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-semibold">{stats.todayCustomerCount} Scheduled Clients</span>
                <Link href="/reception/appointments" className="text-[#B38B4D] font-bold hover:underline flex items-center">
                  Agenda <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="card-3d bg-[#021a12] border border-amber-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">Upcoming Bookings</p>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-amber-400 mt-3 font-serif">
                {stats.upcomingAppointments}
              </h3>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60">Confirmed &amp; Pending</span>
                <Link href="/reception/appointments" className="text-amber-400 font-bold hover:underline flex items-center">
                  View Queue <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>

            {/* Pending Payments */}
            <div className="card-3d bg-[#021a12] border border-red-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">Pending Invoices</p>
                <div className="w-10 h-10 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-red-400 mt-3 font-serif">
                {stats.pendingPayments}
              </h3>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60">Awaiting Desk Settlement</span>
                <Link href="/reception/payments" className="text-red-400 font-bold hover:underline flex items-center">
                  Collect <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>

            {/* Completed Sessions */}
            <div className="card-3d bg-[#021a12] border border-emerald-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">Completed Rituals</p>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-emerald-400 mt-3 font-serif">
                {stats.completedAppointments}
              </h3>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60">Finished Today</span>
                <Link href="/reception/appointments" className="text-emerald-400 font-bold hover:underline flex items-center">
                  History <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>

          </div>

          {/* 3. Live Appointments & Queue Board */}
          <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Table Header & Instant Quick Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#F5F5F0] font-serif flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#B38B4D]" />
                  <span>Live Appointments &amp; Customer Arrivals</span>
                </h3>
                <p className="text-xs text-white/60">
                  Instant status updates and fast check-in for arriving patrons.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Quick Search Client / Service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-[#B38B4D] pl-10 pr-4 py-2.5 rounded-xl text-xs text-[#F5F5F0] placeholder-white/40 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* List / Table of Appointments */}
            {filteredAppointments.length === 0 ? (
              <div className="py-16 text-center bg-black/30 rounded-2xl border border-white/5 space-y-3">
                <Calendar className="w-10 h-10 text-white/20 mx-auto" />
                <p className="text-sm font-semibold text-white/70">No matching appointments found.</p>
                <p className="text-xs text-white/40">Use the button above to create a walk-in booking.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 uppercase tracking-wider font-semibold">
                      <th className="pb-3 px-3">Time &amp; Date</th>
                      <th className="pb-3 px-3">Client</th>
                      <th className="pb-3 px-3">Service &amp; Price</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Quick Desk Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-white/[0.02] transition-colors">
                        
                        {/* Time */}
                        <td className="py-4 px-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3.5 h-3.5 text-[#B38B4D]" />
                            <span className="font-bold text-[#F5F5F0]">{appt.appointment_time}</span>
                          </div>
                          <span className="text-[11px] text-white/50">{appt.appointment_date}</span>
                        </td>

                        {/* Client */}
                        <td className="py-4 px-3">
                          <div className="font-bold text-[#F5F5F0]">{appt.client_name || "Guest Client"}</div>
                          {appt.client_phone && (
                            <div className="text-[11px] text-white/50 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#B38B4D]" />
                              {appt.client_phone}
                            </div>
                          )}
                        </td>

                        {/* Service */}
                        <td className="py-4 px-3">
                          <div className="font-semibold text-white/90">{appt.service?.name || "Salon Treatment"}</div>
                          <div className="text-[11px] text-[#B38B4D] font-mono font-bold">
                            LKR {(appt.service?.price || appt.payment?.amount || 0).toLocaleString()}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-3">
                          {getStatusBadge(appt.status)}
                        </td>

                        {/* Quick Desk Actions */}
                        <td className="py-4 px-3 text-right">
                          <div className="inline-flex items-center space-x-2">
                            {appt.status === "PENDING" && (
                              <button
                                disabled={actionLoadingId === appt.id}
                                onClick={() => handleUpdateStatus(appt.id, "CONFIRMED")}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-[11px] font-bold transition-all"
                              >
                                {actionLoadingId === appt.id ? "Updating..." : "Check In"}
                              </button>
                            )}

                            {appt.status === "CONFIRMED" && (
                              <button
                                disabled={actionLoadingId === appt.id}
                                onClick={() => handleUpdateStatus(appt.id, "COMPLETED")}
                                className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 text-[11px] font-bold transition-all"
                              >
                                {actionLoadingId === appt.id ? "Updating..." : "Mark Done"}
                              </button>
                            )}

                            <Link
                              href="/reception/payments"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-[#B38B4D]/20 text-[#B38B4D] border border-white/10 hover:border-[#B38B4D]/40 transition-colors"
                              title="Collect Payment"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="pt-2 text-right">
              <Link
                href="/reception/appointments"
                className="inline-flex items-center space-x-1.5 text-xs text-[#B38B4D] font-bold hover:underline"
              >
                <span>View Full Salon Appointment Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* 4. Receptionist Workflow Steps */}
          <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#F5F5F0] font-serif flex items-center">
              <Scissors className="w-4 h-4 mr-2 text-[#B38B4D]" /> 
              <span>Standard Front Desk SOP &amp; Client Journey</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-[#B38B4D]/20 text-[#B38B4D] text-xs font-bold flex items-center justify-center">1</span>
                <h4 className="text-xs font-bold uppercase text-[#F5F5F0] pt-1">Client Check-In</h4>
                <p className="text-xs text-white/60 font-light">Locate arrival on schedule and click 'Check In'.</p>
              </div>

              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-[#B38B4D]/20 text-[#B38B4D] text-xs font-bold flex items-center justify-center">2</span>
                <h4 className="text-xs font-bold uppercase text-[#F5F5F0] pt-1">Provide Ritual</h4>
                <p className="text-xs text-white/60 font-light">Escort client to private suite or styling chair.</p>
              </div>

              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-[#B38B4D]/20 text-[#B38B4D] text-xs font-bold flex items-center justify-center">3</span>
                <h4 className="text-xs font-bold uppercase text-[#F5F5F0] pt-1">Desk POS Billing</h4>
                <p className="text-xs text-white/60 font-light">Accept Cash, Card, or Online transfer and issue receipt.</p>
              </div>

              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-[#B38B4D]/20 text-[#B38B4D] text-xs font-bold flex items-center justify-center">4</span>
                <h4 className="text-xs font-bold uppercase text-[#F5F5F0] pt-1">Complete &amp; Review</h4>
                <p className="text-xs text-white/60 font-light">Mark appointment complete; client is invited to leave a review.</p>
              </div>
            </div>
          </div>

        </div>
      ) : null}
    </DashboardLayout>
  );
}
