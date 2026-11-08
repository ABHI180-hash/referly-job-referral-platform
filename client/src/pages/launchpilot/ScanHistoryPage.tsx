import React, { useState, useEffect } from 'react';
import {
  History,
  RotateCw,
  Search,
  Filter,
  ArrowRight,
  GitCompare,
  Download,
  Calendar,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useLaunchPilot } from '../../context/LaunchPilotContext';
import { PageMeta } from '../../components/common/PageMeta';
import { launchPilotApi } from '../../services/launchPilotApi';
import { IScanResult } from '../../types/launchpilot';

export const ScanHistoryPage: React.FC = () => {
  const { activeWebsite, scanHistory, triggerScan, isScanning } = useLaunchPilot();

  const [scans, setScans] = useState<IScanResult[]>(scanHistory);
  const [selectedScan1, setSelectedScan1] = useState<string>('');
  const [selectedScan2, setSelectedScan2] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await launchPilotApi.getScanHistory(activeWebsite?._id);
        setScans(history);
      } catch (err) {
        console.warn('History fetch error:', err);
      }
    };
    fetchHistory();
  }, [activeWebsite]);

  const filteredScans = scans.filter((s) => {
    return (
      s.domain.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.launchStatus.toLowerCase().includes(filterQuery.toLowerCase())
    );
  });

  const handleRunComparison = async () => {
    if (!selectedScan1 || !selectedScan2) return;
    try {
      const diff = await launchPilotApi.compareScans(selectedScan1, selectedScan2);
      setComparisonResult(diff);
      setCompareModalOpen(true);
    } catch (err) {
      console.warn('Comparison error:', err);
    }
  };

  const handleExportCSV = () => {
    if (scans.length === 0) return;
    const headers = 'Domain,Date,ReadinessScore,LaunchStatus,PassedCount,FailedCount,WarningCount,DurationMs\n';
    const rows = scans
      .map(
        (s) =>
          `"${s.domain}","${new Date(s.createdAt).toISOString()}","${s.readinessScore}","${s.launchStatus}","${s.passedCount}","${s.failedCount}","${s.warningCount}","${s.durationMs}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `launchpilot_scan_history_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageMeta
        title="Scan History & Audit Trail | LaunchPilot"
        description="Comprehensive audit log of previous website launch-readiness scans, side-by-side comparison, and PDF export."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              AUDIT LOG
            </span>
            <span className="text-xs font-mono text-slate-400">
              Total Recorded Scans: <strong className="text-white">{scans.length}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white font-heading tracking-tight mt-1">
            Historical Diagnostic Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inspect past telemetry runs, compare performance deltas, and export audit trails.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-semibold transition-colors flex items-center gap-2 self-start flex-shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export History CSV</span>
        </button>
      </div>

      {/* Compare Tool Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <GitCompare className="w-3.5 h-3.5" />
            COMPARE TWO SCAN RUNS (REGRESSION ANALYSIS)
          </span>
          <span className="text-slate-500 text-[10px]">Select Baseline vs Current</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={selectedScan1}
            onChange={(e) => setSelectedScan1(e.target.value)}
            className="w-full sm:w-1/2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono"
          >
            <option value="">Select Baseline Scan 1...</option>
            {scans.map((s) => (
              <option key={s._id} value={s._id}>
                {new Date(s.createdAt).toLocaleDateString()} — {s.domain} ({s.readinessScore}% - {s.launchStatus})
              </option>
            ))}
          </select>

          <select
            value={selectedScan2}
            onChange={(e) => setSelectedScan2(e.target.value)}
            className="w-full sm:w-1/2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono"
          >
            <option value="">Select Target Scan 2...</option>
            {scans.map((s) => (
              <option key={s._id} value={s._id}>
                {new Date(s.createdAt).toLocaleDateString()} — {s.domain} ({s.readinessScore}% - {s.launchStatus})
              </option>
            ))}
          </select>

          <button
            onClick={handleRunComparison}
            disabled={!selectedScan1 || !selectedScan2}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 flex-shrink-0"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Runs</span>
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-[#0B0F19] border border-slate-800 overflow-hidden shadow-xl font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Domain Target</th>
                <th className="py-3 px-4">Readiness Score</th>
                <th className="py-3 px-4">Launch Gate</th>
                <th className="py-3 px-4">Passed / Total</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredScans.length > 0 ? (
                filteredScans.map((scan) => {
                  const isGo = scan.launchStatus === 'GO';
                  const isNoGo = scan.launchStatus === 'NO-GO';

                  return (
                    <tr key={scan._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(scan.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {scan.domain}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold ${
                            isGo ? 'text-emerald-400' : isNoGo ? 'text-rose-400' : 'text-amber-400'
                          }`}
                        >
                          {scan.readinessScore}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isGo
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : isNoGo
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {scan.launchStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-emerald-400 font-bold">{scan.passedCount}</span>
                        <span className="text-slate-500"> / 15</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {scan.durationMs}ms
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={scan.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No historical scan records found. Run your first scan from the Control Center.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison Modal */}
      {compareModalOpen && comparisonResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-[#0B0F19] border border-cyan-500/40 p-6 shadow-2xl space-y-4 font-mono text-xs overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Scan Telemetry Comparison & Regression Diff
                </h3>
              </div>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">BASELINE SCORE</span>
                <span className="text-lg font-bold text-white">{comparisonResult.scan1?.score}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">DELTA PROGRESS</span>
                <span className={`text-lg font-bold ${comparisonResult.scoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {comparisonResult.scoreDelta >= 0 ? `+${comparisonResult.scoreDelta}%` : `${comparisonResult.scoreDelta}%`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">CURRENT TARGET SCORE</span>
                <span className="text-lg font-bold text-cyan-400">{comparisonResult.scan2?.score}%</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {comparisonResult.checkDiffs?.map((diff: any) => (
                <div
                  key={diff.checkId}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    diff.improved
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : diff.regressed
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : 'bg-slate-900/40 border-slate-800'
                  }`}
                >
                  <div>
                    <span className="font-bold text-white">#{diff.checkId} {diff.name}</span>
                    <span className="text-slate-500 text-[10px] block uppercase">{diff.category}</span>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Baseline → Target</span>
                      <span className="font-mono">{diff.scan1Status} ({diff.scan1Score}%) → <strong className="text-cyan-400">{diff.scan2Status} ({diff.scan2Score}%)</strong></span>
                    </div>

                    {diff.improved && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                        ▲ IMPROVED
                      </span>
                    )}
                    {diff.regressed && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 font-bold">
                        ▼ REGRESSED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setCompareModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
