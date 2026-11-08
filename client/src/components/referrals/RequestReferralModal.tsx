import React, { useState } from 'react';
import { ReferrerProfile, Job } from '@/types';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/common/Modal';
import { FileText, Send, Building2, CheckCircle2 } from 'lucide-react';

interface RequestReferralModalProps {
  referrer?: ReferrerProfile | null;
  job?: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RequestReferralModal: React.FC<RequestReferralModalProps> = ({
  referrer: initialReferrer,
  job: initialJob,
  isOpen,
  onClose,
}) => {
  const { jobs, referrers, currentUser, createReferralRequest } = useApp();
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJob?.id || '');
  const [selectedReferrerId, setSelectedReferrerId] = useState<string>(initialReferrer?.id || '');
  const [note, setNote] = useState(
    'Hi! I would appreciate an employee referral for this role. I have reviewed the job requirements and believe my background aligns well with the team.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill or adjust candidates when modal opens with props
  React.useEffect(() => {
    if (initialJob) {
      setSelectedJobId(initialJob.id);
      // Find matching referrer for this company if not set
      if (!initialReferrer) {
        const matchingRef = referrers.find((r) => r.company.toLowerCase() === initialJob.company.toLowerCase());
        if (matchingRef) setSelectedReferrerId(matchingRef.id);
      }
    }
    if (initialReferrer) {
      setSelectedReferrerId(initialReferrer.id);
      if (!initialJob) {
        const matchingJob = jobs.find((j) => j.company.toLowerCase() === initialReferrer.company.toLowerCase());
        if (matchingJob) setSelectedJobId(matchingJob.id);
      }
    }
  }, [initialJob, initialReferrer, jobs, referrers, isOpen]);

  const activeReferrer = referrers.find((r) => r.id === selectedReferrerId) || referrers[0];
  const activeJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJob || !activeReferrer) return;

    setIsSubmitting(true);
    const ok = await createReferralRequest(activeJob.id, activeReferrer.id, note);
    setIsSubmitting(false);
    if (ok) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request an Employee Referral"
      description="Connect directly with an employee to sponsor your candidacy."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Referrer & Job summary */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={activeReferrer?.avatar}
              alt={activeReferrer?.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900">
                  {activeReferrer?.name}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <p className="text-[11px] text-slate-500">
                {activeReferrer?.position} at <span className="font-semibold text-slate-700">{activeReferrer?.company}</span>
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {activeReferrer?.availability}
          </span>
        </div>

        {/* Target Job Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Target Job Opening
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} — {job.company} ({job.location})
              </option>
            ))}
          </select>
        </div>

        {/* Personalized Message */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Personal Note to Referrer
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Introduce yourself and explain why you're a great fit for this team..."
            className="w-full text-xs rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-slate-800 placeholder:text-slate-400"
            required
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Referrers prioritize polite, specific requests highlighting relevant skills.
          </p>
        </div>

        {/* Attached Candidate Resume */}
        <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span className="text-xs text-slate-700 font-medium">
              {currentUser?.resumeName || 'Arjun_Mehta_Senior_Frontend_2026.pdf'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Attached from Profile</span>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-60 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Sending Request...' : 'Send Referral Request'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
