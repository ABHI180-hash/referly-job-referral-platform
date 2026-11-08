import React, { useState } from 'react';
import { Job } from '@/types';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/common/Modal';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, isOpen, onClose }) => {
  const { currentUser, applyToJob } = useApp();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await applyToJob(job.id, notes);
    setIsSubmitting(false);
    if (success) {
      onClose();
      setNotes('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply to ${job.company}`}
      description={`${job.title} • ${job.location}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Candidate Summary */}
        <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt="Applicant"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-900 block">
                {currentUser?.name || 'Candidate'}
              </span>
              <span className="text-slate-500">{currentUser?.email}</span>
            </div>
          </div>
        </div>

        {/* Resume Preview */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Attached Resume
          </label>
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-indigo-600" />
              <div>
                <span className="text-xs font-medium text-slate-900 block">
                  {currentUser?.resumeName || 'Arjun_Mehta_Senior_Frontend_2026.pdf'}
                </span>
                <span className="text-[10px] text-slate-400">PDF Document • 420 KB</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
        </div>

        {/* Pitch / Cover Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Brief Pitch / Note to Hiring Team <span className="font-normal text-slate-400">(Optional)</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Highlight 2-3 key accomplishments relevant to this position..."
            className="w-full text-xs rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-slate-800 placeholder:text-slate-400"
          />
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
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? 'Submitting Application...' : 'Submit Direct Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
