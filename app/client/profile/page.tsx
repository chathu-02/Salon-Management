"use client";

import { useState } from "react";
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Save,
  AlertCircle,
} from "lucide-react";

export default function ClientProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: string; message: string }>({ type: "", message: "" });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const payload: any = { name, phone };
      if (password) {
        if (password.length < 6) {
          setStatus({ type: "error", message: "Password must be at least 6 characters" });
          setLoading(false);
          return;
        }
        payload.password = password;
      }

      // Note: we can use user self update or admin API
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ type: "success", message: "Profile updated successfully!" });
        setPassword("");
        refreshUser();
      } else {
        setStatus({ type: "error", message: data.error || "Update failed" });
      }
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      allowedRole="CLIENT"
      title="Client Profile & Preferences"
      subtitle="Update your personal contact details, mobile phone, and account security."
    >
      <div className="max-w-2xl bg-[#021a12] border border-[#B38B4D]/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {status.message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center space-x-2 border ${
              status.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{status.message}</span>
          </div>
        )}

        <div className="flex items-center space-x-4 pb-6 border-b border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-[#B38B4D]/20 border border-[#B38B4D]/40 flex items-center justify-center text-2xl font-bold text-[#B38B4D] font-serif">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#F5F5F0] font-serif">{user?.name}</h3>
            <p className="text-xs text-white/50">{user?.email}</p>
            <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              VIP Client
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
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
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
              Email Address (Fixed)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-sm text-white/50 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
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
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
              Change Password (Leave blank to keep current)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (min 6 characters)"
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold flex items-center space-x-2 shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Saving..." : "Save Preferences"}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
