"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Users,
  Scissors,
  Star,
  BarChart3,
  LogOut,
  Sparkles,
  ShieldCheck,
  UserCheck,
  User,
  PlusCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  Home,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRole?: UserRole | UserRole[];
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({
  children,
  allowedRole,
  title,
  subtitle,
}: DashboardLayoutProps) {
  const { user, role, loading, logout, switchDemoAccount } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Role check & redirection
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (allowedRole) {
        const allowed = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
        if (!allowed.includes(user.role)) {
          // Redirect to authorized role dashboard
          if (user.role === 'OWNER') router.push('/owner/dashboard');
          else if (user.role === 'RECEPTIONIST') router.push('/reception/dashboard');
          else router.push('/client/dashboard');
        }
      }
    }
  }, [user, role, loading, allowedRole, pathname, router]);

  if (loading) {
    return (
      <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center bg-[#032B1E] text-[#F5F5F0]">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[#B38B4D]/30 border-t-[#B38B4D] animate-spin"></div>
          <Scissors className="w-6 h-6 text-[#B38B4D] absolute inset-0 m-auto" />
        </div>
        <p className="mt-4 text-sm font-medium text-[#B38B4D] animate-pulse font-mono tracking-wider">
          AUTHENTICATING ACCESS...
        </p>
      </div>
    );
  }

  if (!user) return null;

  // Sidebar links configuration based on current user role
  let navItems: NavItem[] = [];

  if (user.role === 'OWNER') {
    navItems = [
      { name: 'Executive Overview', href: '/owner/dashboard', icon: LayoutDashboard },
      { name: 'Appointments', href: '/owner/appointments', icon: Calendar },
      { name: 'Financials & Payments', href: '/owner/payments', icon: CreditCard },
      { name: 'Staff & Clients', href: '/owner/users', icon: Users },
      { name: 'Salon Services', href: '/owner/services', icon: Scissors },
      { name: 'Client Reviews', href: '/owner/reviews', icon: Star },
      { name: 'Revenue Reports', href: '/owner/reports', icon: BarChart3 },
    ];
  } else if (user.role === 'RECEPTIONIST') {
    navItems = [
      { name: 'Reception Desk', href: '/reception/dashboard', icon: LayoutDashboard },
      { name: 'Appointments Agenda', href: '/reception/appointments', icon: Calendar },
      { name: 'Client Directory', href: '/reception/clients', icon: Users },
      { name: 'Collect Payments', href: '/reception/payments', icon: CreditCard },
    ];
  } else {
    // CLIENT
    navItems = [
      { name: 'Client Portal', href: '/client/dashboard', icon: LayoutDashboard },
      { name: 'Book Appointment', href: '/client/book', icon: PlusCircle },
      { name: 'My Appointments', href: '/client/appointments', icon: Calendar },
      { name: 'Payment Receipts', href: '/client/payments', icon: CreditCard },
      { name: 'My Reviews', href: '/client/reviews', icon: Star },
      { name: 'Account Profile', href: '/client/profile', icon: User },
    ];
  }

  const getRoleTheme = () => {
    if (user.role === 'OWNER') {
      return {
        label: 'Owner / Admin',
        color: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
        badge: 'Full Executive Access',
      };
    }
    if (user.role === 'RECEPTIONIST') {
      return {
        label: 'Reception Staff',
        color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
        badge: 'Desk Operations Access',
      };
    }
    return {
      label: 'VIP Client',
      color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
      badge: 'Client Portal Access',
    };
  };

  const theme = getRoleTheme();

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-5rem)] bg-[#032B1E]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-[#021a12] border-r border-[#B38B4D]/20 flex flex-col shrink-0">
        
        {/* User Card */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B38B4D] to-[#8c672e] flex items-center justify-center text-lg font-bold text-[#021a12] shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#F5F5F0] truncate font-serif">{user.name}</h3>
              <p className="text-xs text-white/50 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${theme.color}`}>
              {theme.label}
            </span>
            <span className="text-[10px] text-white/40 font-mono">{theme.badge}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B38B4D] to-[#9b753a] text-[#021a12] font-bold shadow-[0_0_15px_rgba(179,139,77,0.3)]'
                    : 'text-[#F5F5F0]/80 hover:text-[#F5F5F0] hover:bg-white/5 hover:border-[#B38B4D]/30 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#021a12]' : 'text-[#B38B4D]'}`} />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 opacity-50 ${isActive ? 'text-[#021a12]' : 'text-white/30'}`} />
              </Link>
            );
          })}
        </nav>

        {/* Quick Role Switcher Demo Bar (For rapid evaluation of RBAC) */}
        <div className="p-4 bg-black/40 border-t border-white/10 m-3 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B38B4D]">
              Demo Role Switcher
            </span>
            <Sparkles className="w-3 h-3 text-[#B38B4D]" />
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-semibold">
            <button
              onClick={() => switchDemoAccount('OWNER')}
              className={`py-1.5 px-2 rounded-lg border transition-all ${
                user.role === 'OWNER'
                  ? 'bg-amber-500 text-black border-amber-400 font-bold'
                  : 'bg-white/5 text-white/70 border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10'
              }`}
            >
              Owner
            </button>
            <button
              onClick={() => switchDemoAccount('RECEPTIONIST')}
              className={`py-1.5 px-2 rounded-lg border transition-all ${
                user.role === 'RECEPTIONIST'
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                  : 'bg-white/5 text-white/70 border-white/10 hover:border-emerald-400/50 hover:bg-emerald-400/10'
              }`}
            >
              Reception
            </button>
            <button
              onClick={() => switchDemoAccount('CLIENT')}
              className={`py-1.5 px-2 rounded-lg border transition-all ${
                user.role === 'CLIENT'
                  ? 'bg-blue-500 text-black border-blue-400 font-bold'
                  : 'bg-white/5 text-white/70 border-white/10 hover:border-blue-400/50 hover:bg-blue-400/10'
              }`}
            >
              Client
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => logout()}
            className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#032B1E]">
        <div className="max-w-7xl mx-auto space-y-6">
          {(title || subtitle) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#B38B4D]/20 gap-4">
              <div>
                {title && <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] font-serif tracking-tight">{title}</h1>}
                {subtitle && <p className="text-sm text-white/60 mt-1">{subtitle}</p>}
              </div>

              {/* Breadcrumb / Status pill */}
              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <span className="text-xs bg-[#021a12] border border-[#B38B4D]/30 px-3 py-1.5 rounded-full text-[#B38B4D] font-mono">
                  {user.role} PORTAL
                </span>
              </div>
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}
