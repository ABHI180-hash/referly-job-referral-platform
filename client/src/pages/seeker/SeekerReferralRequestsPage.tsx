import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { Modal } from '@/components/common/Modal';
import { ReferralRequest } from '@/types';
import { Send, Building2, User, X, MessageSquare, CheckCircle2 } from 'lucide-react';

export const SeekerReferralRequestsPage: React.FC = () => {
  const { referralRequests, cancelReferralRequest } = useApp();
  const [selectedReq, setSelectedReq] = useState<ReferralRequest | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageMeta
        title="Referral Requests"
        description="Track employee endorsements and status progression for your referral requests."
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Referral Requests</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track employee responses and endorsements for your open requests.
          </p>
        </div>

        <Link
          to="/referrals"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors self-start"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Request New Referral</span>
        </Link>
      </div>

      {referralRequests.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
              <tr>
                <th className="py-3.5 px-5">Target Opening</th>
                <th className="py-3.5 px-5">Referrer</th>
                <th className="py-3.5 px-5">Requested Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {referralRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div>
                      <span className="font-bold text-slate-900 block">{req.jobTitle}</span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {req.company}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                        {req.referrerName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          {req.referrerName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {req.referrerPosition || req.referrerCompany}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-500">{req.requestDate}</td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedReq(req)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-semibold transition-colors"
                      >
                        Details
                      </button>

                      {req.status === 'Pending' && (
                        <button
                          onClick={() => cancelReferralRequest(req.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition-colors"
                          title="Cancel request"
                        >
                          Cancel
                        </button>
                      )}

                      <Link
                        to="/dashboard/messages"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Open message"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={Send}
          title="No referral requests sent yet"
          description="Find verified company employees in the Referrals directory and request endorsements."
          actionText="Browse Referrers"
          onAction={() => {
            window.location.href = '/referrals';
          }}
        />
      )}

      {/* Details Modal */}
      {selectedReq && (
        <Modal
          isOpen={Boolean(selectedReq)}
          onClose={() => setSelectedReq(null)}
          title="Referral Request Details"
          description={`${selectedReq.jobTitle} • ${selectedReq.company}`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Current Status:</span>
              <StatusBadge status={selectedReq.status} />
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-slate-900 block">Personal Note Included</span>
              <p className="p-3 rounded-lg border border-slate-200 bg-white text-slate-600 leading-relaxed italic">
                "{selectedReq.note}"
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">Resume Attached</span>
                <span className="text-[11px] text-slate-500">
                  {selectedReq.candidateResume || 'Candidate_Resume.pdf'}
                </span>
              </div>
              <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Link
                to="/dashboard/messages"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              >
                Chat with Referrer
              </Link>
              <button
                onClick={() => setSelectedReq(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
