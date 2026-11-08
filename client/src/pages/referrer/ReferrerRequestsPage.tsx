import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import { ReferralRequest } from '@/types';
import { Inbox, CheckCircle2, XCircle, FileText, ExternalLink, User } from 'lucide-react';

export const ReferrerRequestsPage: React.FC = () => {
  const { referralRequests, updateReferralStatus } = useApp();
  const [selectedReq, setSelectedReq] = useState<ReferralRequest | null>(null);

  const handleAccept = (id: string) => {
    updateReferralStatus(id, 'Accepted');
  };

  const handleReject = (id: string) => {
    updateReferralStatus(id, 'Rejected');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageMeta
        title="Candidate Requests"
        description="Review candidate applications and referral requests for roles at your company on Referly."
      />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Incoming Candidate Referral Requests</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review candidates seeking an employee referral for open roles at your organization.
        </p>
      </div>

      {referralRequests.length > 0 ? (
        <div className="space-y-4">
          {referralRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-card hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4 min-w-0">
                <img
                  src={req.candidateAvatar}
                  alt={req.candidateName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {req.candidateName}
                    </h3>
                    <StatusBadge status={req.status} />
                  </div>

                  <p className="text-xs font-semibold text-indigo-600 truncate">{req.jobTitle}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{req.candidateHeadline}</p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <span>Requested: {req.requestDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      {req.candidateResume || 'Resume.pdf'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-shrink-0 self-end md:self-center">
                <button
                  onClick={() => setSelectedReq(req)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  View Note & Resume
                </button>

                {req.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>

                    <button
                      onClick={() => handleAccept(req.id)}
                      className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept & Refer</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title="No incoming referral requests"
          description="Candidates will appear here as soon as they request referrals for your company."
        />
      )}

      {/* Review Modal */}
      {selectedReq && (
        <Modal
          isOpen={Boolean(selectedReq)}
          onClose={() => setSelectedReq(null)}
          title={`Referral Request from ${selectedReq.candidateName}`}
          description={`Target Role: ${selectedReq.jobTitle}`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-900 block">Candidate Introduction</span>
              <p className="text-slate-600 leading-relaxed italic">
                "{selectedReq.note || 'Hello, I would appreciate a referral for this role.'}"
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                  <span className="font-semibold text-slate-900 block">
                    {selectedReq.candidateResume || 'Candidate_Resume.pdf'}
                  </span>
                  <span className="text-[10px] text-slate-400">PDF Document • 420 KB</span>
                </div>
              </div>

              <span className="text-xs font-semibold text-indigo-600">Verified</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              {selectedReq.status === 'Pending' && (
                <>
                  <button
                    onClick={() => {
                      handleReject(selectedReq.id);
                      setSelectedReq(null);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    Decline Request
                  </button>
                  <button
                    onClick={() => {
                      handleAccept(selectedReq.id);
                      setSelectedReq(null);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                  >
                    Accept & Endorse Candidate
                  </button>
                </>
              )}
              {selectedReq.status !== 'Pending' && (
                <button
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
