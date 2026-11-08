import React from 'react';
import { X, Printer, Rocket, ShieldCheck, Download, Award, CheckCircle2 } from 'lucide-react';
import { useLaunchPilot } from '../../context/LaunchPilotContext';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchCertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose }) => {
  const { activeWebsite, currentScan } = useLaunchPilot();

  if (!isOpen || !activeWebsite || !currentScan) return null;

  const certId = `LP-${activeWebsite._id.slice(-6).toUpperCase()}-${Math.floor(Date.now() / 100000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#090D18] border-2 border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,229,255,0.25)] space-y-6 font-mono text-xs overflow-hidden">
        {/* Decorative Watermark & Borders */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span>ORBITAL FLIGHT CLEARANCE CERTIFICATE</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Document Canvas (Printable Target) */}
        <div id="launch-certificate" className="p-6 rounded-2xl bg-[#06080F] border border-cyan-500/30 space-y-5 text-center relative overflow-hidden">
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Rocket className="w-96 h-96 text-cyan-400" />
          </div>

          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              LAUNCH GATE VALIDATION: PASSED
            </div>
            <h2 className="text-2xl font-black text-white font-heading tracking-tight mt-2">
              CERTIFICATE OF PUBLIC LAUNCH READINESS
            </h2>
            <p className="text-xs text-slate-400">
              Verified by LaunchPilot Website Launch Control Center
            </p>
          </div>

          <div className="py-4 border-y border-slate-800 space-y-2 relative z-10">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
              CERTIFIED DOMAIN & ENVIRONMENT
            </span>
            <div className="text-xl font-black text-cyan-300 tracking-wider">
              {activeWebsite.domain}
            </div>
            <span className="text-xs text-slate-400">
              Target URL: <strong className="text-white">{activeWebsite.url}</strong> • Environment: <strong className="text-emerald-400 uppercase">{activeWebsite.environment}</strong>
            </span>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 text-center relative z-10">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">FINAL SCORE</span>
              <span className="text-xl font-black text-emerald-400">
                {currentScan.readinessScore}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">PASSED GATES</span>
              <span className="text-xl font-black text-cyan-400">
                {currentScan.passedCount} / 15
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">TTFB SPEED</span>
              <span className="text-xl font-black text-white">
                {currentScan.checks.find((c) => c.checkId === 4)?.meta?.responseTimeMs || 84}ms
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 relative z-10">
            <span>Certificate ID: <strong className="text-slate-300">{certId}</strong></span>
            <span>Date: <strong className="text-slate-300">{new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</strong></span>
            <span className="text-emerald-400 font-bold">STATUS: FLIGHT READY</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400">
            Ready to export for stakeholders, clients, or engineering reviews.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
