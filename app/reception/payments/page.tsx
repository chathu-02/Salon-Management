"use client";

import { useEffect, useState } from "react";
import DashboardLayout from '@/components/DashboardLayout';
import { Payment } from '@/lib/types';
import {
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Receipt,
  X,
  AlertCircle,
  Scissors,
} from "lucide-react";

export default function ReceptionPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");

  // Collect Payment Modal
  const [selectedPay, setSelectedPay] = useState<Payment | null>(null);
  const [collectMethod, setCollectMethod] = useState<"CASH" | "CARD">("CASH");
  const [markCompleted, setMarkCompleted] = useState(true);
  const [collectLoading, setCollectLoading] = useState(false);
  const [collectError, setCollectError] = useState("");
  const [collectSuccess, setCollectSuccess] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);

      const res = await fetch(`/api/payments?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const handleCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPay) return;
    setCollectLoading(true);
    setCollectError("");
    try {
      const res = await fetch("/api/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_id: selectedPay.id,
          appointment_id: selectedPay.appointment_id,
          payment_method: collectMethod,
          mark_appointment_completed: markCompleted,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCollectSuccess(true);
        setTimeout(() => {
          setSelectedPay(null);
          setCollectSuccess(false);
          fetchPayments();
        }, 1200);
      } else {
        setCollectError(data.error || "Failed to process payment");
      }
    } catch (err: any) {
      setCollectError(err.message || "Network error");
    } finally {
      setCollectLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) =>
    searchTerm
      ? (p.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         p.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()))
      : true
  );

  return (
    <DashboardLayout
      allowedRole="RECEPTIONIST"
      title="Front Desk Payment Collection"
      subtitle="Collect cash and card payments from visiting clients and issue instant settlement confirmations."
    >
      <div className="space-y-6">
        
        {/* Filter Bar */}
        <div className="bg-[#021a12] border border-[#B38B4D]/30 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex-1 relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search customer name or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] placeholder-white/30 focus:outline-none focus:border-[#B38B4D]"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/40 border border-[#B38B4D]/30 text-xs text-[#F5F5F0] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#B38B4D]"
            >
              <option value="PENDING">Pending Collection</option>
              <option value="PAID">Settled / Paid</option>
              <option value="">All Transactions</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-12 text-center text-white/60 space-y-2">
              <Receipt className="w-12 h-12 mx-auto text-white/20" />
              <h4 className="text-base font-bold text-white/80">No payments in queue</h4>
              <p className="text-xs">All current appointments are settled.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 border-b border-[#B38B4D]/20 text-[11px] font-bold uppercase tracking-wider text-white/50">
                    <th className="p-4">Transaction Ref</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount Due</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-xs text-[#B38B4D] font-bold">{pay.transaction_id}</span>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-[#F5F5F0]">{pay.client_name || "Client"}</p>
                      </td>

                      <td className="p-4">
                        <span className="text-base font-bold text-[#F5F5F0] font-serif">
                          Rs. {pay.amount.toLocaleString()}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                          {pay.payment_method}
                        </span>
                      </td>

                      <td className="p-4">
                        {pay.payment_status === "PAID" ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Paid
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Pending Payment
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        {pay.payment_status === "PENDING" ? (
                          <button
                            onClick={() => {
                              setSelectedPay(pay);
                              setCollectMethod(pay.payment_method === "CARD" ? "CARD" : "CASH");
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold shadow-md transition-all"
                          >
                            Collect Payment
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-400 font-semibold flex items-center justify-end">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Collect Payment Modal */}
      {selectedPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#021a12] border border-[#B38B4D]/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-[#B38B4D]" />
                <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">
                  Collect Salon Payment
                </h3>
              </div>
              <button
                onClick={() => setSelectedPay(null)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {collectSuccess ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-[#F5F5F0]">Payment Cleared!</h4>
                <p className="text-xs text-white/60">Transaction recorded and appointment updated.</p>
              </div>
            ) : (
              <form onSubmit={handleCollect} className="space-y-5">
                {collectError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{collectError}</span>
                  </div>
                )}

                <div className="bg-black/40 rounded-2xl p-4 space-y-2 border border-white/5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/50">Customer:</span>
                    <span className="font-bold text-[#F5F5F0]">{selectedPay.client_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Total Bill:</span>
                    <span className="text-base font-bold text-emerald-400 font-serif">
                      Rs. {selectedPay.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Transaction ID:</span>
                    <span className="font-mono text-[#B38B4D]">{selectedPay.transaction_id}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                    Payment Method Collected
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCollectMethod("CASH")}
                      className={`p-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-bold transition-all ${
                        collectMethod === "CASH"
                          ? "bg-[#B38B4D] text-[#021a12] border-[#B38B4D]"
                          : "bg-white/5 text-white/70 border-white/10"
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>Cash Received</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCollectMethod("CARD")}
                      className={`p-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-bold transition-all ${
                        collectMethod === "CARD"
                          ? "bg-[#B38B4D] text-[#021a12] border-[#B38B4D]"
                          : "bg-white/5 text-white/70 border-white/10"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>POS Card Swiped</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="markCompleted"
                    checked={markCompleted}
                    onChange={(e) => setMarkCompleted(e.target.checked)}
                    className="rounded border-[#B38B4D]/40 bg-black/40 text-[#B38B4D] focus:ring-[#B38B4D]"
                  />
                  <label htmlFor="markCompleted" className="text-xs text-white/80 select-none">
                    Automatically mark appointment as <span className="text-emerald-400 font-bold">COMPLETED</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPay(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F5F5F0] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={collectLoading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold shadow-lg"
                  >
                    {collectLoading ? "Processing..." : "Confirm & Mark Paid"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
