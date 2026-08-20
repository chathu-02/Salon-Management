"use client";

import { useEffect, useState } from "react";
import DashboardLayout from '@/components/DashboardLayout';
import { Review } from '@/lib/types';
import {
  Star,
  MessageSquare,
  Scissors,
  Filter,
  User,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function OwnerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<string>("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = ratingFilter
    ? reviews.filter((r) => r.rating === Number(ratingFilter))
    : reviews;

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <DashboardLayout
      allowedRole="OWNER"
      title="Client Reviews & Feedback"
      subtitle="Monitor customer satisfaction ratings and authentic feedback submitted following completed appointments."
    >
      <div className="space-y-6">
        
        {/* Rating Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/50">Overall Score</p>
              <h3 className="text-3xl font-bold text-[#F5F5F0] font-serif mt-1">{avgRating} / 5.0</h3>
              <div className="flex text-amber-400 text-sm mt-1">
                {Array.from({ length: Math.round(Number(avgRating)) }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/50">Total Feedback</p>
              <h3 className="text-3xl font-bold text-[#F5F5F0] font-serif mt-1">{reviews.length}</h3>
              <span className="text-xs text-white/40 mt-1 block">Verified appointment reviews</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#B38B4D]/10 border border-[#B38B4D]/30 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#B38B4D]" />
            </div>
          </div>

          <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/50">5-Star Satisfaction</p>
              <h3 className="text-3xl font-bold text-emerald-400 font-serif mt-1">
                {reviews.length > 0 ? Math.round((reviews.filter((r) => r.rating === 5).length / reviews.length) * 100) : 100}%
              </h3>
              <span className="text-xs text-white/40 mt-1 block">Top tier client rating</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex justify-between items-center bg-[#021a12] border border-[#B38B4D]/30 p-4 rounded-2xl">
          <span className="text-xs font-semibold text-white/70">
            Showing {filteredReviews.length} Reviews
          </span>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#B38B4D]" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-black/40 border border-[#B38B4D]/30 text-xs text-[#F5F5F0] rounded-xl px-3 py-2 focus:outline-none focus:border-[#B38B4D]"
            >
              <option value="">All Star Ratings</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-white/60 bg-[#021a12] rounded-2xl border border-[#B38B4D]/30">
            <Star className="w-12 h-12 mx-auto text-white/20 mb-3" />
            <h4 className="text-base font-bold text-white/80">No reviews found</h4>
            <p className="text-xs">Client reviews will automatically appear after completed appointments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl space-y-4 hover:border-[#B38B4D]/60 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#B38B4D]/20 border border-[#B38B4D]/40 flex items-center justify-center font-bold text-[#B38B4D] text-sm">
                      {rev.client_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#F5F5F0] font-serif">{rev.client_name}</h4>
                      <p className="text-[11px] text-white/40 flex items-center mt-0.5">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(rev.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex text-amber-400 text-sm bg-black/40 px-2.5 py-1 rounded-full border border-amber-500/20">
                    {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>

                <p className="text-sm text-white/80 leading-relaxed italic bg-black/30 p-4 rounded-xl border border-white/5">
                  "{rev.comment}"
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <span className="text-white/40">Verified Service:</span>
                  <span className="text-[#B38B4D] font-semibold flex items-center">
                    <Scissors className="w-3 h-3 mr-1" /> {rev.service_name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
