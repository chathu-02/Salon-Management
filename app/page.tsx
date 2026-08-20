import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Scissors, ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';
import OurWorkCarousel from '@/components/OurWorkCarousel';
import ReviewsCarousel from '@/components/ReviewsCarousel';

export default function Home() {
  const services = db.getServices(true);
  const reviews = db.getReviews();

  return (
    <div className="flex flex-col min-h-screen bg-[#032B1E] text-[#F5F5F0]">
      
      {/* ===== HERO SECTION — Akari-Inspired Luxury Editorial Layout ===== */}
      <section className="relative overflow-hidden bg-[#021a12] text-[#F5F5F0] min-h-[92vh] flex items-center justify-center border-b border-[#B38B4D]/20">
        
        {/* Full-bleed Portrait Background (Positioned smoothly to the right) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[70%] md:w-[60%] lg:w-[52%] h-full">
            <img
              src="/images/logo/hero-model.jpg"
              alt="The Crown Aesthetics Luxury Beauty"
              className="w-full h-full object-cover object-[center_15%] opacity-95"
            />
            {/* Gradient blending the portrait seamlessly into the dark background on the left */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#021a12] via-[#021a12]/40 to-transparent"></div>
          </div>

          {/* Overall atmospheric gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#021a12] via-transparent to-[#021a12]/80 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#021a12] via-[#021a12]/90 via-35% to-transparent pointer-events-none"></div>
        </div>

        {/* Ambient Warm Golden Glow */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#B38B4D]/10 rounded-full blur-[140px] pointer-events-none z-10 animate-orb-drift"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-20">
          <div className="max-w-2xl space-y-8 animate-slide-up-3d">
            
            {/* Bold Headline (Elevate Your Elegance) */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#F5F5F0] font-serif leading-[1.05]">
                Elevate Your <br />
                <span className="text-[#B38B4D] italic animate-gold-glow-text font-serif">Elegance</span>
              </h1>
            </div>

            {/* Description Subtitle */}
            <p className="text-base sm:text-xl text-gray-300 font-light leading-relaxed max-w-lg">
              Discover a sanctuary of beauty and relaxation. Our expert stylists deliver personalized experiences tailored just for you.
            </p>

            {/* CTA Pill Buttons & Hotline */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Link 
                href="/book"
                className="btn-3d uppercase tracking-wider text-xs font-bold px-9 py-4 rounded-full bg-gradient-to-r from-[#032B1E] via-[#044430] to-[#032B1E] text-[#F5F5F0] border border-[#B38B4D]/60 hover:border-[#B38B4D] shadow-[0_0_25px_rgba(179,139,77,0.3)] hover:shadow-[0_0_35px_rgba(179,139,77,0.5)] flex items-center space-x-3 group"
              >
                <span>Book Your Appointment</span>
                <ArrowRight className="w-4 h-4 text-[#B38B4D] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link 
                href="/about"
                className="text-xs tracking-wider uppercase font-semibold text-white/70 hover:text-[#B38B4D] transition-colors py-2 flex items-center space-x-2"
              >
                <span>Explore Salon</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#B38B4D]" />
              </Link>
            </div>

            {/* Bottom Quick Info */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-white/50">
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-[#B38B4D]" />
                <span>Open Daily: 9:00 AM &ndash; 8:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#B38B4D]" />
                <span>123 Premium Avenue, Colombo</span>
              </div>
              <div className="text-[#B38B4D] font-mono font-semibold">
                Hotline: +94 11 234 5678
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ===== OVERVIEW / ABOUT SECTION ===== */}
      <section className="py-28 bg-[#021a12] relative overflow-hidden border-t border-[#B38B4D]/15">
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B38B4D]/5 rounded-full blur-[120px] animate-float-slow pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-20 items-center">
            
            {/* Left: 3D Image */}
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-br from-[#B38B4D]/20 to-transparent rounded-3xl blur-2xl animate-float-slow"></div>
              <img 
                src="/images/logo/salon-interior.jpg" 
                alt="Salon Experience" 
                className="img-3d relative rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] object-cover h-[520px] w-full border border-[#B38B4D]/30 animate-border-shimmer"
              />
              
              <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-[#B38B4D]/40 rounded-tl-3xl animate-float-reverse pointer-events-none"></div>
            </div>
            
            {/* Right: Text Content */}
            <div className="space-y-7">
              <div className="inline-flex items-center space-x-2.5 bg-white/5 border border-[#B38B4D]/30 rounded-full px-4 py-1.5 backdrop-blur-md shadow-lg animate-scale-bounce">
                <Scissors className="w-4 h-4 text-[#B38B4D]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B38B4D]">
                  Welcome to The Crown Aesthetics
                </span>
              </div>
              
              <h3 className="text-3xl md:text-5xl font-bold text-[#F5F5F0] font-serif leading-tight">
                Where Beauty Meets{' '}
                <span className="text-[#B38B4D]">Master Precision</span>
              </h3>
              
              <p className="text-white/70 text-base leading-relaxed">
                Step into a world of pure indulgence and allow our award-winning stylists to transform your vision into reality. We combine timeless techniques with the finest European formulas to ensure you leave looking and feeling your absolute best.
              </p>
              
              <ul className="space-y-3 pt-2">
                {[
                  'Master Colorists & Precision Stylists',
                  '24K Gold Cellular Renewal Spa Treatments',
                  'Organic Hair & Scalp Aromatherapy Rituals',
                  'Personalized VIP Consultations & Care'
                ].map((feature, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-center text-sm font-medium text-white/90 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#B38B4D]/30 hover:bg-[#B38B4D]/5 transition-all duration-300 hover:translate-x-2 hover:shadow-[0_4px_20px_rgba(179,139,77,0.1)] cursor-default group"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#B38B4D] mr-3.5 group-hover:shadow-[0_0_10px_rgba(179,139,77,0.6)] transition-shadow shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link 
                  href="/about"
                  className="btn-3d inline-flex items-center space-x-2.5 bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] text-[#021a12] font-bold text-sm px-7 py-3.5 rounded-full"
                >
                  <span>Learn more about our salon</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUR WORK CAROUSEL ===== */}
      <OurWorkCarousel />

      {/* ===== REVIEWS MARQUEE ===== */}
      <ReviewsCarousel initialReviews={reviews} />
    </div>
  );
}