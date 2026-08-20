"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import {
  Scissors,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    const res = await register({ name, email, password, phone });
    setLoading(false);

    if (res.success && res.user) {
      router.push("/client/dashboard");
      router.refresh();
    } else {
      setError(res.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#032B1E] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#B38B4D]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-black/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Header Badge & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-[#021a12] border border-[#B38B4D]/40 rounded-full px-4 py-1.5 mb-4 shadow-lg">
            <Sparkles className="w-4 h-4 text-[#B38B4D]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B38B4D]">
              VIP Client Membership
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F5F0] font-serif">
            Create Your <span className="text-[#B38B4D] italic">Account</span>
          </h1>
          <p className="text-sm text-white/60 mt-2">
            Join The Crown Aesthetics for exclusive salon experiences
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-[#021a12]/90 backdrop-blur-xl border border-[#B38B4D]/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start space-x-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sophia Vance"
                  className="block w-full pl-10 pr-4 py-3 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] placeholder-white/30 focus:outline-none focus:border-[#B38B4D] focus:ring-1 focus:ring-[#B38B4D] transition-colors"
                />
              </div>
            </div>

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
                  placeholder="sophia@example.com"
                  className="block w-full pl-10 pr-4 py-3 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] placeholder-white/30 focus:outline-none focus:border-[#B38B4D] focus:ring-1 focus:ring-[#B38B4D] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>Creating your account...</span>
              ) : (
                <>
                  <span>Create Client Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-white/60">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#B38B4D] font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
