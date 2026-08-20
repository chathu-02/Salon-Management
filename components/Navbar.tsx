"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import {
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Calendar,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleDashboardLink = () => {
    if (role === 'OWNER') return '/owner/dashboard';
    if (role === 'RECEPTIONIST') return '/reception/dashboard';
    return '/client/dashboard';
  };

  const getRoleBadge = () => {
    if (role === 'OWNER') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
          <ShieldCheck className="w-3 h-3 mr-1 text-amber-400" /> Owner
        </span>
      );
    }
    if (role === 'RECEPTIONIST') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          Reception
        </span>
      );
    }
    if (role === 'CLIENT') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
          VIP Client
        </span>
      );
    }
    return null;
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#021a12]/90 backdrop-blur-xl border-b border-[#B38B4D]/30 shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* 1. Left Brand Branding */}
          <Link href="/" className="flex items-center space-x-3.5 group">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-[#B38B4D]/60 shadow-[0_0_20px_rgba(179,139,77,0.35)] bg-black/50 p-1 transition-all duration-300 group-hover:scale-105 group-hover:border-[#B38B4D] group-hover:shadow-[0_0_25px_rgba(179,139,77,0.5)]">
              <img
                src="/images/logo/salonlogo.webp"
                alt="The Crown Aesthetics Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#F5F5F0] font-serif group-hover:text-[#B38B4D] transition-colors leading-tight">
                The Crown Aesthetics
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#B38B4D] font-mono">
                Haute Coiffure & Spa
              </span>
            </div>
          </Link>

          {/* 2. Center Floating Navigation Menu */}
          <div className="hidden lg:flex items-center bg-black/40 border border-white/10 backdrop-blur-md rounded-full px-3 py-1.5 shadow-inner space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "bg-[#B38B4D] text-[#021a12] font-bold shadow-[0_0_15px_rgba(179,139,77,0.5)]"
                      : "text-white/75 hover:text-[#F5F5F0] hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* If logged in, show direct Role Dashboard link inside menu bar */}
            {user && (
              <Link
                href={getRoleDashboardLink()}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  pathname.startsWith('/owner') || pathname.startsWith('/reception') || pathname.startsWith('/client')
                    ? "bg-[#B38B4D]/30 text-[#B38B4D] border border-[#B38B4D]"
                    : "text-white/80 hover:text-[#B38B4D] hover:bg-white/5"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#B38B4D]" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* 3. Right Action Controls (Cleanly aligned to the right) */}
          <div className="hidden md:flex items-center space-x-3.5 ml-auto lg:ml-0">
            {user ? (
              <div className="flex items-center space-x-3 bg-black/40 border border-[#B38B4D]/30 py-1.5 pl-3 pr-2 rounded-full backdrop-blur-md shadow-lg">
                <div className="w-7 h-7 rounded-full bg-[#B38B4D]/20 border border-[#B38B4D]/50 flex items-center justify-center text-xs font-bold text-[#B38B4D]">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col pr-1">
                  <span className="text-xs font-bold text-[#F5F5F0] leading-none truncate max-w-[110px]">
                    {user.name}
                  </span>
                  <div className="mt-0.5">{getRoleBadge()}</div>
                </div>

                <button
                  onClick={() => logout()}
                  title="Log out"
                  className="p-1.5 rounded-full text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-xs uppercase tracking-wider font-semibold text-white/80 hover:text-[#B38B4D] px-4 py-2 rounded-full hover:bg-white/5 transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-xs uppercase tracking-wider font-semibold text-[#B38B4D] border border-[#B38B4D]/50 hover:border-[#B38B4D] hover:bg-[#B38B4D]/10 px-4 py-2 rounded-full transition-all shadow-[0_0_10px_rgba(179,139,77,0.15)]"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Inquire CTA Button (Redirects to Contact Us) */}
            <Link
              href="/contact"
              className="btn-3d uppercase tracking-wider text-xs font-bold px-7 py-2.5 rounded-full bg-gradient-to-r from-[#B38B4D] via-[#c59e5f] to-[#B38B4D] bg-[length:200%_auto] animate-shimmer-btn text-[#021a12] flex items-center space-x-2 shadow-[0_0_20px_rgba(179,139,77,0.35)] hover:shadow-[0_0_30px_rgba(179,139,77,0.5)] transition-all"
            >
              <span>Inquire</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#021a12]" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center space-x-2.5">
            <Link
              href="/contact"
              className="bg-[#B38B4D] text-[#021a12] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Inquire
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#F5F5F0] bg-white/5 border border-white/10 hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#B38B4D]" /> : <Menu className="w-5 h-5 text-[#B38B4D]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#021a12]/98 backdrop-blur-2xl border-b border-[#B38B4D]/40 px-6 pt-4 pb-8 space-y-4 shadow-2xl animate-slide-up-3d">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 text-sm font-semibold uppercase tracking-wider rounded-xl px-3 transition-colors ${
                  pathname === link.href ? "bg-[#B38B4D]/20 text-[#B38B4D] font-bold" : "text-white/80 hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {user ? (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-[#B38B4D]/30">
                <span className="text-sm font-bold text-[#F5F5F0]">{user.name}</span>
                {getRoleBadge()}
              </div>
              <Link
                href={getRoleDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-[#B38B4D]/20 text-[#B38B4D] border border-[#B38B4D] text-xs uppercase tracking-wider font-bold shadow-lg"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-xs uppercase tracking-wider text-red-400 font-bold hover:bg-red-500/10 rounded-xl transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-3 rounded-xl bg-white/5 border border-white/10 text-[#F5F5F0] text-xs uppercase tracking-wider font-semibold"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-3 rounded-xl bg-[#B38B4D]/20 border border-[#B38B4D] text-[#B38B4D] text-xs uppercase tracking-wider font-bold"
                >
                  Register
                </Link>
              </div>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] text-[#021a12] text-xs uppercase tracking-wider font-bold shadow-xl"
              >
                Inquire Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
