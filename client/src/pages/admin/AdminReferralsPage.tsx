import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import { ReferralRequest } from '@/types';
import { Send, Search, CheckCircle2, XCircle } from 'lucide-react';

export const AdminReferralsPage: React.FC = () => {
  const { referralRequests, updateReferralStatus, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReq, setSelectedReq] = useState<ReferralRequest | null>(null);

  const filtered = referralRequests.filter((r) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      !term ||
      r.candidateName.toLowerCase().includes(term) ||
      r.referrerName.toLowerCase().includes(term) ||
      r.company.toLowerCase().includes(term) ||
      r.jobTitle.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageMeta
        title="Admin Referrals"
        description="Monitor candidate referral exchanges and maintain verification standards on Referly."
      />
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Platform Referral Requests</h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor candidate referral exchanges and enforce anti-spam platform rules.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-card flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate, referrer, or company..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
          />
        </div>
        <span className="text-xs text-slate-500">
          Total requests: <strong className="text-slate-900">{referralRequests.length}</strong>
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
              <tr>
                <th className="py-3.5 px-5">Candidate</th>
                <th className="py-3.5 px-5">Target Opening</th>
                <th className="py-3.5 px-5">Referrer</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900">{req.candidateName}</td>
                  <td className="py-3.5 px-5">
                    <span className="font-semibold text-slate-900 block">{req.jobTitle}</span>
                    <span className="text-[10px] text-slate-500">{req.company}</span>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-700">{req.referrerName}</td>
                  <td className="py-3.5 px-5 text-slate-500">{req.requestDate}</td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => setSelectedReq(req)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-semibold transition-colors"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={Send}
          title="No referrals found"
          description="Try broadening your search term."
        />
      )}

      {selectedReq && (
        <Modal
          isOpen={Boolean(selectedReq)}
          onClose={() => setSelectedReq(null)}
          title="Referral Request Audit"
          description={`ID: ${selectedReq.id}`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg space-y-1">
              <span className="font-bold text-slate-900 block">Candidate Note:</span>
              <p className="text-slate-600 italic">"{selectedReq.note}"</p>
            </div>
            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => {
                  updateReferralStatus(selectedReq.id, 'Accepted');
                  setSelectedReq(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
              >
                Approve Referral
              </button>
              <button
                onClick={() => setSelectedReq(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Dismiss
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
