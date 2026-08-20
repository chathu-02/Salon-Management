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
} from "lucide-react";

export default function ReceptionDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reception/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Failed to load reception stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <DashboardLayout
      allowedRole="RECEPTIONIST"
      title="Reception Front Desk"
      subtitle="Today's live schedule, customer arrivals, walk-in bookings, and desk payment collection."
    >
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B38B4D]"></div>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          
          {/* Quick Action Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#021a12] p-5 rounded-2xl border border-[#B38B4D]/30 shadow-lg">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F0]">Front Desk Active</h3>
                <p className="text-xs text-white/50">Managing client check-ins and appointments</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/reception/appointments"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold flex items-center space-x-2 shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Book on Behalf of Client</span>
              </Link>

              <Link
                href="/reception/payments"
                className="px-4 py-2.5 rounded-xl bg-white/10 text-[#F5F5F0] hover:bg-white/20 border border-white/20 text-xs font-semibold flex items-center space-x-2 transition-colors"
              >
                <CreditCard className="w-4 h-4 text-[#B38B4D]" />
                <span>Collect Payments</span>
              </Link>
            </div>
          </div>

          {/* Operational Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Today's Appointments */}
            <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">Today's Schedule</p>
                <Calendar className="w-5 h-5 text-[#B38B4D]" />
              </div>
              <h3 className="text-3xl font-bold text-[#F5F5F0] mt-2 font-serif">
                {stats.todayAppointmentsCount}
              </h3>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-semibold">{stats.todayCustomerCount} Clients Today</span>
                <Link href="/reception/appointments" className="text-[#B38B4D] hover:underline flex items-center">
                  View <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">Upcoming Bookings</p>
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-3xl font-bold text-amber-400 mt-2 font-serif">
                {stats.upcomingAppointments}
              </h3>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-white/60">Confirmed / Pending</span>
                <Link href="/reception/appointments" className="text-[#B38B4D] hover:underline flex items-center">
                  Agenda <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </div>

            {/* Pending Payments */}
            <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">Pending Payments</p>
                <CreditCard className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-3xl font-bold text-red-400 mt-2 font-serif">
                {stats.pendingPayments}
              </h3>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-white/60">Awaiting Settlement</span>
                <Link href="/reception/payments" className="text-[#B38B4D] hover:underline flex items-center">
                  Collect <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </div>

            {/* Completed Today */}
            <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">Completed Sessions</p>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-400 mt-2 font-serif">
                {stats.completedAppointments}
              </h3>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-white/60">Finished today</span>
                <Link href="/reception/appointments" className="text-[#B38B4D] hover:underline flex items-center">
                  Details <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Standard Reception Workflow Diagram */}
          <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#F5F5F0] font-serif flex items-center">
              <Scissors className="w-4 h-4 mr-2 text-[#B38B4D]" /> Salon Service & Payment Workflow
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-1">
                <span className="w-6 h-6 rounded-full bg-[#B38B4D]/20 text-[#B38B4D] text-xs font-bold flex items-center justify-center">1</span>
                <h4 className="text-sm font-bold text-[#F5F5F0] mt-2">Customer Arrives</h4>
                <p className="text-xs text-white/60">Find appointment on the agenda and mark Confirmed.</p>
              </div>

              <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-1">
                <span className="w-6 h-6 rounded-full bg-[#B38B4D]/20 text-[#B38B4D] text-xs font-bold flex items-center justify-center">2</span>
                <h4 className="text-sm font-bold text-[#F5F5F0] mt-2">Provide Service</h4>
                <p className="text-xs text-white/60">Salon stylists execute the requested treatment.</p>
              </div>

              <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-1">
                <span className="w-6 h-6 rounded-full bg-[#B38B4D]/20 text-[#B38B4D] text-xs font-bold flex items-center justify-center">3</span>
                <h4 className="text-sm font-bold text-[#F5F5F0] mt-2">Collect Payment</h4>
                <p className="text-xs text-white/60">Accept Cash or Card at reception and mark as PAID.</p>
              </div>

              <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-1">
                <span className="w-6 h-6 rounded-full bg-[#B38B4D]/20 text-[#B38B4D] text-xs font-bold flex items-center justify-center">4</span>
                <h4 className="text-sm font-bold text-[#F5F5F0] mt-2">Complete Appointment</h4>
                <p className="text-xs text-white/60">System prompts client to leave review upon completion.</p>
              </div>
            </div>
          </div>

        </div>
      ) : null}
    </DashboardLayout>
  );
}
