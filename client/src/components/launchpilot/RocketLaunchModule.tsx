import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useLaunchPilot } from '../../context/LaunchPilotContext';

export const RocketLaunchModule: React.FC<{ onOpenCertificate?: () => void }> = ({ onOpenCertificate }) => {
  const {
    currentScan,
    isScanning,
    scanProgress,
    currentScanningCheck,
    isLaunchArmed,
    isLaunching,
    hasLaunched,
    launchRocket,
    resetLaunch,
  } = useLaunchPilot();

  const score = currentScan?.readinessScore ?? 0;
  const launchStatus = currentScan?.launchStatus ?? 'NOT_SCANNED';

  // Flame intensity calculation based on score / scanning state
  const isGo = launchStatus === 'GO' && score >= 75;
  const isNoGo = launchStatus === 'NO-GO';
  const isConditional = launchStatus === 'CONDITIONAL';

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0B0F19]/90 to-[#070A12]/95 border border-cyan-500/20 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden min-h-[580px]">
      {/* Background Starfield & HUD Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Ambient Glow Aura based on status */}
      <div
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isLaunching
            ? 'bg-amber-500/40'
            : isGo
            ? 'bg-emerald-500/25'
            : isNoGo
            ? 'bg-rose-500/25'
            : isConditional
            ? 'bg-amber-500/20'
            : 'bg-cyan-500/15'
        }`}
      />

      {/* Top Header: Telemetry & Status Readout */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            ROCKET LAUNCH PAD TELEMETRY
          </span>
          <h3 className="text-base font-bold text-white tracking-tight font-heading mt-0.5">
            {isScanning
              ? 'PRE-FLIGHT DIAGNOSTICS'
              : hasLaunched
              ? 'ORBITAL INSERTION ACHIEVED'
              : isLaunching
              ? 'IGNITION SEQUENCE ENGAGED'
              : isGo
              ? 'LAUNCH SYSTEMS ARMED'
              : isNoGo
              ? 'FLIGHT RESTRICTION: NO-GO'
              : 'STANDBY TRAJECTORY'}
          </h3>
        </div>

        {/* Status Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 shadow-sm ${
            isGo
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : isNoGo
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : isConditional
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {isGo ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : isNoGo ? (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>STATUS: {launchStatus}</span>
        </div>
      </div>

      {/* Center Stage: The Animated Rocket & Launch Silo */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-6 py-4">
        {/* Radar Rings during scan */}
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.8, 1.25, 0.8] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="absolute w-64 h-64 rounded-full border border-cyan-400/40 pointer-events-none"
          />
        )}

        {/* Scan line passing vertically over rocket */}
        {isScanning && (
          <motion.div
            animate={{ y: [-120, 140, -120] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="absolute w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00E5FF] z-20 pointer-events-none"
          />
        )}

        {/* Launchpad Gantry Silo Structure */}
        <div className="relative flex flex-col items-center">
          {/* Main Rocket Body Container */}
          <motion.div
            animate={
              hasLaunched
                ? { y: -380, opacity: 0, scale: 0.4 }
                : isLaunching
                ? { y: [-2, 2, -3, 3, -1], x: [1, -1, 1, -1, 0] }
                : isScanning
                ? { y: [0, -4, 0] }
                : { y: [0, -3, 0] }
            }
            transition={
              hasLaunched
                ? { duration: 1.2, ease: 'easeIn' }
                : isLaunching
                ? { repeat: Infinity, duration: 0.15 }
                : { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
            }
            className="relative z-10 cursor-pointer"
            onClick={() => {
              if (isLaunchArmed && !isLaunching && !hasLaunched) {
                launchRocket();
              }
            }}
          >
            {/* Rocket SVG Illustration */}
            <svg
              className="w-36 h-48 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] filter"
              viewBox="0 0 100 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Rocket Nose Cone */}
              <path
                d="M50 8 C42 22 36 45 36 68 L64 68 C64 45 58 22 50 8 Z"
                fill={isGo ? '#10B981' : isNoGo ? '#EF4444' : '#00E5FF'}
                stroke="#E2E8F0"
                strokeWidth="1.5"
              />

              {/* Cockpit Window Porthole */}
              <circle cx="50" cy="46" r="8" fill="#0A0E1A" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="48" cy="44" r="3" fill="#38BDF8" opacity="0.8" />

              {/* Main Fuselage Body */}
              <rect x="36" y="68" width="28" height="52" rx="4" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />

              {/* Body Decals / Stripes */}
              <line x1="42" y1="78" x2="58" y2="78" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
              <line x1="42" y1="86" x2="58" y2="86" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="42" y1="94" x2="58" y2="94" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />

              {/* Launch Readiness Score Decal */}
              <rect x="40" y="102" width="20" height="12" rx="2" fill="#090D16" />
              <text x="50" y="111" fill="#F8FAFC" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {score}%
              </text>

              {/* Left Wing Booster */}
              <path
                d="M36 85 L20 120 L36 114 Z"
                fill={isGo ? '#059669' : '#334155'}
                stroke="#64748B"
                strokeWidth="1.5"
              />

              {/* Right Wing Booster */}
              <path
                d="M64 85 L80 120 L64 114 Z"
                fill={isGo ? '#059669' : '#334155'}
                stroke="#64748B"
                strokeWidth="1.5"
              />

              {/* Bottom Thruster Bell Nozzle */}
              <polygon points="41,120 59,120 55,128 45,128" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
            </svg>

            {/* Thruster Flames (Animated) */}
            {(isScanning || isGo || isLaunching) && (
              <motion.div
                animate={{
                  scaleY: isLaunching ? [1.2, 1.8, 1.4] : [0.8, 1.1, 0.85],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ repeat: Infinity, duration: 0.25 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
              >
                {/* Core Plasma Jet */}
                <div
                  className={`w-4 rounded-full blur-[1px] transition-all duration-300 ${
                    isLaunching
                      ? 'h-16 bg-gradient-to-b from-amber-200 via-orange-500 to-transparent'
                      : isGo
                      ? 'h-10 bg-gradient-to-b from-emerald-200 via-emerald-500 to-transparent'
                      : 'h-8 bg-gradient-to-b from-cyan-200 via-cyan-500 to-transparent'
                  }`}
                />
                {/* Smoke & Particle Vapor */}
                <div
                  className={`w-8 h-8 rounded-full blur-md -mt-3 opacity-60 ${
                    isLaunching ? 'bg-orange-500' : isGo ? 'bg-emerald-400' : 'bg-cyan-400'
                  }`}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Launch Pad Base & Mechanical Clamps */}
          <div className="relative mt-2 flex flex-col items-center z-0">
            {/* Clamps */}
            <div className="flex items-center gap-14 -mb-1">
              <div
                className={`w-3.5 h-6 rounded-t border-t border-l border-r border-slate-600 transition-colors ${
                  isGo ? 'bg-emerald-600/60' : 'bg-slate-700'
                }`}
              />
              <div
                className={`w-3.5 h-6 rounded-t border-t border-l border-r border-slate-600 transition-colors ${
                  isGo ? 'bg-emerald-600/60' : 'bg-slate-700'
                }`}
              />
            </div>
            {/* Pad Platform */}
            <div className="w-48 h-3.5 bg-slate-800 rounded-lg border border-slate-700 shadow-lg flex items-center justify-around px-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <div className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">
                PAD 01 • SILO BRAVO
              </div>
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>
          </div>
        </div>

        {/* Live Scan Telemetry Progress Text */}
        {isScanning && (
          <div className="w-full max-w-xs mt-6 text-center space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-cyan-400">
              <span>SCANNING TELEMETRY...</span>
              <span>{scanProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/30">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-slate-400 truncate">
              {currentScanningCheck}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Section: Readiness Metrics & Action Trigger */}
      <div className="relative z-10 space-y-4 pt-4 border-t border-slate-800/80">
        {/* Readiness Meter Gauge Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400 text-[11px] uppercase">
              Launch Readiness Score
            </span>
            <span
              className={`font-mono font-bold text-sm ${
                isGo ? 'text-emerald-400' : isNoGo ? 'text-rose-400' : 'text-amber-400'
              }`}
            >
              {score}% / 100%
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full transition-colors ${
                isGo
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                  : isNoGo
                  ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
            />
          </div>

          {/* Quick Checks Summary */}
          {currentScan && (
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span className="text-emerald-400">✓ {currentScan.passedCount} Passed</span>
              <span className="text-amber-400">▲ {currentScan.warningCount} Warnings</span>
              <span className="text-rose-400">✗ {currentScan.failedCount} Failed</span>
            </div>
          )}
        </div>

        {/* Primary Launch Action Controls */}
        <div>
          {hasLaunched ? (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  SUCCESSFUL LAUNCH CONFIRMED!
                </span>
                <p className="text-[11px] text-slate-300">
                  Target verified & cleared for public production traffic.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenCertificate && onOpenCertificate()}
                  className="py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  View Certificate
                </button>
                <button
                  onClick={resetLaunch}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Pad
                </button>
              </div>
            </div>
          ) : isLaunching ? (
            <div className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-mono text-xs font-bold uppercase tracking-widest text-center shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 animate-pulse">
              <Flame className="w-4 h-4 animate-bounce" />
              <span>IGNITION IN PROGRESS... LIFTOFF!</span>
            </div>
          ) : isLaunchArmed ? (
            <button
              onClick={launchRocket}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-mono text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 group transform active:scale-[0.99]"
            >
              <Rocket className="w-4 h-4 text-slate-950 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              <span>INITIATE PUBLIC LAUNCH (GO)</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-slate-400">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>LAUNCH INTERLOCK ENGAGED</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {isNoGo
                  ? 'Resolve mandatory failed checks to unlock rocket launch clearance.'
                  : 'Run full scan to evaluate launch readiness gates.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
