"use client";

import { useEffect, useState } from "react";
import DashboardLayout from '@/components/DashboardLayout';
import { Appointment, AppointmentStatus, Service, User } from '@/lib/types';
import {
  Calendar,
  Clock,
  User as UserIcon,
  Scissors,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  PlusCircle,
  CreditCard,
  Phone,
  Mail,
  Edit,
  X,
  AlertCircle,
} from "lucide-react";

export default function ReceptionAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Book on Behalf Modal
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"EXISTING" | "WALKIN">("WALKIN");
  const [bookingForm, setBookingForm] = useState({
    target_client_id: "",
    custom_client_name: "",
    custom_client_phone: "",
    custom_client_email: "",
    service_id: "",
    appointment_date: new Date().toISOString().split("T")[0],
    appointment_time: "11:00",
    notes: "",
    payment_method: "CASH",
  });
  const [bookLoading, setBookLoading] = useState(false);
  const [bookError, setBookError] = useState("");

  // Manage Status Modal
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (dateFilter) params.append("date", dateFilter);
      if (searchTerm) params.append("search", searchTerm);

      const [aptRes, srvRes, cliRes] = await Promise.all([
        fetch(`/api/appointments?${params.toString()}`),
        fetch("/api/services"),
        fetch("/api/reception/clients"),
      ]);

      const [aptData, srvData, cliData] = await Promise.all([
        aptRes.json(),
        srvRes.json(),
        cliRes.json(),
      ]);

      if (aptData.success) setAppointments(aptData.data);
      if (srvData.success) setServices(srvData.data);
      if (cliData.success) setClients(cliData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, dateFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookLoading(true);
    setBookError("");
    try {
      const payload: any = {
        service_id: bookingForm.service_id,
        appointment_date: bookingForm.appointment_date,
        appointment_time: bookingForm.appointment_time,
        notes: bookingForm.notes,
        payment_method: bookingForm.payment_method,
      };

      if (bookingType === "EXISTING") {
        payload.target_client_id = bookingForm.target_client_id;
      } else {
        payload.custom_client_name = bookingForm.custom_client_name;
        payload.custom_client_phone = bookingForm.custom_client_phone;
        payload.custom_client_email = bookingForm.custom_client_email || `${bookingForm.custom_client_name.toLowerCase().replace(/\s+/g, '')}@walkin.thecrown.com`;
      }

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setBookModalOpen(false);
        setBookingForm({
          target_client_id: "",
          custom_client_name: "",
          custom_client_phone: "",
          custom_client_email: "",
          service_id: "",
          appointment_date: new Date().toISOString().split("T")[0],
          appointment_time: "11:00",
          notes: "",
          payment_method: "CASH",
        });
        fetchData();
      } else {
        setBookError(data.error || "Failed to book appointment");
      }
    } catch (err: any) {
      setBookError(err.message || "Network error");
    } finally {
      setBookLoading(false);
    }
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
        fetchData();
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

  return (
    <DashboardLayout
      allowedRole="RECEPTIONIST"
      title="Appointments & Front Desk Agenda"
      subtitle="Coordinate client arrivals, book appointments on behalf of walk-ins, and manage service completions."
    >
      <div className="space-y-6">
        
        {/* Controls & Book on Behalf Button */}
        <div className="bg-[#021a12] border border-[#B38B4D]/30 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by customer name, phone or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] placeholder-white/30 focus:outline-none focus:border-[#B38B4D]"
            />
          </form>

          <div className="flex flex-wrap items-center gap-3">
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
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-black/40 border border-[#B38B4D]/30 text-xs text-[#F5F5F0] rounded-xl px-3 py-2 focus:outline-none focus:border-[#B38B4D]"
            />

            <button
              onClick={() => setBookModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold flex items-center space-x-2 shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book For Client</span>
            </button>
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
              <p className="text-xs">No bookings matching current criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 border-b border-[#B38B4D]/20 text-[11px] font-bold uppercase tracking-wider text-white/50">
                    <th className="p-4">Time & Date</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Requested Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4 text-right">Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-[#B38B4D]" />
                          <div>
                            <p className="font-semibold text-[#F5F5F0]">{apt.appointment_time}</p>
                            <p className="text-xs text-white/50">{apt.appointment_date}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold">
                            {(apt.client_name || "C").charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#F5F5F0]">{apt.client_name}</p>
                            <p className="text-xs text-white/50">{apt.client_phone || apt.client_email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-[#F5F5F0]">{apt.service?.name}</p>
                        <p className="text-xs text-[#B38B4D]">
                          Rs. {apt.service?.price.toLocaleString()} ({apt.service?.duration_minutes} mins)
                        </p>
                      </td>

                      <td className="p-4">
                        {getStatusBadge(apt.status)}
                      </td>

                      <td className="p-4">
                        {apt.payment?.payment_status === "PAID" ? (
                          <span className="text-xs font-semibold text-emerald-400 flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Paid ({apt.payment.payment_method})
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-amber-400 flex items-center">
                            <CreditCard className="w-3.5 h-3.5 mr-1" /> Unpaid (Collect)
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedApt(apt)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#B38B4D] hover:text-[#021a12] border border-[#B38B4D]/30 text-xs font-semibold transition-all"
                        >
                          Check-in / Action
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

      {/* Book on Behalf Modal */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#021a12] border border-[#B38B4D]/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-[#B38B4D]" />
                <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">
                  Book on Behalf of Customer
                </h3>
              </div>
              <button
                onClick={() => setBookModalOpen(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookError}</span>
              </div>
            )}

            {/* Toggle Walk-in or Existing */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setBookingType("WALKIN")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  bookingType === "WALKIN" ? "bg-[#B38B4D] text-[#021a12]" : "text-white/60 hover:text-white"
                }`}
              >
                Walk-in Customer
              </button>
              <button
                type="button"
                onClick={() => setBookingType("EXISTING")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  bookingType === "EXISTING" ? "bg-[#B38B4D] text-[#021a12]" : "text-white/60 hover:text-white"
                }`}
              >
                Existing Client
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              {bookingType === "WALKIN" ? (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Customer Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.custom_client_name}
                      onChange={(e) => setBookingForm({ ...bookingForm, custom_client_name: e.target.value })}
                      placeholder="Jane Walkin"
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.custom_client_phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, custom_client_phone: e.target.value })}
                      placeholder="+94 77 123 4567"
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Select Existing Client
                  </label>
                  <select
                    required
                    value={bookingForm.target_client_id}
                    onChange={(e) => setBookingForm({ ...bookingForm, target_client_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                  >
                    <option value="">Select registered client...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone || c.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                  Service
                </label>
                <select
                  required
                  value={bookingForm.service_id}
                  onChange={(e) => setBookingForm({ ...bookingForm, service_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                >
                  <option value="">Select treatment service...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - Rs. {s.price.toLocaleString()} ({s.duration_minutes}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.appointment_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, appointment_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Time Slot
                  </label>
                  <input
                    type="time"
                    required
                    value={bookingForm.appointment_time}
                    onChange={(e) => setBookingForm({ ...bookingForm, appointment_time: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                  Payment Method
                </label>
                <select
                  value={bookingForm.payment_method}
                  onChange={(e) => setBookingForm({ ...bookingForm, payment_method: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                >
                  <option value="CASH">Cash at Salon</option>
                  <option value="CARD">Card at POS</option>
                </select>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setBookModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F5F5F0] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold shadow-lg"
                >
                  {bookLoading ? "Booking..." : "Create Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check-in & Status Management Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#021a12] border border-[#B38B4D]/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-[#B38B4D]" />
                <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">
                  Front Desk Action
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

            <div className="bg-black/40 rounded-2xl p-4 space-y-2 text-xs border border-white/5">
              <div className="flex justify-between">
                <span className="text-white/50">Customer:</span>
                <span className="font-bold text-[#F5F5F0]">{selectedApt.client_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Service:</span>
                <span className="font-bold text-[#B38B4D]">{selectedApt.service?.name} (Rs. {selectedApt.service?.price.toLocaleString()})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Current Status:</span>
                <div>{getStatusBadge(selectedApt.status)}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                disabled={actionLoading || selectedApt.status === "CONFIRMED"}
                onClick={() => updateStatus(selectedApt.id, "CONFIRMED")}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Customer Arrived — Confirm Booking</span>
              </button>

              <button
                disabled={actionLoading || selectedApt.status === "COMPLETED"}
                onClick={() => updateStatus(selectedApt.id, "COMPLETED")}
                className="w-full py-3 px-4 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30 text-xs font-bold transition-all flex items-center justify-center space-x-2"
              >
                <Scissors className="w-4 h-4" />
                <span>Service Finished — Mark Completed</span>
              </button>

              <button
                disabled={actionLoading || selectedApt.status === "CANCELLED"}
                onClick={() => updateStatus(selectedApt.id, "CANCELLED")}
                className="w-full py-3 px-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 text-xs font-bold transition-all flex items-center justify-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Appointment</span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedApt(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#F5F5F0] text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
