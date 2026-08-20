"use client";

import { useEffect, useState } from "react";
import DashboardLayout from '@/components/DashboardLayout';
import { Payment } from '@/lib/types';
import {
  CreditCard,
  Receipt,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
  Lock,
} from "lucide-react";

export default function ClientPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("/api/client/payments");
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
    fetchPayments();
  }, []);

  const totalSpent = payments
    .filter((p) => p.payment_status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout
      allowedRole="CLIENT"
      title="Payment History & Receipts"
      subtitle="View all transaction statements, invoice IDs, and payment verification receipts."
    >
      <div className="space-y-6">
        
        {/* Summary Card */}
        <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">Total Lifetime Spend</p>
            <h3 className="text-3xl font-bold text-emerald-400 font-serif mt-1">
              Rs. {totalSpent.toLocaleString()}
            </h3>
            <span className="text-xs text-white/40 mt-1 block">Across {payments.length} booked treatments</span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-white/60 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>All transactions encrypted and verified</span>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center text-white/60 space-y-2">
              <Receipt className="w-12 h-12 mx-auto text-white/20" />
              <h4 className="text-base font-bold text-white/80">No payment receipts found</h4>
              <p className="text-xs">Receipts will appear here once you reserve or complete appointments.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 border-b border-[#B38B4D]/20 text-[11px] font-bold uppercase tracking-wider text-white/50">
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-[#B38B4D]">{pay.transaction_id}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-[#F5F5F0]">Rs. {pay.amount.toLocaleString()}</span>
                      </td>

                      <td className="p-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                          {pay.payment_method}
                        </span>
                      </td>

                      <td className="p-4">
                        {pay.payment_status === "PAID" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3 h-3 mr-1" /> Due at Salon
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-xs text-white/50">
                        {new Date(pay.created_at).toLocaleDateString()}
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
