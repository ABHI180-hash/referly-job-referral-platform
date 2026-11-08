import React, { useState } from 'react';
import {
  ListChecks,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  Search,
  SlidersHorizontal,
  ShieldCheck,
} from 'lucide-react';
import { useLaunchPilot } from '../../context/LaunchPilotContext';
import { PageMeta } from '../../components/common/PageMeta';
import { ChecklistCard } from '../../components/launchpilot/ChecklistCard';
import { ManualVerifyModal } from '../../components/launchpilot/ManualVerifyModal';
import { ICheckItem, CheckCategory } from '../../types/launchpilot';

export const LaunchChecklistPage: React.FC = () => {
  const { currentScan, isScanning, triggerScan, manualVerifyCheck, activeWebsite } = useLaunchPilot();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [mandatoryOnly, setMandatoryOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyingCheck, setVerifyingCheck] = useState<ICheckItem | null>(null);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All Categories' },
    { key: 'performance', label: 'Performance' },
    { key: 'security', label: 'Security' },
    { key: 'seo', label: 'SEO & Meta' },
    { key: 'compliance', label: 'Compliance & Links' },
    { key: 'integrations', label: 'Integrations' },
    { key: 'content', label: 'Content' },
  ];

  const checks = currentScan?.checks || [];

  const filteredChecks = checks.filter((c) => {
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesMandatory = !mandatoryOnly || c.isMandatory;
    const matchesSearch =
      !searchQuery.trim() ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.details.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStatus && matchesMandatory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageMeta
        title="15-Point Launch Checklist | LaunchPilot"
        description="Comprehensive 15-point launch readiness checklist with deep technical diagnostics and remediation steps."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              AUDIT PROTOCOL
            </span>
            <span className="text-xs font-mono text-slate-400">
              Target: <strong className="text-white">{activeWebsite?.domain || 'Active Domain'}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white font-heading tracking-tight mt-1">
            Complete 15-Point Launch Inspection Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Systematic pre-flight evaluation covering infrastructure, accessibility, compliance, and revenue gates.
          </p>
        </div>

        <button
          onClick={() => triggerScan()}
          disabled={isScanning}
          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center gap-2 self-start flex-shrink-0 disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning...' : 'Re-Run All Checks'}</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search checks by name or keyword..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-mono"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-400 text-xs font-mono w-full sm:w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="warning">Warnings</option>
            </select>

            {/* Mandatory Checkbox */}
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 cursor-pointer text-xs whitespace-nowrap">
              <input
                type="checkbox"
                checked={mandatoryOnly}
                onChange={(e) => setMandatoryOnly(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Mandatory Only</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3 py-1 rounded-lg border transition-all whitespace-nowrap ${
                categoryFilter === cat.key
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-3">
        {filteredChecks.length > 0 ? (
          filteredChecks.map((check) => (
            <ChecklistCard
              key={check.checkId}
              check={check}
              isScanning={isScanning}
              onRecheck={() => triggerScan()}
              onManualVerify={(c) => setVerifyingCheck(c)}
            />
          ))
        ) : (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-400 font-mono text-xs">
            No launch readiness checks matched your current filter criteria.
          </div>
        )}
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
