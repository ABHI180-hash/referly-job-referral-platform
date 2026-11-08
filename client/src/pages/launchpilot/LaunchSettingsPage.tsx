import React, { useState } from 'react';
import { Settings, Shield, Sliders, Bell, Globe, Save, CheckCircle2 } from 'lucide-react';
import { PageMeta } from '../../components/common/PageMeta';
import { useLaunchPilot } from '../../context/LaunchPilotContext';

export const LaunchSettingsPage: React.FC = () => {
  const { soundEnabled, setSoundEnabled } = useLaunchPilot();

  const [settings, setSettings] = useState({
    timeoutSeconds: 15,
    autoRescanInterval: 'daily',
    ssrfStrictBlock: true,
    customUserAgent: 'LaunchPilot-Scanner/1.0 (+https://launchpilot.dev)',
    slackWebhook: '',
    emailAlerts: true,
    minReadinessThreshold: 75,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageMeta
        title="Scanner Configuration | LaunchPilot"
        description="Configure scanner timeouts, security parameters, webhook notifications, and automated rescan rules."
      />

      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-xl">
        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-widest block">
          SYSTEM PREFERENCES
        </span>
        <h1 className="text-2xl font-black text-white font-heading tracking-tight mt-1">
          Launch Control Center Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Fine-tune automated scan intervals, telemetry alert channels, and security inspection boundaries.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
        {/* Scanner Engine Settings */}
        <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-heading">
              Scanning Engine & Network Parameters
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block uppercase text-[11px]">
                Request Timeout (Seconds)
              </label>
              <input
                type="number"
                min={5}
                max={60}
                value={settings.timeoutSeconds}
                onChange={(e) => setSettings({ ...settings, timeoutSeconds: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block uppercase text-[11px]">
                Minimum Launch Gate Threshold (%)
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={settings.minReadinessThreshold}
                onChange={(e) => setSettings({ ...settings, minReadinessThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block uppercase text-[11px]">
              Crawler User-Agent Signature
            </label>
            <input
              type="text"
              value={settings.customUserAgent}
              onChange={(e) => setSettings({ ...settings, customUserAgent: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-xs"
            />
          </div>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
            <div>
              <span className="font-bold text-white block">Strict SSRF & Private IP Protection</span>
              <span className="text-slate-400 text-[11px]">Block attempts to scan localhost, loopback, or private cloud RFC1918 addresses.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.ssrfStrictBlock}
              onChange={(e) => setSettings({ ...settings, ssrfStrictBlock: e.target.checked })}
              className="rounded border-slate-700 text-cyan-500"
            />
          </label>
        </div>

        {/* Telemetry Audio & Notification Preferences */}
        <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Bell className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-heading">
              Audio Telemetry & Launch Advisories
            </h3>
          </div>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
            <div>
              <span className="font-bold text-white block">Interactive Audio Telemetry Tones</span>
              <span className="text-slate-400 text-[11px]">Play Web Audio synthesizer beeps, radar pings, and launch ignition effects.</span>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="rounded border-slate-700 text-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
            <div>
              <span className="font-bold text-white block">Automated Email Launch Advisories</span>
              <span className="text-slate-400 text-[11px]">Send instant notification when a mandatory check fails during scheduled runs.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.emailAlerts}
              onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
              className="rounded border-slate-700 text-cyan-500"
            />
          </label>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-emerald-400 text-xs font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved successfully.
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg flex items-center gap-2 text-xs font-mono uppercase tracking-wider"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
