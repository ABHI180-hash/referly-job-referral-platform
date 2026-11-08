import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { FileCheck2, Search, Award } from 'lucide-react';

export const ReferrerReferralsPage: React.FC = () => {
  const { referralRequests } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Accepted & Completed referrals
  const activeReferrals = referralRequests.filter(
    (r) => r.status === 'Accepted' || r.status === 'Completed'
  );

  const filtered = activeReferrals.filter(
    (r) =>
      r.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageMeta
        title="Endorsed Referrals"
        description="Historical log of candidates you have endorsed and referred at your employer."
      />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">My Endorsed Referrals</h1>
        <p className="text-xs text-slate-500 mt-1">
          Historical record of candidates you have referred into corporate hiring pipelines.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-card flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate or job role..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Total Endorsed: <strong className="text-slate-900">{activeReferrals.length}</strong>
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
              <tr>
                <th className="py-3.5 px-5">Candidate</th>
                <th className="py-3.5 px-5">Referred Job Position</th>
                <th className="py-3.5 px-5">Company</th>
                <th className="py-3.5 px-5">Submission Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Bonus Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={ref.candidateAvatar}
                        alt={ref.candidateName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{ref.candidateName}</span>
                        <span className="text-[10px] text-slate-400">{ref.candidateEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">{ref.jobTitle}</td>
                  <td className="py-3.5 px-5 font-medium text-slate-600">{ref.company}</td>
                  <td className="py-3.5 px-5 text-slate-500">{ref.requestDate}</td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={ref.status} />
                  </td>
                  <td className="py-3.5 px-5 text-right font-semibold text-emerald-600">
                    ₹1,50,000 INR
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={FileCheck2}
          title="No referrals found"
          description="Accepted referrals from incoming requests will be tracked here."
        />
      )}
    </div>
  );
};
