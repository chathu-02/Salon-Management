"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Star, Scissors, Award, Sparkles, CheckCircle2, ArrowRight, Calendar, Heart } from "lucide-react";

export default function AboutPage() {
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});

  const team = [
    {
      id: "isabella",
      name: "Isabella Martinez",
      role: "Creative Director & Master Stylist",
      experience: "15+ Years International Experience (Paris & Milan)",
      image: "/images/logo/salon/1.webp",
      bio: "Trained at the prestigious L'Académie de Coiffure in Paris, Isabella combines classical French precision with contemporary runway styling. Her bespoke consultations and master dry-cutting techniques sculpt hair to enhance every client's natural bone structure.",
      specialties: ["French Precision Cut", "Haute Bridal Styling", "Organic Hair Restoration", "Runway Volume"],
      rating: "5.0 (280+ Reviews)",
    },
    {
      id: "james",
      name: "James Alexander",
      role: "Senior Color Specialist & Master Colorist",
      experience: "12+ Years Experience (London Academy Trained)",
      image: "/images/logo/salon/2.webp",
      bio: "A pioneer in dimensional balayage and ammonia-free gloss formulation, James transforms hair into a living canvas. His custom color-melting and tone-correcting protocols deliver radiant, healthy shine that lasts for months.",
      specialties: [ "Platinum Blonde Mastery", "Gloss & Tone Infusion", "Color Correction"],
      rating: "5.0 (210+ Reviews)",
    },
    {
      id: "sophia",
      name: "Sophia Rossi",
      role: "Lead Clinical Esthetician & Spa Director",
      experience: "10+ Years Advanced Skincare & Holistic Therapy",
      image: "/images/logo/salon/3.webp",
      bio: "Sophia specializes in cellular rejuvenation, combining Swiss peptide serums, 24K Gold luxury facials, and vortex hydra-infusions. Her holistic rituals leave skin radiant, sculpted, and deeply nourished from within.",
      specialties: ["24K Pure Gold Facial", "Hydra-Dermabrasion", "Swedish Aromatherapy", "Lifting Facial Sculpting"],
      rating: "5.0 (340+ Reviews)",
    },
  ];

  useEffect(() => {
    // Intersection Observer to trigger splash animation on scroll into viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-card-id");
            if (id) {
              setVisibleCards((prev) => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll(".splash-card");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#032B1E] text-[#F5F5F0] pb-24">
      
      {/* 1. Hero Banner */}
      <div className="relative py-28 overflow-hidden bg-[#021a12] border-b border-[#B38B4D]/20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/logo/salon-interior.jpg" 
            alt="Salon Interior" 
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#021a12] via-[#021a12]/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl md:text-7xl font-bold text-[#F5F5F0] font-serif tracking-tight">
            The Crown <span className="text-[#B38B4D] italic">Atelier</span>
          </h1>

          <p className="text-base md:text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
            Founded on the philosophy that true luxury is personal, 
            The Crown Aesthetics combines European haute coiffure with clinical skincare rituals.
          </p>
        </div>
      </div>

      {/* 2. Values & Philosophy Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#B38B4D] font-bold block">
              Our Craft Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#F5F5F0] font-serif leading-tight">
              More Than Just a Salon &ndash; An Sanctuary of Elegance
            </h2>
            <p className="text-white/70 leading-relaxed text-sm sm:text-base">
              We believe that true beauty comes from confidence and self-care. Our mission is to create a welcoming, luxurious environment where you can relax, be yourself, and let our master artists enhance your natural features.
            </p>
            <p className="text-white/70 leading-relaxed text-sm sm:text-base">
              Every formula and product we use is ethically sourced, 100% cruelty-free, and tested by Europe's premier cosmetic laboratories to ensure pure, restorative results for your hair and skin.
            </p>
            
            <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#F5F5F0]">Rated 4.9/5 by 1,000+ VIP Patrons</span>
            </div>
          </div>
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#B38B4D]/30 img-3d">
            <img 
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop" 
              alt="Salon Process" 
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#021a12]/80 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>

      {/* 3. Team Section — Spotlight & Zig-Zag Layout with Splash Reveal */}
      <div className="bg-[#021a12] py-28 border-y border-[#B38B4D]/25 relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#B38B4D]/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          
          {/* Section Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#F5F5F0] font-serif tracking-tight">
              Master Artisans &amp; Stylists
            </h2>
            <div className="w-24 h-1 bg-[#B38B4D] mx-auto rounded-full"></div>
            
            <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed pt-2">
              The visionary hands and creative specialists shaping the highest standards of luxury salon and spa rituals.
            </p>
          </div>

          {/* Atmosphere Spotlight Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-[#B38B4D]/40 shadow-2xl bg-[#032B1E] p-6 sm:p-10 max-w-4xl mx-auto animate-scale-bounce">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 relative rounded-2xl overflow-hidden h-64 sm:h-72 border border-[#B38B4D]/30 shadow-xl">
                <img
                  src="/images/logo/salon/istockphoto-2172888289-612x612.jpg"
                  alt="The Crown Atelier Atmosphere"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="md:col-span-6 space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#B38B4D] font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#B38B4D]" /> VIP Private Suites &amp; Master Care
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] font-serif">
                  Excellence in Every Ritual
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                  Our team members undergo continuous masterclass training in London, Paris, and Milan to bring international luxury standards to every salon appointment.
                </p>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                    <p className="text-lg font-bold text-[#B38B4D] font-serif">15+</p>
                    <p className="text-[9px] text-white/50 uppercase">Years Combined</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                    <p className="text-lg font-bold text-[#B38B4D] font-serif">100%</p>
                    <p className="text-[9px] text-white/50 uppercase">European Care</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                    <p className="text-lg font-bold text-[#B38B4D] font-serif">5.0</p>
                    <p className="text-[9px] text-white/50 uppercase">Patron Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Zig-Zag Team Profiles with Splash Reveal Animation */}
          <div className="space-y-8 max-w-4xl mx-auto pt-4">
            {team.map((member, idx) => {
              const isEven = idx % 2 === 1;
              const isVisible = visibleCards[member.id];

              return (
                <div
                  key={member.id}
                  data-card-id={member.id}
                  className={`splash-card grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center bg-[#032B1E] border border-[#B38B4D]/30 rounded-2xl p-5 sm:p-6 shadow-xl hover:border-[#B38B4D] transition-all duration-700 transform ${
                    isVisible
                      ? "opacity-100 scale-100 translate-y-0 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
                      : "opacity-0 scale-90 translate-y-12 shadow-none"
                  }`}
                  style={{
                    transitionDelay: `${idx * 150}ms`,
                    willChange: "transform, opacity",
                  }}
                >
                  {/* Photo Column */}
                  <div className={`md:col-span-4 ${isEven ? "md:order-2" : "md:order-1"}`}>
                    <div className="relative rounded-xl overflow-hidden h-56 sm:h-64 border border-[#B38B4D]/40 shadow-lg group">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#021a12]/70 via-transparent to-transparent"></div>
                      
                      {/* Rating badge on photo */}
                      <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-sm border border-[#B38B4D]/40 px-2.5 py-1 rounded-full flex items-center space-x-1 text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-white/90">{member.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className={`md:col-span-8 space-y-3 ${isEven ? "md:order-1" : "md:order-2"}`}>
                    
                    {/* Experience Badge */}
                    <div className="inline-flex items-center space-x-1.5 bg-black/40 border border-[#B38B4D]/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#B38B4D] font-mono">
                      <Award className="w-3 h-3 text-[#B38B4D]" />
                      <span>{member.experience}</span>
                    </div>

                    {/* Name & Role */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F0] font-serif">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#B38B4D]">
                        {member.role}
                      </p>
                    </div>

                    {/* Bio */}
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light line-clamp-3">
                      {member.bio}
                    </p>

                    {/* Specialty Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {member.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium hover:border-[#B38B4D]/40 transition-colors"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Link
                        href="/book"
                        className="btn-3d inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] text-[#021a12] font-bold text-[11px] uppercase tracking-wider shadow-md"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Book With {member.name.split(" ")[0]}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
