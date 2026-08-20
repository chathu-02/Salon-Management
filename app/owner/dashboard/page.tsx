"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from '@/components/DashboardLayout';
import {
  Calendar,
  CreditCard,
  Users,
  Scissors,
  Star,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  Plus,
  RefreshCw,
} from "lucide-react";

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <DashboardLayout
      allowedRole="OWNER"
      title="Executive Salon Dashboard"
      subtitle="Complete overview of salon operations, real-time revenue, and customer feedback."
    >
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B38B4D]"></div>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          
          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#021a12] p-4 rounded-2xl border border-[#B38B4D]/30 shadow-lg">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-white/80">Salon System Operational & Live</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchStats}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#B38B4D] border border-white/10 text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Metrics</span>
              </button>
              <Link
                href="/owner/services"
                className="px-3.5 py-2 rounded-xl bg-[#B38B4D] text-[#021a12] text-xs font-bold flex items-center space-x-1.5 hover:brightness-110 transition-all shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </Link>
              <Link
                href="/owner/users"
                className="px-3.5 py-2 rounded-xl bg-white/10 text-[#F5F5F0] hover:bg-white/20 border border-white/20 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-[#B38B4D]" />
                <span>Create Staff</span>
              </Link>
            </div>
          </div>

          {/* Primary KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Monthly Revenue */}
            <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-[#B38B4D] transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <CreditCard className="w-16 h-16 text-[#B38B4D]" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/50">Monthly Revenue</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] mt-2 font-serif">
                Rs. {stats.monthlyRevenue.toLocaleString()}
              </h3>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-emerald-400 flex items-center font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> Today: Rs. {stats.todayRevenue.toLocaleString()}
                </span>
                <Link href="/owner/payments" className="text-[#B38B4D] hover:underline flex items-center font-medium">
                  Ledger <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </div>

            {/* Total Appointments */}
            <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-[#B38B4D] transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Calendar className="w-16 h-16 text-[#B38B4D]" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/50">Today's Schedule</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] mt-2 font-serif">
                {stats.todayAppointments} <span className="text-sm font-normal text-white/40">/ {stats.totalAppointments} total</span>
              </h3>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-amber-400 font-semibold flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" /> {stats.upcomingAppointments} Upcoming
                </span>
                <Link href="/owner/appointments" className="text-[#B38B4D] hover:underline flex items-center font-medium">
                  Schedule <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </div>

            {/* Total Clients */}
            <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-[#B38B4D] transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Users className="w-16 h-16 text-[#B38B4D]" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/50">Registered Clients</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] mt-2 font-serif">
                {stats.totalClients}
              </h3>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-blue-400 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {stats.completedAppointments} Completed Sessions
                </span>
                <Link href="/owner/users" className="text-[#B38B4D] hover:underline flex items-center font-medium">
                  Directory <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </div>

            {/* Average Rating */}
            <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-[#B38B4D] transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Star className="w-16 h-16 text-[#B38B4D]" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/50">Average Satisfaction</p>
              <div className="flex items-center space-x-2 mt-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] font-serif">
                  {stats.avgRating}
                </h3>
                <div className="flex text-amber-400">
                  {Array.from({ length: Math.round(stats.avgRating) }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-white/60">From {stats.totalReviews} reviews</span>
                <Link href="/owner/reviews" className="text-[#B38B4D] hover:underline flex items-center font-medium">
                  Feedback <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Detailed Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Status Breakdown & Operational Health */}
            <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-base font-bold text-[#F5F5F0] font-serif flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-[#B38B4D]" /> Appointment Statuses
                </h3>
                <span className="text-xs text-white/50">{stats.totalAppointments} Total</span>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Confirmed", count: stats.statusCounts.CONFIRMED, color: "bg-emerald-500", text: "text-emerald-400" },
                  { label: "Pending", count: stats.statusCounts.PENDING, color: "bg-amber-500", text: "text-amber-400" },
                  { label: "Completed", count: stats.statusCounts.COMPLETED, color: "bg-blue-500", text: "text-blue-400" },
                  { label: "Cancelled", count: stats.statusCounts.CANCELLED, color: "bg-red-500", text: "text-red-400" },
                  { label: "No-Show", count: stats.statusCounts.NO_SHOW, color: "bg-gray-500", text: "text-gray-400" },
                ].map((item) => {
                  const percent = stats.totalAppointments > 0 ? (item.count / stats.totalAppointments) * 100 : 0;
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/80 font-medium">{item.label}</span>
                        <span className={`font-bold ${item.text}`}>{item.count} ({percent.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-300">Pending Receivables:</span>
                </div>
                <span className="font-bold text-amber-300">Rs. {stats.pendingPaymentsAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Service Popularity Rankings */}
            <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-base font-bold text-[#F5F5F0] font-serif flex items-center">
                  <Scissors className="w-4 h-4 mr-2 text-[#B38B4D]" /> Service Popularity
                </h3>
                <Link href="/owner/services" className="text-xs text-[#B38B4D] hover:underline">
                  Manage Services
                </Link>
              </div>

              <div className="space-y-4">
                {stats.servicePopularity.map((srv: any, idx: number) => (
                  <div key={srv.name} className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#B38B4D]/20 text-[#B38B4D] flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#F5F5F0] truncate">{srv.name}</p>
                        <p className="text-[10px] text-white/50">{srv.category} • Rs. {srv.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#B38B4D] shrink-0 ml-2">
                      {srv.count} bookings
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Client Reviews Stream */}
            <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-base font-bold text-[#F5F5F0] font-serif flex items-center">
                  <Star className="w-4 h-4 mr-2 text-amber-400" /> Recent Feedback
                </h3>
                <Link href="/owner/reviews" className="text-xs text-[#B38B4D] hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {stats.recentReviews.length === 0 ? (
                  <p className="text-xs text-white/50 text-center py-6">No customer reviews yet.</p>
                ) : (
                  stats.recentReviews.map((rev: any) => (
                    <div key={rev.id} className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F5F5F0]">{rev.client_name}</span>
                        <div className="flex text-amber-400 text-xs">
                          {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                        </div>
                      </div>
                      <p className="text-xs text-white/70 italic line-clamp-2">"{rev.comment}"</p>
                      <span className="text-[10px] text-[#B38B4D] block font-mono">{rev.service_name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      ) : null}
    </DashboardLayout>
  );
}
