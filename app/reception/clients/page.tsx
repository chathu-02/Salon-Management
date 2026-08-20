"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from '@/components/DashboardLayout';
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  PlusCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export default function ReceptionClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reception/clients?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.success) {
        setClients(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClients();
  };

  return (
    <DashboardLayout
      allowedRole="RECEPTIONIST"
      title="Client Directory & Visit History"
      subtitle="Quickly search clients, look up previous salon visits, and book follow-up appointments."
    >
      <div className="space-y-6">
        
        {/* Search Bar */}
        <div className="bg-[#021a12] border border-[#B38B4D]/30 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
          <form onSubmit={handleSearch} className="flex-1 relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search clients by full name, phone number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] placeholder-white/30 focus:outline-none focus:border-[#B38B4D]"
            />
          </form>

          <Link
            href="/reception/appointments"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold flex items-center space-x-2 shadow-lg transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Booking</span>
          </Link>
        </div>

        {/* Clients Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
          </div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center text-white/60 bg-[#021a12] rounded-2xl border border-[#B38B4D]/30">
            <Users className="w-12 h-12 mx-auto text-white/20 mb-3" />
            <h4 className="text-base font-bold text-white/80">No clients found</h4>
            <p className="text-xs">Try searching for another name or telephone number.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((cli) => (
              <div
                key={cli.id}
                className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl space-y-4 hover:border-[#B38B4D] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#B38B4D]/20 border border-[#B38B4D]/40 flex items-center justify-center font-bold text-[#B38B4D] text-lg font-serif">
                      {cli.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[#F5F5F0] font-serif text-base truncate">{cli.name}</h3>
                      <span className="text-[11px] font-semibold text-emerald-400">
                        {cli.totalVisits} Completed Visits
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-white/70 bg-black/40 p-3.5 rounded-xl border border-white/5">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-[#B38B4D]" />
                      <span>{cli.phone || "No phone number"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-[#B38B4D]" />
                      <span className="truncate">{cli.email}</span>
                    </div>
                  </div>

                  {cli.upcomingAppointment && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                      <span className="text-amber-300 font-semibold block">Upcoming Visit:</span>
                      <span className="text-white/80">{cli.upcomingAppointment.appointment_date} at {cli.upcomingAppointment.appointment_time}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end">
                  <Link
                    href={`/reception/appointments`}
                    className="w-full text-center py-2 rounded-xl bg-white/5 hover:bg-[#B38B4D] hover:text-[#021a12] text-xs font-semibold text-[#F5F5F0] border border-white/10 transition-colors"
                  >
                    Schedule Booking
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
