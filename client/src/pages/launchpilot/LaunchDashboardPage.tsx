import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe,
  Lock,
  Clock,
  Play,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  SlidersHorizontal,
} from 'lucide-react';
import { useLaunchPilot } from '../../context/LaunchPilotContext';
import { PageMeta } from '../../components/common/PageMeta';
import { RocketLaunchModule } from '../../components/launchpilot/RocketLaunchModule';
import { ChecklistCard } from '../../components/launchpilot/ChecklistCard';
import { ReadinessGauge } from '../../components/launchpilot/ReadinessGauge';
import { ManualVerifyModal } from '../../components/launchpilot/ManualVerifyModal';
import { ICheckItem, CheckStatus } from '../../types/launchpilot';

export const LaunchDashboardPage: React.FC = () => {
  const {
    activeWebsite,
    currentScan,
    isScanning,
    triggerScan,
    manualVerifyCheck,
    error,
    clearError,
  } = useLaunchPilot();

  const { openCertificate } = (useOutletContext<{ openCertificate?: () => void }>() || {});

  const [urlInput, setUrlInput] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'passed' | 'failed' | 'warning'>('all');
  const [verifyingCheck, setVerifyingCheck] = useState<ICheckItem | null>(null);

  const handleCustomScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    triggerScan(urlInput.trim());
  };

  const filteredChecks = (currentScan?.checks || []).filter((c) => {
    if (selectedFilter === 'all') return true;
    return c.status === selectedFilter;
  });

  const passedCount = currentScan?.passedCount ?? 0;
  const failedCount = currentScan?.failedCount ?? 0;
  const warningCount = currentScan?.warningCount ?? 0;
  const score = currentScan?.readinessScore ?? 0;
  const status = currentScan?.launchStatus ?? 'NOT_SCANNED';

  return (
    <div className="space-y-6">
      <PageMeta
        title="Launch Control Center | LaunchPilot"
        description="Verify website launch readiness across 15 essential checks: SSL, mobile responsiveness, links, performance, OpenGraph, and integrations."
      />

      {/* Global Error Banner if Scan Fails */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-center justify-between font-mono text-xs shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={clearError}
            className="px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Telemetry Mission Bar: Target Domain & Live URL Scanner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0B0F19] via-[#0D1322] to-[#0B0F19] border border-cyan-500/20 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Active Target Metadata */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                ACTIVE TARGET
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300">
                {activeWebsite?.environment || 'PRODUCTION'}
              </span>
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">•</span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Category: {activeWebsite?.category || 'SaaS'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
                {activeWebsite ? activeWebsite.domain : 'No Target Selected'}
              </h1>
              {activeWebsite && (
                <a
                  href={activeWebsite.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-cyan-400 transition-colors p-1"
                  title="Open live website in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Telemetry Status Capsule */}
          <div className="flex items-center gap-4 flex-wrap text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>SSL: <strong className={activeWebsite?.sslValid ? 'text-emerald-400' : 'text-slate-400'}>{activeWebsite?.sslValid ? 'Verified' : 'Unverified'}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Latency: <strong className="text-white">{activeWebsite?.responseTimeMs || 0}ms</strong></span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Last Scan: <strong className="text-slate-200">{activeWebsite?.lastScanAt ? new Date(activeWebsite.lastScanAt).toLocaleTimeString() : 'Never'}</strong></span>
            </div>
          </div>
        </div>

        {/* Live URL Entry Input & Scan CTA */}
        <form onSubmit={handleCustomScan} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={activeWebsite ? `Enter new URL or scan current: ${activeWebsite.url}` : 'Enter website URL (e.g. https://yourdomain.com)'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isScanning}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-mono text-xs font-black uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning Diagnostics...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Initiate Full 15-Point Scan</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Main Grid: Left 8 Cols (Checklist) + Right 4 Cols (Rocket Launch Module & Readiness Gauge) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 15 Launch Readiness Checks (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Checklist Header & Status Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white font-heading tracking-tight flex items-center gap-2">
                <span>15-Point Launch Readiness Checklist</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {passedCount}/15 Passed
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every check requires live automated verification or confirmed manual audit.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 font-mono text-[11px]">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                All (15)
              </button>
              <button
                onClick={() => setSelectedFilter('passed')}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  selectedFilter === 'passed'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Passed ({passedCount})
              </button>
              <button
                onClick={() => setSelectedFilter('failed')}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  selectedFilter === 'failed'
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Failed ({failedCount})
              </button>
              <button
                onClick={() => setSelectedFilter('warning')}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  selectedFilter === 'warning'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Warnings ({warningCount})
              </button>
            </div>
          </div>

          {/* Cards List */}
          {currentScan ? (
            <div className="space-y-3">
              {filteredChecks.map((check) => (
                <ChecklistCard
                  key={check.checkId}
                  check={check}
                  isScanning={isScanning}
                  onRecheck={() => triggerScan()}
                  onManualVerify={(c) => setVerifyingCheck(c)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
              <RotateCw className="w-8 h-8 text-cyan-400 mx-auto animate-spin" />
              <div className="text-white font-bold text-sm font-heading">
                Ready to Initiate Launch Readiness Scan
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Hit "Initiate Full 15-Point Scan" to run live automated checks on {activeWebsite?.domain || 'your website'}.
              </p>
              <button
                onClick={() => triggerScan()}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold"
              >
                Start Verification Scan
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Rocket Launch Center & Readiness Gauge (4-5 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Animated Rocket Launch System (The Central Visual Feature) */}
          <RocketLaunchModule onOpenCertificate={openCertificate} />

          {/* Circular HUD Readiness Gauge */}
          <ReadinessGauge
            score={score}
            status={status}
            passedCount={passedCount}
            responseTimeMs={activeWebsite?.responseTimeMs}
          />
        </div>
      </div>

      {/* Manual Verification Modal */}
      <ManualVerifyModal
        check={verifyingCheck}
        isOpen={Boolean(verifyingCheck)}
        onClose={() => setVerifyingCheck(null)}
        onConfirm={async (checkId, note, status) => {
          await manualVerifyCheck(checkId, note, status);
        }}
      />
    </div>
  );
};
