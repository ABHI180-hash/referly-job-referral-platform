import React from 'react';
import { Link } from 'react-router-dom';
import { PageMeta } from '@/components/common/PageMeta';
import {
  ShieldCheck,
  Target,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      <PageMeta
        title="About Referly"
        description="Learn about Referly's mission to connect talented candidates directly with verified tech employees."
      />

      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-sans font-medium text-slate-600 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
          <span>About Referly</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-heading font-bold text-[#090A0F] tracking-tight leading-tight">
          Building Better Connections for Better Careers
        </h1>
        <p className="mt-3.5 text-base sm:text-lg font-sans text-slate-600 leading-relaxed max-w-2xl mx-auto text-pretty">
          Referly helps job seekers connect with professionals, discover opportunities, and build meaningful career relationships beyond traditional job applications.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200/90 p-8 shadow-card space-y-4">
          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-[#090A0F]">
            <Target className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-[#090A0F] tracking-tight">Our Core Mission</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Eliminate cold inbox noise and broken ATS algorithms. We build structured, verifiable internal referral pipelines where candidates are reviewed on merit, craft, and code by the peers who would work alongside them.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-8 shadow-card space-y-4">
          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-[#090A0F]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-[#090A0F] tracking-tight">Our Vision</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A merit-first tech ecosystem where career mobility is transparent and accessible. High-signal employee sponsorship replaces legacy recruiter agency markups and nepotistic closed networks.
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div id="principles" className="space-y-6 scroll-mt-24">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-1 rounded-full bg-blue-50/90 border border-blue-200/60 text-xs font-sans font-semibold text-[#2563EB] tracking-wide">
            <span>Operating Standards</span>
          </div>
          <h2 className="text-2xl font-bold text-[#090A0F] tracking-tight">Three Non-Negotiable Principles</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div id="verification" className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card space-y-3 scroll-mt-24">
            <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#090A0F]">Domain Authentication</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every employee referrer must authenticate via corporate enterprise email. Fake accounts, intermediaries, and agency headhunters are blocked by default.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card space-y-3">
            <div className="w-8 h-8 rounded-md bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#090A0F]">Zero Kickback Policy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Job seekers never pay employees for referrals. Corporate bonuses are issued exclusively through sanctioned employer HR programs.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card space-y-3">
            <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#090A0F]">Structured Requests</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No rambling cold DMs. Referly candidates submit clean, standardized dossiers highlighting relevant repositories, skills, and portfolio work.
            </p>
          </div>
        </div>
      </div>

      {/* Deliverable Metrics */}
      <div id="telemetry" className="bg-white rounded-xl border border-slate-200/90 p-8 sm:p-10 shadow-card space-y-8 scroll-mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-[#090A0F] text-center tracking-tight">
          Quantifiable Pipeline Advantage
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#090A0F] font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              For Job Seekers
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Direct visibility and meaningful review by experienced team members.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Direct submission into internal ATS portals with guaranteed employee review.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Audit trail with real-time status updates from request to interview.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#090A0F] font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              For Corporate Referrers
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Clean dashboard with pre-vetted dossiers matching specific team reqs.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Full privacy controls: refer candidates without exposing personal corporate email.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Direct access to legitimate corporate employee referral bonuses.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#090A0F] text-white rounded-xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            Ready to explore verified referral opportunities?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse verified openings or register as an employee sponsor today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/jobs"
            className="px-4 py-2.5 rounded-md text-xs font-semibold bg-white text-[#090A0F] hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Explore Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/referrals"
            className="px-4 py-2.5 rounded-md text-xs font-semibold border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
          >
            Find Sponsors
          </Link>
        </div>
      </div>
    </div>
  );
};
