"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import {
  Scissors,
  User as UserIcon,
  LogOut,
  Sparkles,
  LayoutDashboard,
  Calendar,
  CreditCard,
  Users,
  ShieldCheck,
  Menu,
  X
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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <ShieldCheck className="w-3 h-3 mr-1" /> Owner
        </span>
      );
    }
    if (role === 'RECEPTIONIST') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Receptionist
        </span>
      );
    }
    if (role === 'CLIENT') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
          Client
        </span>
      );
    }
    return null;
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#021a12]/95 backdrop-blur-md border-b border-[#B38B4D]/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B38B4D] to-[#8c672e] flex items-center justify-center shadow-[0_0_15px_rgba(179,139,77,0.3)] transition-transform group-hover:scale-105">
              <Scissors className="w-5 h-5 text-[#021a12]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#F5F5F0] font-serif group-hover:text-[#B38B4D] transition-colors">
                The Crown Aesthetics
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#B38B4D] font-mono">
                Haute Coiffure & Spa
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-[#B38B4D] ${
                pathname === '/' ? 'text-[#B38B4D] font-semibold' : 'text-[#F5F5F0]/80'
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium transition-colors hover:text-[#B38B4D] ${
                pathname === '/services' ? 'text-[#B38B4D] font-semibold' : 'text-[#F5F5F0]/80'
              }`}
            >
              Services
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-[#B38B4D] ${
                pathname === '/about' ? 'text-[#B38B4D] font-semibold' : 'text-[#F5F5F0]/80'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-[#B38B4D] ${
                pathname === '/contact' ? 'text-[#B38B4D] font-semibold' : 'text-[#F5F5F0]/80'
              }`}
            >
              Contact
            </Link>

            {/* If logged in, show dedicated role dashboard button */}
            {user && (
              <Link
                href={getRoleDashboardLink()}
                className={`inline-flex items-center space-x-1.5 text-sm font-medium px-3.5 py-1.5 rounded-lg border transition-all ${
                  pathname.startsWith('/owner') || pathname.startsWith('/reception') || pathname.startsWith('/client')
                    ? 'bg-[#B38B4D]/20 text-[#B38B4D] border-[#B38B4D]'
                    : 'bg-white/5 text-[#F5F5F0] border-white/10 hover:border-[#B38B4D]/50 hover:bg-[#B38B4D]/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#B38B4D]" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-black/40 border border-[#B38B4D]/30 py-1.5 px-3 rounded-full">
                  <div className="w-7 h-7 rounded-full bg-[#B38B4D]/20 border border-[#B38B4D]/40 flex items-center justify-center text-xs font-bold text-[#B38B4D]">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-[#F5F5F0] leading-none">{user.name}</span>
                    <div className="mt-1">{getRoleBadge()}</div>
                  </div>
                </div>

                <button
                  onClick={() => logout()}
                  title="Log out"
                  className="p-2 rounded-full text-[#F5F5F0]/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#F5F5F0] hover:text-[#B38B4D] px-4 py-2 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-[#B38B4D] border border-[#B38B4D]/50 hover:bg-[#B38B4D]/10 px-4 py-2 rounded-full transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            <Link
              href="/book"
              className="bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] text-[#021a12] hover:brightness-110 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_20px_rgba(179,139,77,0.25)] hover:shadow-[0_0_25px_rgba(179,139,77,0.4)] hover:scale-105 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <Link
              href="/book"
              className="bg-[#B38B4D] text-[#021a12] px-3.5 py-1.5 rounded-full text-xs font-bold"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#F5F5F0] hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#021a12] border-b border-[#B38B4D]/30 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#F5F5F0]"
          >
            Home
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-sm font-medium ${
              pathname === '/services' ? 'text-[#B38B4D] font-bold' : 'text-[#F5F5F0]'
            }`}
          >
            Services
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#F5F5F0]"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#F5F5F0]"
          >
            Contact
          </Link>

          {user ? (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#F5F5F0]">{user.name}</span>
                {getRoleBadge()}
              </div>
              <Link
                href={getRoleDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-xl bg-[#B38B4D]/20 text-[#B38B4D] border border-[#B38B4D] text-sm font-bold"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-sm text-red-400 font-medium"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-white/10 flex gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl bg-white/10 text-[#F5F5F0] text-sm font-semibold"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl bg-[#B38B4D] text-[#021a12] text-sm font-bold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
