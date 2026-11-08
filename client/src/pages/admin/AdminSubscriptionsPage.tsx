import React from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { mockPricingPlans } from '@/data/mockData';
import { formatCurrencyINR } from '@/utils/cn';
import { CreditCard, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

export const AdminSubscriptionsPage: React.FC = () => {
  const subscribers = [
    { id: 'sub_1', user: 'Arjun Mehta', plan: 'Pro', amount: '₹799/mo', status: 'Active', renewal: 'Aug 14, 2027', method: 'Visa • 4242' },
    { id: 'sub_2', user: 'Rahul Chhabra', plan: 'Pro', amount: '₹999/mo', status: 'Active', renewal: 'Nov 28, 2026', method: 'UPI' },
    { id: 'sub_3', user: 'Aishwarya Nair', plan: 'Enterprise', amount: '₹2,999/mo', status: 'Active', renewal: 'Feb 10, 2027', method: 'Mastercard • 8831' },
    { id: 'sub_4', user: 'Neha Gupta', plan: 'Pro', amount: '₹799/mo', status: 'Past Due', renewal: 'Nov 01, 2026', method: 'Visa • 1932' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <PageMeta
        title="Admin Subscriptions"
        description="Monitor subscriber metrics, active membership tiers, and platform revenue on Referly."
      />
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Subscription & Revenue Management</h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor membership tiers, recurring subscriber volumes, and plan status.
        </p>
      </div>

      {/* Plan Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockPricingPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{plan.name} Tier</span>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrencyINR(plan.monthlyPrice)} <span className="text-xs text-slate-400 font-normal">/ mo</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{plan.tagline}</p>
            <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-indigo-600">
              {plan.id === 'pro' ? '1,840 Active Subscribers' : plan.id === 'free' ? '9,400 Free Users' : '350 Enterprise Seats'}
            </div>
          </div>
        ))}
      </div>

      {/* Active Subscribers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-x-auto">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Subscription Invoices</h2>
          <span className="text-xs text-slate-500">Live sync</span>
        </div>

        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
            <tr>
              <th className="py-3.5 px-5">Subscriber</th>
              <th className="py-3.5 px-5">Plan</th>
              <th className="py-3.5 px-5">Billing Rate</th>
              <th className="py-3.5 px-5">Payment Method</th>
              <th className="py-3.5 px-5">Next Renewal</th>
              <th className="py-3.5 px-5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-bold text-slate-900">{sub.user}</td>
                <td className="py-3.5 px-5 font-semibold text-indigo-600">{sub.plan}</td>
                <td className="py-3.5 px-5 font-medium text-slate-800">{sub.amount}</td>
                <td className="py-3.5 px-5 text-slate-500">{sub.method}</td>
                <td className="py-3.5 px-5 text-slate-500">{sub.renewal}</td>
                <td className="py-3.5 px-5 text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      sub.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
