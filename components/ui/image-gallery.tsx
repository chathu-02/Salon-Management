"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface ImageGalleryProps {
  images?: string[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=800&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=800&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=800&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=800&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=800&w=800&auto=format&fit=crop",
];

export default function ImageGallery({
  images = DEFAULT_IMAGES,
  title = "Our Latest Creations",
  subtitle = "A visual collection of our most recent works – each piece crafted with intention, emotion, and style.",
  className,
}: ImageGalleryProps) {
  return (
    <section className={cn("w-full flex flex-col items-center justify-start py-12", className)}>
      <div className="max-w-3xl text-center px-4">
        <h1 className="text-3xl font-semibold text-[#F5F5F0] font-serif">{title}</h1>
        <p className="text-sm text-white/60 mt-2 font-light">
          {subtitle}
        </p>
      </div>

      {/* Expanding Interactive Gallery */}
      <div className="flex items-center gap-2 h-[400px] w-full max-w-5xl mt-10 px-4">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="relative group flex-grow transition-all w-24 sm:w-56 rounded-2xl overflow-hidden h-[400px] duration-500 hover:w-full border border-[#B38B4D]/30 shadow-xl cursor-pointer"
          >
            <img
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              src={src}
              alt={`gallery-${idx}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-xs font-bold text-[#F5F5F0]">Master Creation #{idx + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
