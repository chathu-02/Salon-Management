"use client";

import { useEffect, useState } from "react";
import DashboardLayout from '@/components/DashboardLayout';
import { Appointment, AppointmentStatus } from '@/lib/types';
import {
  Calendar,
  Clock,
  User,
  Scissors,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock3,
  CreditCard,
  Phone,
  Mail,
  Edit,
  X,
  AlertCircle,
} from "lucide-react";

export default function OwnerAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (dateFilter) params.append("date", dateFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(`/api/appointments?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments();
  };

  const updateStatus = async (aptId: string, newStatus: AppointmentStatus) => {
    setActionLoading(true);
    setActionError("");
    try {
      const res = await fetch(`/api/appointments/${aptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedApt(null);
        fetchAppointments();
      } else {
        setActionError(data.error || "Failed to update appointment");
      }
    } catch (err: any) {
      setActionError(err.message || "Network error");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Confirmed</span>;
      case "PENDING":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Pending</span>;
      case "COMPLETED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Completed</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">Cancelled</span>;
      case "NO_SHOW":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-300 border border-gray-500/30">No Show</span>;
    }
  };

  const getPaymentBadge = (payment?: any) => {
    if (!payment) return <span className="text-[11px] text-white/40">No Payment Info</span>;
    if (payment.payment_status === "PAID") {
      return (
        <span className="inline-flex items-center text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Paid ({payment.payment_method})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-xs font-semibold text-amber-400">
        <Clock3 className="w-3.5 h-3.5 mr-1" /> Unpaid ({payment.payment_method})
      </span>
    );
  };

  return (
    <DashboardLayout
      allowedRole="OWNER"
      title="Appointment Management"
      subtitle="Supervise all salon reservations, update booking lifecycles, and coordinate schedules."
    >
      <div className="space-y-6">
        
        {/* Search & Filters */}
        <div className="bg-[#021a12] border border-[#B38B4D]/30 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by client name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] placeholder-white/30 focus:outline-none focus:border-[#B38B4D]"
            />
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#B38B4D]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black/40 border border-[#B38B4D]/30 text-xs text-[#F5F5F0] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#B38B4D]"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-black/40 border border-[#B38B4D]/30 text-xs text-[#F5F5F0] rounded-xl px-3 py-2 focus:outline-none focus:border-[#B38B4D]"
            />

            {(statusFilter || dateFilter || searchTerm) && (
              <button
                onClick={() => {
                  setStatusFilter("");
                  setDateFilter("");
                  setSearchTerm("");
                }}
                className="text-xs text-white/60 hover:text-white underline px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center text-white/60 space-y-2">
              <Calendar className="w-12 h-12 mx-auto text-white/20" />
              <h4 className="text-base font-bold text-white/80">No appointments found</h4>
              <p className="text-xs">Adjust your search or filter parameters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 border-b border-[#B38B4D]/20 text-[11px] font-bold uppercase tracking-wider text-white/50">
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-[#B38B4D]" />
                          <div>
                            <p className="font-semibold text-[#F5F5F0]">{apt.appointment_date}</p>
                            <p className="text-xs text-white/50">{apt.appointment_time}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-[#B38B4D]">
                            {(apt.client_name || "G").charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#F5F5F0]">{apt.client_name || "Client"}</p>
                            <p className="text-xs text-white/50">{apt.client_phone || apt.client_email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Scissors className="w-4 h-4 text-[#B38B4D]" />
                          <div>
                            <p className="font-semibold text-[#F5F5F0]">{apt.service?.name || "Salon Service"}</p>
                            <p className="text-xs text-[#B38B4D]">
                              Rs. {apt.service?.price.toLocaleString()} ({apt.service?.duration_minutes}m)
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        {getStatusBadge(apt.status)}
                      </td>

                      <td className="p-4">
                        {getPaymentBadge(apt.payment)}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedApt(apt)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#B38B4D] hover:text-[#021a12] border border-[#B38B4D]/30 text-xs font-semibold transition-all"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Appointment Detail & Status Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#021a12] border border-[#B38B4D]/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-[#B38B4D]" />
                <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">
                  Manage Reservation
                </h3>
              </div>
              <button
                onClick={() => setSelectedApt(null)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="bg-black/40 rounded-2xl p-4 space-y-3 text-xs border border-white/5">
              <div className="flex justify-between">
                <span className="text-white/50">Client:</span>
                <span className="font-bold text-[#F5F5F0]">{selectedApt.client_name} ({selectedApt.client_phone || selectedApt.client_email})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Service:</span>
                <span className="font-bold text-[#B38B4D]">{selectedApt.service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Scheduled Slot:</span>
                <span className="font-bold text-[#F5F5F0]">{selectedApt.appointment_date} at {selectedApt.appointment_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Current Status:</span>
                <div>{getStatusBadge(selectedApt.status)}</div>
              </div>
              {selectedApt.notes && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-white/50 block mb-1">Client Notes:</span>
                  <p className="text-white/80 italic">"{selectedApt.notes}"</p>
                </div>
              )}
            </div>

            {/* Quick Status Update Actions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
                Update Appointment Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  disabled={actionLoading || selectedApt.status === "CONFIRMED"}
                  onClick={() => updateStatus(selectedApt.id, "CONFIRMED")}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-all disabled:opacity-30"
                >
                  Confirm Booking
                </button>

                <button
                  disabled={actionLoading || selectedApt.status === "COMPLETED"}
                  onClick={() => updateStatus(selectedApt.id, "COMPLETED")}
                  className="py-2.5 px-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30 text-xs font-bold transition-all disabled:opacity-30"
                >
                  Mark Completed
                </button>

                <button
                  disabled={actionLoading || selectedApt.status === "CANCELLED"}
                  onClick={() => updateStatus(selectedApt.id, "CANCELLED")}
                  className="py-2.5 px-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 text-xs font-bold transition-all disabled:opacity-30"
                >
                  Cancel Booking
                </button>

                <button
                  disabled={actionLoading || selectedApt.status === "NO_SHOW"}
                  onClick={() => updateStatus(selectedApt.id, "NO_SHOW")}
                  className="py-2.5 px-3 rounded-xl bg-gray-500/20 border border-gray-500/40 text-gray-300 hover:bg-gray-500/30 text-xs font-bold transition-all disabled:opacity-30"
                >
                  Mark No Show
                </button>

                <button
                  disabled={actionLoading || selectedApt.status === "PENDING"}
                  onClick={() => updateStatus(selectedApt.id, "PENDING")}
                  className="py-2.5 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all disabled:opacity-30"
                >
                  Set Pending
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedApt(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F5F5F0] text-xs font-semibold transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
