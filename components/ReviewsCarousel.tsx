"use client";

import { Star, CheckCircle2, Quote, Sparkles } from "lucide-react";
import { Review } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee-01-utils/marquee";

interface ReviewsCarouselProps {
  initialReviews: Review[];
}

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <Card className="relative h-full w-80 sm:w-96 cursor-pointer overflow-hidden border border-[#B38B4D]/30 bg-[#021a12] shadow-xl p-5 hover:border-[#B38B4D] transition-all hover:scale-[1.02] duration-300">
      <CardContent className="p-0 flex flex-col gap-3">
        
        {/* Top: Client Info & Stars */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-[#B38B4D] bg-black/50 shrink-0">
              {review.client_avatar ? (
                <img
                  className="w-full h-full object-cover"
                  alt={review.client_name}
                  src={review.client_avatar}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[#B38B4D] bg-[#B38B4D]/10">
                  {review.client_name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <p className="text-sm font-bold text-[#F5F5F0] font-serif flex items-center gap-1.5">
                <span>{review.client_name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
              </p>
              <p className="text-xs text-[#B38B4D] font-mono">
                {review.service_name}
              </p>
            </div>
          </div>

          <div className="flex space-x-0.5 text-amber-400">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>

        {/* Middle: Feedback Quote */}
        <p className="text-xs sm:text-sm italic text-white/80 line-clamp-3 leading-relaxed">
          "{review.comment}"
        </p>

        {/* Bottom Tag */}
        <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40">
          <span>Verified Patron</span>
          <span>5.0 Star Experience</span>
        </div>

      </CardContent>
    </Card>
  );
};

export default function ReviewsCarousel({ initialReviews }: ReviewsCarouselProps) {
  const reviews = initialReviews && initialReviews.length > 0 ? initialReviews : [];

  if (reviews.length === 0) return null;

  const half = Math.ceil(reviews.length / 2);
  const firstRow = reviews.slice(0, half);
  const secondRow = reviews.slice(half).length > 0 ? reviews.slice(half) : reviews;

  return (
    <section className="py-24 bg-[#021a12] border-t border-[#B38B4D]/20 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#B38B4D]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          
          <h3 className="text-3xl sm:text-5xl font-bold text-[#F5F5F0] font-serif tracking-tight">
            What Our Patrons Say
          </h3>
          <div className="w-24 h-1 bg-[#B38B4D] mx-auto rounded-full mt-4"></div>
          <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto font-light leading-relaxed pt-2">
            Real feedback and ratings from our valued patrons across salon treatments.
          </p>
        </div>

        {/* Dual-Row Smooth Scrolling Marquee Container */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4 gap-4">
          
          {/* Row 1 (Left to Right) */}
          <Marquee pauseOnHover className="[--duration:28s]">
            {firstRow.map((review, idx) => (
              <ReviewCard key={`row1-${review.id}-${idx}`} review={review} />
            ))}
          </Marquee>

          {/* Row 2 (Right to Left) */}
          <Marquee reverse pauseOnHover className="[--duration:32s]">
            {secondRow.map((review, idx) => (
              <ReviewCard key={`row2-${review.id}-${idx}`} review={review} />
            ))}
          </Marquee>

          {/* Left & Right Soft Fade Gradients */}
          <div className="from-[#021a12] pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r z-20"></div>
          <div className="from-[#021a12] pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l z-20"></div>

        </div>

      </div>
    </section>
  );
}
