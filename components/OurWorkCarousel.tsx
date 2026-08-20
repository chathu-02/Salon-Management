"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WorkItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

const WORK_ITEMS: WorkItem[] = [
  {
    id: 1,
    title: "Master Color & French Balayage",
    category: "Hair Artistry",
    image: "/images/logo/salon/20250630_DCC+Makeovers_HK_209.webp",
    description: "Seamless dimensional blonde highlighting and high-gloss toner finish.",
  },
  {
    id: 2,
    title: "Haute Coiffure Precision Cut & Styling",
    category: "Styling & Finish",
    image: "/images/logo/salon/image-asset.webp",
    description: "Layered luxury blowout and customized signature structure.",
  },
  {
    id: 3,
    title: "Cellular Renewal & Radiance Facial",
    category: "Skin Aesthetics",
    image: "/images/logo/salon/images.webp",
    description: "Deep collagen infusion and revitalizing crystal lymphatic drainage.",
  },
  {
    id: 4,
    title: "Luxury Spa & Restorative Care",
    category: "Spa Rituals",
    image: "/images/logo/salon/istockphoto-2172888289-612x612.jpg",
    description: "Holistic scalp therapy, hot towel acupressure, and deep relaxation.",
  },
  {
    id: 5,
    title: "Artisan Velvet Manicure & Hand Spa",
    category: "Nail Lounge",
    image: "/images/logo/salon/rs=w_1280.webp",
    description: "Long-lasting designer gel artistry with nourishing botanical oils.",
  },
  {
    id: 6,
    title: "VIP Salon Architecture & Private Suites",
    category: "Salon Experience",
    image: "/images/logo/salon/salon-neutrals.webp",
    description: "Private aesthetic suites designed for ultimate comfort and tranquility.",
  },
];

export default function OurWorkCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto swap every 4.5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % WORK_ITEMS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? WORK_ITEMS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % WORK_ITEMS.length);
  };

  const currentWork = WORK_ITEMS[currentIndex];

  return (
    <section className="py-24 bg-[#021a12] border-t border-[#B38B4D]/30 relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#B38B4D]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-bold text-[#F5F5F0] font-serif tracking-tight">
            Our Work
          </h2>
          
          <div className="w-24 h-1 bg-[#B38B4D] mx-auto rounded-full mt-4"></div>
          
          <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto font-light leading-relaxed pt-2">
            Explore transformations crafted by our master stylists and therapists.
          </p>
        </div>

        {/* Central Display Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Main Large Visual Card with circular styling & glow */}
          <div className="lg:col-span-7 relative group">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border-2 border-[#B38B4D]/50 shadow-[0_0_40px_rgba(179,139,77,0.25)] bg-black/60">
              <img
                key={currentWork.id}
                src={currentWork.image}
                alt={currentWork.title}
                className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-105 animate-fadeIn"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

              {/* Badges on image */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[#B38B4D] border border-[#B38B4D]/40 shadow-lg">
                  {currentWork.category}
                </span>
              </div>

              {/* Bottom Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 space-y-1">
                <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">
                  {currentWork.title}
                </h3>
                <p className="text-xs text-white/70 line-clamp-1">
                  {currentWork.description}
                </p>
              </div>
            </div>

            {/* Prev / Next Floating Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 border border-[#B38B4D]/50 text-white flex items-center justify-center hover:bg-[#B38B4D] hover:text-[#021a12] transition-all shadow-xl backdrop-blur-md z-20"
              aria-label="Previous work"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 border border-[#B38B4D]/50 text-white flex items-center justify-center hover:bg-[#B38B4D] hover:text-[#021a12] transition-all shadow-xl backdrop-blur-md z-20"
              aria-label="Next work"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Side: Details & Circular Thumbnail Swapper */}
          <div className="lg:col-span-5 space-y-6 lg:pl-4 text-center lg:text-left">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B38B4D]">
                Transformation #{currentIndex + 1} of {WORK_ITEMS.length}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] font-serif leading-tight">
                {currentWork.title}
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                {currentWork.description}
              </p>
            </div>

            {/* Circular Thumbnails List that highlights the active one */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-white/50 block uppercase tracking-wider">
                Click to view transformations:
              </span>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {WORK_ITEMS.map((item, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setCurrentIndex(idx);
                      }}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden transition-all duration-300 transform ${
                        isActive
                          ? "ring-4 ring-[#B38B4D] ring-offset-2 ring-offset-[#021a12] scale-110 shadow-[0_0_20px_rgba(179,139,77,0.5)]"
                          : "opacity-60 hover:opacity-100 hover:scale-105 border border-white/20"
                      }`}
                      aria-label={`View ${item.title}`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
