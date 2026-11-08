import React from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { mockMonthlyGrowthData, mockApplicationFunnelData } from '@/data/mockData';
import { StatCard } from '@/components/common/StatCard';
import { TrendingUp, Users, Send, CreditCard } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <PageMeta
        title="Admin Analytics"
        description="Deep platform analytics covering referral velocity, candidate growth, and employer engagement."
      />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Platform Analytics & Metrics</h1>
        <p className="text-xs text-slate-500 mt-1">
          Deep telemetry across user acquisition, referral volumes, and application conversion rates.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Monthly User Velocity"
          value="+1,420"
          change="+18.4% MoM"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Monthly Referral Volume"
          value="3,410"
          change="+16.2% MoM"
          changeType="positive"
          icon={Send}
        />
        <StatCard
          title="Avg. Offer Conversion"
          value="12.4%"
          change="+2.1% from Q3"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Customer LTV"
          value="₹8,900 INR"
          change="Pro & Enterprise"
          changeType="positive"
          icon={CreditCard}
        />
      </div>

      {/* Chart 1: User & Referral Growth (AreaChart) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Platform Growth Trends</h3>
            <p className="text-xs text-slate-500">
              Registered users vs. successful referral requests over the past 6 months
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-indigo-600">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Users
            </span>
            <span className="flex items-center gap-1.5 text-violet-500">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Referrals
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockMonthlyGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="refGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#4F46E5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#userGrad)"
                name="Users"
              />
              <Area
                type="monotone"
                dataKey="referrals"
                stroke="#8B5CF6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#refGrad)"
                name="Referrals"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Application Pipeline Funnel (BarChart) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Application Pipeline Funnel</h3>
          <p className="text-xs text-slate-500">
            Conversion metrics from initial application to final offer issuance
          </p>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockApplicationFunnelData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Candidates" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
