"use client";

import { useState, useEffect } from "react";

export default function OnboardingScreen() {
  const [phase, setPhase] = useState<"visible" | "fadeOut" | "hidden">("visible");

  useEffect(() => {
    // Check if user has already seen the onboarding in this session
    const seen = sessionStorage.getItem("crown_onboarding_seen");
    if (seen) {
      setPhase("hidden");
      return;
    }

    // Show splash for 15s, then fade out over 1s
    const timer = setTimeout(() => {
      setPhase("fadeOut");
    }, 15000);

    const hideTimer = setTimeout(() => {
      setPhase("hidden");
      sessionStorage.setItem("crown_onboarding_seen", "true");
    }, 16000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-1000 ${
        phase === "fadeOut" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ willChange: "opacity" }}
    >
      {/* Full-Screen Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/logo/salon-interior.jpg"
          alt="The Crown Aesthetics Interior"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay Gradient for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85"></div>
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 space-y-8">

        {/* Animated Logo */}
        <div
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-2 border-[#B38B4D]/70 shadow-[0_0_60px_rgba(179,139,77,0.45)] bg-black/30 p-2 animate-[scaleIn_0.8s_ease-out_forwards]"
        >
          <img
            src="/images/logo/salonlogo.webp"
            alt="The Crown Aesthetics Logo"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>

        {/* Decorative Gold Divider */}
        <div className="flex items-center gap-4">
          <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-[#B38B4D]"></div>
          <div className="w-2 h-2 rounded-full bg-[#B38B4D] shadow-[0_0_10px_rgba(179,139,77,0.7)]"></div>
          <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-[#B38B4D]"></div>
        </div>

        {/* Salon Name with Staggered Reveal */}
        <div className="space-y-3 animate-[fadeSlideUp_1s_0.4s_ease-out_both]">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#F5F5F0] font-serif tracking-tight">
            The Crown
          </h1>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#B38B4D] font-serif italic tracking-tight">
            Aesthetics
          </h2>
        </div>

        {/* Tagline */}
        <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-white/60 font-light animate-[fadeSlideUp_1s_0.8s_ease-out_both]">
          Haute Coiffure &middot; Skincare &middot; Spa
        </p>

        {/* Loading Bar */}
        <div className="w-40 h-0.5 bg-white/10 rounded-full overflow-hidden mt-6 animate-[fadeSlideUp_0.6s_1s_ease-out_both]">
          <div className="h-full bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] rounded-full animate-[loadBar_2.5s_1s_ease-in-out_forwards]"></div>
        </div>

      </div>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          0% { transform: translateY(25px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes loadBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
