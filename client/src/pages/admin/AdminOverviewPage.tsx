import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/common/StatCard';
import { mockAdminStats, mockAdminUsers } from '@/data/mockData';
import { formatCurrencyINR } from '@/utils/cn';
import { PageMeta } from '@/components/common/PageMeta';
import {
  Users,
  BriefcaseBusiness,
  Send,
  CreditCard,
  Building2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const { jobs, referralRequests } = useApp();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageMeta
        title="Platform Operations Overview"
        description="Monitor system-wide telemetry, user registrations, and referral requests."
      />
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Referly Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#090A0F] tracking-tight">Platform Operations Overview</h1>
          <p className="text-sm font-sans text-slate-600 mt-1 max-w-xl leading-relaxed">
            Live telemetry of active candidate pipelines, corporate referrers, and recurring subscription revenue.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start">
          <Link
            to="/admin/analytics"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Open Full Analytics
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Registered Users"
          value={mockAdminStats.totalUsers.toLocaleString()}
          change="+18% MoM"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Active Referrers"
          value={mockAdminStats.totalReferrers.toLocaleString()}
          change="Across 180+ companies"
          icon={BriefcaseBusiness}
        />
        <StatCard
          title="Live Referral Openings"
          value={jobs.length}
          subtitle="Actively accepting requests"
          icon={Building2}
        />
        <StatCard
          title="Monthly Recurring Revenue"
          value={formatCurrencyINR(mockAdminStats.monthlyRevenueINR)}
          change="+24% vs last month"
          changeType="positive"
          icon={CreditCard}
        />
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent User Registrations */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Recent User Registrations</h2>
            <Link
              to="/admin/users"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>Manage users</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {mockAdminUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">{user.name}</span>
                  <span className="text-[11px] text-slate-400">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 capitalize">
                    {user.role}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      user.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Operational Health */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-slate-900">Platform Health & SLA</h2>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Referrer Response Rate</span>
                <span className="text-emerald-600">89.4%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[89%]" />
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Candidate Interview Conversion</span>
                <span className="text-indigo-600">82.1%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-[82%]" />
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Corporate Domain Verification</span>
                <span className="text-emerald-600">100%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
