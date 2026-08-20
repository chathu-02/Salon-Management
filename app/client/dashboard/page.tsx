"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from '@/components/DashboardLayout';
import { Appointment, Review } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import {
  Calendar,
  Clock,
  Scissors,
  CreditCard,
  Star,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  X,
} from "lucide-react";

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewApt, setReviewApt] = useState<Appointment | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

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

  const today = new Date().toISOString().split("T")[0];

  const upcomingApt = appointments.find(
    (a) => a.appointment_date >= today && (a.status === "CONFIRMED" || a.status === "PENDING")
  );

  const completedApts = appointments.filter((a) => a.status === "COMPLETED");
  const unreviewedCompletedApt = completedApts.find((a) => !a.review_submitted);

  return (
    <DashboardLayout
      allowedRole="CLIENT"
      title={`Welcome back, ${user?.name || "Valued Client"}`}
      subtitle="Manage your beauty reservations, view receipts, and share feedback."
    >
      <div className="space-y-8">
        
        {/* Next Upcoming Appointment Highlight Banner */}
        {upcomingApt ? (
          <div className="bg-gradient-to-r from-[#021a12] via-[#043324] to-[#021a12] border-2 border-[#B38B4D]/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-15">
              <Sparkles className="w-32 h-32 text-[#B38B4D]" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-[#B38B4D]/20 text-[#B38B4D] border border-[#B38B4D]/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next Upcoming Experience</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] font-serif">
                    {upcomingApt.service?.name || "Salon Treatment"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-white/80">
                    <span className="flex items-center text-[#B38B4D] font-semibold">
                      <Calendar className="w-4 h-4 mr-1.5" /> {upcomingApt.appointment_date}
                    </span>
                    <span className="flex items-center text-white/80 font-semibold">
                      <Clock className="w-4 h-4 mr-1.5 text-[#B38B4D]" /> {upcomingApt.appointment_time}
                    </span>
                    <span className="text-white/60">({upcomingApt.service?.duration_minutes} Mins)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                    upcomingApt.status === "CONFIRMED"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}>
                    {upcomingApt.status === "CONFIRMED" ? "Booking Confirmed" : "Pending Confirmation"}
                  </span>

                  <Link
                    href="/client/appointments"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-3xl p-8 text-center space-y-4 shadow-xl">
            <Sparkles className="w-10 h-10 text-[#B38B4D] mx-auto opacity-70" />
            <h3 className="text-xl font-bold text-[#F5F5F0] font-serif">No Upcoming Appointments</h3>
            <p className="text-xs text-white/60 max-w-md mx-auto">
              Treat yourself to luxury styling, hair care rituals, or rejuvenating skincare treatments.
            </p>
            <Link
              href="/client/book"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] text-[#021a12] font-bold text-sm shadow-lg hover:scale-105 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book an Appointment Now</span>
            </Link>
          </div>
        )}

        {/* Pending Review Prompt Banner if client has a finished appointment */}
        {unreviewedCompletedApt && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-300">How was your recent salon experience?</h4>
                <p className="text-xs text-white/70">
                  Share your review for <span className="text-white font-semibold">{unreviewedCompletedApt.service?.name}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setReviewApt(unreviewedCompletedApt)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:brightness-110 transition-all shadow-md shrink-0"
            >
              Write Review
            </button>
          </div>
        )}

        {/* Quick Action & History Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Book Now Card */}
          <Link
            href="/client/book"
            className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl hover:border-[#B38B4D] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#B38B4D]/20 text-[#B38B4D] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">Reserve New Service</h3>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Choose from signature hair styling, balayage, gold facials, and luxury spa therapies.
              </p>
            </div>
            <span className="text-xs font-bold text-[#B38B4D] flex items-center mt-4">
              Explore Menu <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </Link>

          {/* My Appointments Card */}
          <Link
            href="/client/appointments"
            className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl hover:border-[#B38B4D] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">My Appointments</h3>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                View your complete salon visit history, upcoming bookings, and reschedule reservations.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-400 flex items-center mt-4">
              View History ({appointments.length}) <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </Link>

          {/* Payment Receipts Card */}
          <Link
            href="/client/payments"
            className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl hover:border-[#B38B4D] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">Invoices & Receipts</h3>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Check payment statuses, transaction IDs, and receipts for all salon visits.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 flex items-center mt-4">
              View Invoices <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </Link>

        </div>

      </div>

      {/* Review Submission Modal */}
      {reviewApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#021a12] border border-[#B38B4D]/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">
                  Rate Your Experience
                </h3>
              </div>
              <button
                onClick={() => setReviewApt(null)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-[#F5F5F0]">Review Published!</h4>
                <p className="text-xs text-white/60">Thank you for helping us elevate our craft.</p>
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
                    Rating
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
                    Your Feedback & Review
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the stylist attention, ambiance, and result..."
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
                    {reviewLoading ? "Submitting..." : "Submit Review"}
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
