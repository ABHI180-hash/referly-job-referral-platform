import React, { useState } from 'react';
import { X, CheckCircle2, SlidersHorizontal, AlertTriangle } from 'lucide-react';
import { ICheckItem } from '../../types/launchpilot';

interface ManualVerifyModalProps {
  check: ICheckItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (checkId: number, note: string, status: 'passed' | 'warning') => Promise<void>;
}

export const ManualVerifyModal: React.FC<ManualVerifyModalProps> = ({
  check,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'passed' | 'warning'>('passed');
  const [saving, setSaving] = useState(false);

  if (!isOpen || !check) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onConfirm(check.checkId, note, status);
    setSaving(false);
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0B0F19] border border-cyan-500/30 p-6 shadow-2xl space-y-5 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-heading">
                Manual Verification Gate
              </h3>
              <p className="text-[11px] text-slate-400">
                Check #{check.checkId}: {check.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Current Automatic Finding:</span>
            <p className="text-slate-300 text-[11px]">{check.details}</p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-300 font-semibold uppercase">
              Verification Status To Record
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('passed')}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                  status === 'passed'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark Verified (PASS)</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('warning')}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                  status === 'warning'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Conditional Pass</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-300 font-semibold uppercase">
              Audit Justification / Test Note
            </label>
            <textarea
              required
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Completed live test card transaction in Stripe test mode. Webhook confirmed."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs font-sans focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg"
            >
              {saving ? 'Recording...' : 'Record Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
