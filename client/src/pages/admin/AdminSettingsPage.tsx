import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { Shield, Settings, Sliders, Save } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { addToast } = useApp();

  const [settings, setSettings] = useState({
    autoVerifyCorporate: true,
    requireResumeUpload: true,
    maxPendingRequestsFree: 2,
    maintenanceMode: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Platform administrative settings saved.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageMeta
        title="Admin Platform Settings"
        description="Configure platform security policies, corporate domain verification, and system settings."
      />
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Platform Governance & Global Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure security rules, corporate domain whitelists, and referral limit gates.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-5">
          <h2 className="text-base font-bold text-slate-900">Security & Referral Rules</h2>

          <div className="space-y-4 text-xs">
            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 block">
                  Mandatory Corporate Domain Verification
                </span>
                <span className="text-slate-500">
                  Require referrers to verify corporate DNS emails before appearing in search directories.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoVerifyCorporate}
                onChange={(e) =>
                  setSettings({ ...settings, autoVerifyCorporate: e.target.checked })
                }
                className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
            </label>

            <label className="flex items-start justify-between gap-4 cursor-pointer pt-3 border-t border-slate-100">
              <div>
                <span className="font-semibold text-slate-900 block">
                  Mandatory Resume Attachment
                </span>
                <span className="text-slate-500">
                  Enforce that candidate profiles must contain an uploaded resume before requesting referrals.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.requireResumeUpload}
                onChange={(e) =>
                  setSettings({ ...settings, requireResumeUpload: e.target.checked })
                }
                className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
            </label>

            <div className="pt-3 border-t border-slate-100">
              <label className="block font-semibold text-slate-900 mb-1">
                Free Tier Monthly Referral Request Cap
              </label>
              <input
                type="number"
                value={settings.maxPendingRequestsFree}
                onChange={(e) =>
                  setSettings({ ...settings, maxPendingRequestsFree: Number(e.target.value) })
                }
                className="w-40 text-xs rounded-lg border border-slate-200 p-2 text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
