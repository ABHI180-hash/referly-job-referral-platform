import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity } from 'lucide-react';
import { LaunchStatus } from '../../types/launchpilot';

interface ReadinessGaugeProps {
  score: number;
  status: LaunchStatus;
  passedCount: number;
  totalChecks?: number;
  responseTimeMs?: number;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  score,
  status,
  passedCount,
  totalChecks = 15,
  responseTimeMs = 0,
}) => {
  const isGo = status === 'GO' && score >= 75;
  const isNoGo = status === 'NO-GO';

  // SVG circular gauge geometry
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative rounded-2xl bg-[#0B0F19]/90 border border-slate-800 p-6 shadow-xl flex flex-col items-center justify-between min-h-[320px] overflow-hidden">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none" />

      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800/80">
        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
          SYSTEM READINESS TELEMETRY
        </span>
        <span className="text-[10px] font-mono text-slate-500">GATE CRITERIA: 75%</span>
      </div>

      {/* Circular Radial HUD Meter */}
      <div className="relative my-4 flex items-center justify-center">
        <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 160 160">
          {/* Base Background Track Ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#1E293B"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray="4 2"
          />

          {/* Animated Value Progress Ring */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={isGo ? '#00FF9D' : isNoGo ? '#FF3366' : '#FFB800'}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_8px_rgba(0,255,157,0.4)]"
          />
        </svg>

        {/* Center Readout Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black font-mono tracking-tight text-white"
          >
            {score}%
          </motion.span>
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            LAUNCH READY
          </span>

          {/* Mini decision badge inside dial */}
          <div
            className={`mt-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
              isGo
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : isNoGo
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            {status}
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Footer */}
      <div className="w-full grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
        <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 block">VERIFIED CHECKS</span>
          <span className="text-sm font-bold text-slate-200">
            {passedCount} / {totalChecks}
          </span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 block">RESPONSE TIME</span>
          <span className="text-sm font-bold text-cyan-400">
            {responseTimeMs > 0 ? `${responseTimeMs}ms` : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );
};
