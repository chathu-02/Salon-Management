"use client";

import { useState, useEffect, useRef } from "react";

export default function HeroBackground() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate opacity & parallax based on scroll
  // Image starts fully visible and fades to 0 by 600px scroll
  const opacity = Math.max(0, 1 - scrollY / 600);
  // Parallax: image moves slower than scroll (creates depth)
  const translateY = scrollY * 0.4;
  // Slight scale increase as you scroll for 3D depth feel
  const scale = 1 + scrollY * 0.0003;

  return (
    <div
      ref={heroRef}
      className="absolute inset-0 overflow-hidden"
      style={{ opacity }}
    >
      {/* Actual Salon Image with Parallax */}
      <img
        src="/images/logo/salon-interior.jpg"
        alt="The Crown Aesthetics Salon Interior"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          willChange: "transform",
        }}
      />

      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#021a12]/60 via-[#021a12]/50 to-[#021a12]/90"></div>
      
      {/* Side vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#021a12_100%)]"></div>
    </div>
  );
}
