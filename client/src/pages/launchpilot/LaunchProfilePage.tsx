import React, { useState } from 'react';
import { User, Key, Shield, Check, Copy, CheckCircle2 } from 'lucide-react';
import { PageMeta } from '../../components/common/PageMeta';

export const LaunchProfilePage: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [apiKey] = useState('lp_live_948f20b3c829e1104a7e937d21b44');

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageMeta
        title="Mission Profile & Developer Access | LaunchPilot"
        description="Manage your LaunchPilot operator profile, developer API access credentials, and security settings."
      />

      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-xl">
        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-widest block">
          OPERATOR DOSSIER
        </span>
        <h1 className="text-2xl font-black text-white font-heading tracking-tight mt-1">
          Launch Commander Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Account credentials, authenticated workspace environments, and programmatic API tokens.
        </p>
      </div>

      <div className="space-y-6 font-mono text-xs">
        {/* User Capsule */}
        <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold font-mono shadow-xl shadow-cyan-500/20">
              LC
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-heading">
                  Launch Commander
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SYSTEM LEAD
                </span>
              </div>
              <p className="text-slate-400 text-xs">commander@launchpilot.dev</p>
              <p className="text-[10px] text-slate-500">Member since November 2026 • Pro Tier Flight Clearance</p>
            </div>
          </div>
        </div>

        {/* Developer API Key Section */}
        <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Key className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-heading">
              Programmatic Scanner API Secret Key
            </h3>
          </div>

          <p className="text-slate-400 text-xs">
            Authenticate CI/CD pipelines (GitHub Actions, GitLab CI, Vercel Deploy Hook) to trigger pre-deployment launch audits automatically.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="password"
              readOnly
              value={apiKey}
              className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs select-all"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
