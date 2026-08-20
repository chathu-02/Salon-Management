"use client";

import { useEffect, useState } from "react";
import DashboardLayout from '@/components/DashboardLayout';
import { Payment, PaymentStatus } from '@/lib/types';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  TrendingUp,
  Receipt,
  Download,
  Calendar,
} from "lucide-react";

export default function OwnerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [methodFilter, setMethodFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

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
      console.error("Failed to fetch payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const filteredPayments = payments.filter((p) => {
    const matchesMethod = methodFilter ? p.payment_method === methodFilter : true;
    const matchesSearch = searchTerm
      ? (p.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         p.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return matchesMethod && matchesSearch;
  });

  const totalCollected = filteredPayments
    .filter((p) => p.payment_status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = filteredPayments
    .filter((p) => p.payment_status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Paid</span>;
      case "PENDING":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Pending</span>;
      case "REFUNDED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Refunded</span>;
      case "FAILED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">Failed</span>;
    }
  };

  return (
    <DashboardLayout
      allowedRole="OWNER"
      title="Financials & Payment Ledger"
      subtitle="Track revenue collection, online transactions, salon desk cash flow, and receipts."
    >
      <div className="space-y-6">
        
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">Total Verified Collections</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1 font-serif">
              Rs. {totalCollected.toLocaleString()}
            </h3>
            <span className="text-xs text-white/40 mt-2 block">Cleared & settled transactions</span>
          </div>

          <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">Pending Receivables</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-amber-400 mt-1 font-serif">
              Rs. {totalPending.toLocaleString()}
            </h3>
            <span className="text-xs text-white/40 mt-2 block">To be collected at salon desk</span>
          </div>

          <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">Total Transactions</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] mt-1 font-serif">
              {filteredPayments.length}
            </h3>
            <span className="text-xs text-white/40 mt-2 block">Audited ledger records</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-[#021a12] border border-[#B38B4D]/30 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by client name or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] placeholder-white/30 focus:outline-none focus:border-[#B38B4D]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/40 border border-[#B38B4D]/30 text-xs text-[#F5F5F0] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#B38B4D]"
            >
              <option value="">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="REFUNDED">Refunded</option>
              <option value="FAILED">Failed</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-black/40 border border-[#B38B4D]/30 text-xs text-[#F5F5F0] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#B38B4D]"
            >
              <option value="">All Methods</option>
              <option value="ONLINE">Online Gateway</option>
              <option value="CARD">Card POS</option>
              <option value="CASH">Cash</option>
            </select>

            {(statusFilter || methodFilter || searchTerm) && (
              <button
                onClick={() => {
                  setStatusFilter("");
                  setMethodFilter("");
                  setSearchTerm("");
                }}
                className="text-xs text-white/60 hover:text-white underline px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-12 text-center text-white/60 space-y-2">
              <Receipt className="w-12 h-12 mx-auto text-white/20" />
              <h4 className="text-base font-bold text-white/80">No transactions recorded</h4>
              <p className="text-xs">Adjust filter settings to view records.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 border-b border-[#B38B4D]/20 text-[11px] font-bold uppercase tracking-wider text-white/50">
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Settlement Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-[#B38B4D]">
                          {pay.transaction_id}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-[#F5F5F0]">{pay.client_name || "Client"}</p>
                      </td>

                      <td className="p-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                          {pay.payment_method}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-[#F5F5F0] text-sm">
                          Rs. {pay.amount.toLocaleString()}
                        </span>
                      </td>

                      <td className="p-4">
                        {getStatusBadge(pay.payment_status)}
                      </td>

                      <td className="p-4 text-xs text-white/50">
                        {pay.paid_at
                          ? new Date(pay.paid_at).toLocaleString()
                          : <span className="text-amber-400">Awaiting Settlement</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
