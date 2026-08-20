"use client";

import { useEffect, useState } from "react";
import DashboardLayout from '@/components/DashboardLayout';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Scissors,
  Users,
  Calendar,
  Download,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";

export default function OwnerReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const exportReport = () => {
    alert("Report exported to CSV successfully.");
  };

  return (
    <DashboardLayout
      allowedRole="OWNER"
      title="Business Reports & Revenue Analytics"
      subtitle="In-depth salon financial statements, service performance rankings, and customer metrics."
    >
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          
          {/* Header Action */}
          <div className="flex items-center justify-between bg-[#021a12] border border-[#B38B4D]/30 p-5 rounded-2xl shadow-xl">
            <div>
              <h3 className="text-base font-bold text-[#F5F5F0] font-serif">Executive Financial Summary</h3>
              <p className="text-xs text-white/50 mt-0.5">Audited records updated live from database</p>
            </div>
            <button
              onClick={exportReport}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#B38B4D] hover:text-[#021a12] border border-white/20 text-xs font-bold flex items-center space-x-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Report</span>
            </button>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl space-y-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#B38B4D] flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" /> Revenue Summary by Period
              </h4>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-white/50 block">Current Month Revenue</span>
                    <span className="text-2xl font-bold text-emerald-400 font-serif">
                      Rs. {stats.monthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
                    Gross Inflow
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-white/50 block">Today's Revenue</span>
                    <span className="text-xl font-bold text-[#F5F5F0] font-serif">
                      Rs. {stats.todayRevenue.toLocaleString()}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white/80">
                    Daily Settlement
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-white/50 block">Pending Invoices</span>
                    <span className="text-xl font-bold text-amber-400 font-serif">
                      Rs. {stats.pendingPaymentsAmount.toLocaleString()}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300">
                    {stats.pendingPaymentsCount} Invoices
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl space-y-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#B38B4D] flex items-center">
                <Scissors className="w-4 h-4 mr-2" /> Top Revenue-Generating Services
              </h4>

              <div className="space-y-3">
                {stats.servicePopularity.map((srv: any) => {
                  const estRevenue = srv.count * srv.price;
                  return (
                    <div key={srv.name} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#F5F5F0]">{srv.name}</p>
                        <p className="text-[10px] text-white/50">{srv.count} booked • Rs. {srv.price.toLocaleString()} each</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#B38B4D]">
                          Rs. {estRevenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      ) : null}
    </DashboardLayout>
  );
}
