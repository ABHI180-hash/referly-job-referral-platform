import React, { useState } from 'react';
import {
  Smartphone,
  Link2,
  MailQuestion,
  Gauge,
  Image as ImageIcon,
  Lock,
  Compass,
  FileText,
  MessageSquare,
  AtSign,
  BarChart3,
  Search,
  Share2,
  Database,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import { ICheckItem, CheckStatus } from '../../types/launchpilot';

interface ChecklistCardProps {
  check: ICheckItem;
  onRecheck?: (checkId: number) => void;
  onManualVerify?: (check: ICheckItem) => void;
  isScanning?: boolean;
}

// Icon dictionary for all 15 checks
const getCheckIcon = (id: number) => {
  switch (id) {
    case 1:
      return <Smartphone className="w-5 h-5 text-cyan-400" />;
    case 2:
      return <Link2 className="w-5 h-5 text-blue-400" />;
    case 3:
      return <MailQuestion className="w-5 h-5 text-indigo-400" />;
    case 4:
      return <Gauge className="w-5 h-5 text-emerald-400" />;
    case 5:
      return <ImageIcon className="w-5 h-5 text-violet-400" />;
    case 6:
      return <Lock className="w-5 h-5 text-teal-400" />;
    case 7:
      return <Compass className="w-5 h-5 text-amber-400" />;
    case 8:
      return <FileText className="w-5 h-5 text-rose-400" />;
    case 9:
      return <MessageSquare className="w-5 h-5 text-emerald-500" />;
    case 10:
      return <AtSign className="w-5 h-5 text-cyan-300" />;
    case 11:
      return <BarChart3 className="w-5 h-5 text-orange-400" />;
    case 12:
      return <Search className="w-5 h-5 text-blue-300" />;
    case 13:
      return <Share2 className="w-5 h-5 text-pink-400" />;
    case 14:
      return <Database className="w-5 h-5 text-indigo-300" />;
    case 15:
      return <CreditCard className="w-5 h-5 text-emerald-300" />;
    default:
      return <HelpCircle className="w-5 h-5 text-slate-400" />;
  }
};

const getStatusBadge = (status: CheckStatus) => {
  switch (status) {
    case 'passed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <XCircle className="w-3.5 h-3.5" /> FAILED
        </span>
      );
    case 'warning':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" /> WARNING
        </span>
      );
    case 'scanning':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse">
          <RotateCw className="w-3.5 h-3.5 animate-spin" /> SCANNING
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700">
          NOT CHECKED
        </span>
      );
  }
};

export const ChecklistCard: React.FC<ChecklistCardProps> = ({
  check,
  onRecheck,
  onManualVerify,
  isScanning,
}) => {
  const [expanded, setExpanded] = useState(false);

  const isManualCheck = [3, 9, 10, 14, 15].includes(check.checkId);

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        check.status === 'failed'
          ? 'bg-[#0E121E]/90 border-rose-500/30 hover:border-rose-500/50'
          : check.status === 'warning'
          ? 'bg-[#0E121E]/90 border-amber-500/30 hover:border-amber-500/50'
          : check.status === 'passed'
          ? 'bg-[#0E121E]/90 border-slate-800 hover:border-emerald-500/40'
          : 'bg-[#0E121E]/70 border-slate-800/80 hover:border-slate-700'
      } p-4.5 space-y-3 shadow-lg`}
    >
      {/* Top Row: Icon, Title, Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center flex-shrink-0 shadow-inner">
            {getCheckIcon(check.checkId)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-cyan-400/80">#{String(check.checkId).padStart(2, '0')}</span>
              <h4 className="text-sm font-bold text-white tracking-tight font-heading truncate">
                {check.name}
              </h4>
              {check.isMandatory && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  MANDATORY
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {check.details || 'Awaiting live telemetry scan verification.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {getStatusBadge(check.status)}
        </div>
      </div>

      {/* Metric Score / Detail Snippet */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
        <div className="flex items-center gap-3">
          <span>SCORE: <strong className={check.score >= 80 ? 'text-emerald-400' : check.score >= 50 ? 'text-amber-400' : 'text-rose-400'}>{check.score}%</strong></span>
          <span className="text-slate-600">•</span>
          <span className="uppercase text-[11px] text-slate-500">{check.category}</span>
          {check.isManualVerified && (
            <>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 text-[11px]">MANUAL VERIFIED</span>
            </>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[11px]"
        >
          <span>{expanded ? 'Hide Diagnostics' : 'View Diagnostics'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Deep Diagnostic & Fix Section */}
      {expanded && (
        <div className="pt-3 border-t border-slate-800/80 space-y-3 text-xs">
          {/* Full Diagnostic Details */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
              DIAGNOSTIC TELEMETRY REPORT
            </span>
            <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
              {check.details}
            </p>
          </div>

          {/* Actionable Suggested Fix */}
          {check.fixSuggestion && (
            <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/30 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 block">
                RECOMMENDED REMEDIATION
              </span>
              <p className="text-cyan-100/90 leading-relaxed text-[11px]">
                {check.fixSuggestion}
              </p>
            </div>
          )}

          {/* Action Buttons: Recheck or Manual Verify */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-mono text-slate-500">
              Checked: {new Date(check.lastChecked).toLocaleTimeString()}
            </span>

            <div className="flex items-center gap-2">
              {isManualCheck && onManualVerify && (
                <button
                  onClick={() => onManualVerify(check)}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-mono transition-colors flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
                  <span>Manual Verify</span>
                </button>
              )}

              {onRecheck && (
                <button
                  onClick={() => onRecheck(check.checkId)}
                  disabled={isScanning}
                  className="px-2.5 py-1 rounded-md bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RotateCw className="w-3 h-3 text-cyan-400" />
                  <span>Recheck</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
