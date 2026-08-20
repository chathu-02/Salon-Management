"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from '@/components/DashboardLayout';
import { Review, Appointment } from '@/lib/types';
import {
  Star,
  MessageSquare,
  Scissors,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function ClientReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revRes, aptRes] = await Promise.all([
          fetch("/api/reviews"),
          fetch("/api/client/appointments"),
        ]);
        const [revData, aptData] = await Promise.all([
          revRes.json(),
          aptRes.json(),
        ]);

        if (revData.success) setReviews(revData.data);
        if (aptData.success) setAppointments(aptData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedApts = appointments.filter((a) => a.status === "COMPLETED");

  return (
    <DashboardLayout
      allowedRole="CLIENT"
      title="My Reviews & Experience Feedback"
      subtitle="View your submitted ratings and share feedback for recent completed salon sessions."
    >
      <div className="space-y-6">
        
        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-white/60 bg-[#021a12] rounded-2xl border border-[#B38B4D]/30 space-y-3">
            <Star className="w-12 h-12 mx-auto text-white/20" />
            <h4 className="text-base font-bold text-white/80">No reviews submitted yet</h4>
            <p className="text-xs">Once you complete a salon appointment, you can write reviews directly here or from your dashboard.</p>
            <Link
              href="/client/appointments"
              className="inline-block mt-2 text-xs font-bold text-[#B38B4D] hover:underline"
            >
              View My Appointments →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Scissors className="w-4 h-4 text-[#B38B4D]" />
                    <h4 className="font-bold text-[#F5F5F0] font-serif">{rev.service_name}</h4>
                  </div>
                  <div className="flex text-amber-400 text-sm">
                    {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>

                <p className="text-xs text-white/80 leading-relaxed italic bg-black/40 p-4 rounded-xl border border-white/5">
                  "{rev.comment}"
                </p>

                <div className="flex justify-between items-center text-[11px] text-white/40 pt-2 border-t border-white/5">
                  <span>Reviewed by {rev.client_name}</span>
                  <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
