import React, { useState } from 'react';
import { X, Globe, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { useLaunchPilot } from '../../context/LaunchPilotContext';

interface AddWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddWebsiteModal: React.FC<AddWebsiteModalProps> = ({ isOpen, onClose }) => {
  const { addWebsite } = useLaunchPilot();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('SaaS Platform');
  const [environment, setEnvironment] = useState('production');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setErrorMsg('Name and Website URL are required.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      await addWebsite({
        name: name.trim(),
        url: url.trim(),
        category,
        environment,
      });
      setLoading(false);
      setName('');
      setUrl('');
      onClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Failed to register website.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0B0F19] border border-cyan-500/30 p-6 shadow-2xl space-y-5 font-mono text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading tracking-tight">
                Register Target Website
              </h3>
              <p className="text-[11px] text-slate-400">
                Configure domain for 15-point launch readiness inspection.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-300 font-semibold uppercase">
              Target Website Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Cloud Platform"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-300 font-semibold uppercase">
              Website URL / Domain
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-sans"
            />
            <span className="text-[10px] text-slate-500">
              Target will undergo live DNS, SSL, and full DOM inspection.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 font-semibold uppercase">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="SaaS Platform">SaaS Platform</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Developer Tools">Developer Tools</option>
                <option value="Corporate / Agency">Corporate / Agency</option>
                <option value="Web3 / FinTech">Web3 / FinTech</option>
                <option value="Blog & Media">Blog & Media</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 font-semibold uppercase">
                Environment
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="preview">Preview / Canary</option>
              </select>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 text-xs font-mono flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Registering...' : 'Register & Scan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
