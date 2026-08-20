"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { login } = useAuth();

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
        // Automatic Role-Based Redirection
        if (res.user.role === "OWNER") {
          router.push("/owner/dashboard");
        } else if (res.user.role === "RECEPTIONIST") {
          router.push("/reception/dashboard");
        } else {
          router.push("/client/dashboard");
        }
      }
      router.refresh();
    } else {
      setError(res.error || "Invalid email or password. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#032B1E] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#B38B4D]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        
        {/* Header Branding & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#021a12] border border-[#B38B4D]/40 rounded-full px-4 py-1.5 shadow-lg">
            <ShieldCheck className="w-4 h-4 text-[#B38B4D]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B38B4D]">
              Secure Role-Based Portal
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F5F0] font-serif">
            Welcome to <span className="text-[#B38B4D] italic">The Crown</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            Sign in to access your designated role portal
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#021a12]/95 backdrop-blur-xl border border-[#B38B4D]/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start space-x-3 text-red-400 text-xs sm:text-sm animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
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
                  placeholder="name@example.com"
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
              className="btn-3d w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#B38B4D] via-[#c59e5f] to-[#B38B4D] bg-[length:200%_auto] animate-shimmer-btn text-[#021a12] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(179,139,77,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-white/60">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#B38B4D] font-bold hover:underline"
              >
                Create a VIP Client Account
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
        <div className="w-10 h-10 rounded-full border-2 border-[#B38B4D] border-t-transparent animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
