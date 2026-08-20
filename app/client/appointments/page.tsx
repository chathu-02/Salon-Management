"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from '@/components/DashboardLayout';
import { Appointment, AppointmentStatus } from '@/lib/types';
import {
  Calendar,
  Clock,
  Scissors,
  CreditCard,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlusCircle,
  X,
  MessageSquare,
} from "lucide-react";

export default function ClientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Review Modal State
  const [reviewApt, setReviewApt] = useState<Appointment | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Reschedule / Cancel state
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/client/appointments");
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (aptId: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      setCancelLoadingId(aptId);
      try {
        const res = await fetch(`/api/appointments/${aptId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "CANCELLED" }),
        });
        const data = await res.json();
        if (data.success) {
          fetchAppointments();
        } else {
          alert(data.error || "Failed to cancel appointment");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCancelLoadingId(null);
      }
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewApt) return;
    setReviewLoading(true);
    setReviewError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_id: reviewApt.id,
          rating,
          comment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccess(true);
        setTimeout(() => {
          setReviewApt(null);
          setReviewSuccess(false);
          setComment("");
          fetchAppointments();
        }, 1200);
      } else {
        setReviewError(data.error || "Failed to submit review");
      }
    } catch (err: any) {
      setReviewError(err.message || "Network error");
    } finally {
      setReviewLoading(false);
    }
  };

  const filteredAppointments = statusFilter
    ? appointments.filter((a) => a.status === statusFilter)
    : appointments;

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
      allowedRole="CLIENT"
      title="My Salon Bookings"
      subtitle="View your upcoming reservations, past treatments, and submit reviews."
    >
      <div className="space-y-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#021a12] border border-[#B38B4D]/30 p-4 sm:p-5 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white/70">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/40 border border-[#B38B4D]/30 text-xs text-[#F5F5F0] rounded-xl px-3 py-2 focus:outline-none focus:border-[#B38B4D]"
            >
              <option value="">All Appointments</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <Link
            href="/client/book"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold flex items-center space-x-2 shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book New Appointment</span>
          </Link>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-white/60 bg-[#021a12] rounded-2xl border border-[#B38B4D]/30 space-y-3">
            <Calendar className="w-12 h-12 mx-auto text-white/20" />
            <h4 className="text-base font-bold text-white/80">No appointments found</h4>
            <p className="text-xs">You do not have any appointments matching the selected filter.</p>
            <Link
              href="/client/book"
              className="inline-block mt-2 text-xs font-bold text-[#B38B4D] hover:underline"
            >
              Book an appointment now →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl space-y-4 hover:border-[#B38B4D]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#B38B4D]/20 text-[#B38B4D] flex items-center justify-center">
                        <Scissors className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#F5F5F0] font-serif">{apt.service?.name}</h4>
                        <span className="text-xs text-[#B38B4D] font-semibold">
                          Rs. {apt.service?.price.toLocaleString()} ({apt.service?.duration_minutes} Mins)
                        </span>
                      </div>
                    </div>

                    <div>{getStatusBadge(apt.status)}</div>
                  </div>

                  <div className="space-y-2 text-xs text-white/70 bg-black/40 p-3.5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-white/50">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#B38B4D]" /> Date & Time:
                      </span>
                      <span className="font-bold text-[#F5F5F0]">
                        {apt.appointment_date} at {apt.appointment_time}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-white/50">
                        <CreditCard className="w-3.5 h-3.5 mr-1.5 text-[#B38B4D]" /> Payment Status:
                      </span>
                      <span className="font-semibold text-white">
                        {apt.payment?.payment_status === "PAID" ? "Paid" : "Pay at Salon"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  {apt.status === "COMPLETED" && (
                    <button
                      disabled={apt.review_submitted}
                      onClick={() => setReviewApt(apt)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                        apt.review_submitted
                          ? "bg-white/5 text-white/40 cursor-default"
                          : "bg-amber-500 text-black hover:brightness-110 shadow-md"
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>{apt.review_submitted ? "Review Submitted" : "Write Review"}</span>
                    </button>
                  )}

                  {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                    <button
                      disabled={cancelLoadingId === apt.id}
                      onClick={() => handleCancel(apt.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors"
                    >
                      {cancelLoadingId === apt.id ? "Cancelling..." : "Cancel Appointment"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Review Modal */}
      {reviewApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#021a12] border border-[#B38B4D]/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">
                  Review Your Experience
                </h3>
              </div>
              <button
                onClick={() => setReviewApt(null)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-[#F5F5F0]">Review Published!</h4>
                <p className="text-xs text-white/60">Thank you for sharing your experience.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{reviewError}</span>
                  </div>
                )}

                <div className="bg-black/40 rounded-xl p-3.5 border border-white/5 text-xs">
                  <span className="text-white/50 block">Treatment:</span>
                  <span className="font-bold text-[#B38B4D] text-sm">{reviewApt.service?.name}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                    Star Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-transform hover:scale-125 ${
                          star <= rating ? "text-amber-400" : "text-white/20"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Your Thoughts
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the treatment, results, and salon atmosphere..."
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setReviewApt(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F5F5F0] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold shadow-lg"
                  >
                    {reviewLoading ? "Publishing..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
