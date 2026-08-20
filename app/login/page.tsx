"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import {
  Scissors,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserCheck,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { login, switchDemoAccount } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await login(email, password);
    setLoading(false);

    if (res.success && res.user) {
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        if (res.user.role === "OWNER") router.push("/owner/dashboard");
        else if (res.user.role === "RECEPTIONIST") router.push("/reception/dashboard");
        else router.push("/client/dashboard");
      }
      router.refresh();
    } else {
      setError(res.error || "Invalid email or password");
    }
  };

  const fillCredentials = (role: 'OWNER' | 'RECEPTIONIST' | 'CLIENT') => {
    if (role === 'OWNER') {
      setEmail('owner@thecrown.com');
      setPassword('Owner@123');
    } else if (role === 'RECEPTIONIST') {
      setEmail('receptionist@thecrown.com');
      setPassword('Reception@123');
    } else {
      setEmail('client@thecrown.com');
      setPassword('Client@123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#032B1E] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#B38B4D]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Header Badge & Title */}
        <div className="text-center mb-8">
          
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F5F0] font-serif">
            Welcome to <span className="text-[#B38B4D] italic">The Crown</span>
          </h1>
          <p className="text-sm text-white/60 mt-2">
            Sign in to access your role dashboard and features
          </p>
        </div>

        {/* 1-Click Fast Demo Role Login Buttons */}
        <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-4 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B38B4D] flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#B38B4D]" /> Quick Demo Accounts
            </span>
            <span className="text-[11px] text-white/50">Click to fill</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('OWNER')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/20 text-amber-300 transition-all text-xs font-medium group"
            >
              <ShieldCheck className="w-4 h-4 mb-1 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold">Owner</span>
              <span className="text-[9px] text-white/50">Full Admin</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('RECEPTIONIST')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/20 text-emerald-300 transition-all text-xs font-medium group"
            >
              <UserCheck className="w-4 h-4 mb-1 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold">Reception</span>
              <span className="text-[9px] text-white/50">Desk Ops</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('CLIENT')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/20 text-blue-300 transition-all text-xs font-medium group"
            >
              <User className="w-4 h-4 mb-1 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold">Client</span>
              <span className="text-[9px] text-white/50">Customer</span>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#021a12]/90 backdrop-blur-xl border border-[#B38B4D]/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start space-x-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@thecrown.com"
                  className="block w-full pl-10 pr-4 py-3 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] placeholder-white/30 focus:outline-none focus:border-[#B38B4D] focus:ring-1 focus:ring-[#B38B4D] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] placeholder-white/30 focus:outline-none focus:border-[#B38B4D] focus:ring-1 focus:ring-[#B38B4D] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] font-bold text-sm shadow-[0_0_20px_rgba(179,139,77,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-white/60">
              New customer?{" "}
              <Link
                href="/register"
                className="text-[#B38B4D] font-semibold hover:underline"
              >
                Create a Client Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center bg-[#032B1E]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
