import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PageMeta } from '@/components/common/PageMeta';
import { CompanyLogo } from '@/components/common/CompanyLogo';
import {
  FileCheck2,
  Clock,
  Send,
  Bookmark,
  Calendar,
  ArrowRight,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const SeekerOverviewPage: React.FC = () => {
  const { currentUser, applications, referralRequests, savedJobIds } = useApp();

  const totalApps = applications.length;
  const pendingApps = applications.filter(
    (a) => a.status === 'Applied' || a.status === 'Under Review'
  ).length;
  const activeReferrals = referralRequests.filter((r) => r.status === 'Pending' || r.status === 'Accepted').length;
  const savedCount = savedJobIds.length;

  const interviewApp = applications.find((a) => a.status === 'Interview');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageMeta
        title="Candidate Overview & Pipeline"
        description="Monitor active applications, referral requests, and interview milestones."
      />
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-7 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-sans font-medium text-slate-600 tracking-wide mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Active Candidate · {currentUser?.name || 'Arjun Mehta'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#090A0F] tracking-tight">
            Candidate Pipeline Overview
          </h1>
          <p className="text-sm sm:text-base font-sans text-slate-600 mt-2.5 max-w-xl leading-relaxed">
            1 technical interview scheduled and 2 employee referrals currently undergoing internal employee submission.
          </p>
        </div>

        {/* Profile Strength */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-sans font-semibold mb-2">
            <span className="text-slate-700">Profile Completion</span>
            <span className="text-[#090A0F]">85%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#090A0F] rounded-full w-[85%]" />
          </div>
          <Link
            to="/dashboard/profile"
            className="text-xs font-sans text-[#2563EB] hover:underline mt-2.5 inline-block font-medium"
          >
            Add certifications to reach 100% →
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Submissions"
          value={totalApps}
          change="+2 this cycle"
          changeType="positive"
          icon={FileCheck2}
        />
        <StatCard
          title="Under Review"
          value={pendingApps}
          subtitle="Awaiting hiring committee"
          icon={Clock}
        />
        <StatCard
          title="Active Sponsors"
          value={activeReferrals}
          change="3.8x faster queue"
          changeType="positive"
          icon={Send}
        />
        <StatCard
          title="Saved Targets"
          value={savedCount}
          subtitle="Ready for referral request"
          icon={Bookmark}
        />
      </div>

      {/* Upcoming Interview Spotlight */}
      {interviewApp && (
        <div className="bg-white rounded-xl border border-[#090A0F] p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#090A0F] flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1.5 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  UPCOMING_TECHNICAL_INTERVIEW
                </div>
                <h3 className="text-base font-bold text-[#090A0F] tracking-tight">
                  {interviewApp.jobTitle} at {interviewApp.company}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Scheduled for <strong className="text-slate-900 font-mono">Tuesday, Nov 10, 2026 at 15:00 IST</strong> via Google Meet.
                </p>
                {interviewApp.referrerName && (
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    INTERNAL_SPONSOR: {interviewApp.referrerName.toUpperCase()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/dashboard/messages"
                className="px-3.5 py-2 rounded-md text-xs font-semibold text-white bg-[#090A0F] hover:bg-slate-800 transition-colors shadow-xs"
              >
                Message Sponsor
              </Link>
              <Link
                to="/dashboard/applications"
                className="px-3 py-2 rounded-md text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-400 transition-colors"
              >
                View Dossier
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Two Columns: Recent Applications & Referral Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Applications */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#090A0F] tracking-tight uppercase font-mono">
                Recent Submissions
              </h2>
              <span className="text-[11px] text-slate-500">Live candidate submission tracking</span>
            </div>
            <Link
              to="/dashboard/applications"
              className="font-mono text-xs text-[#2563EB] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>VIEW_ALL ({totalApps})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {applications.slice(0, 4).map((app) => (
              <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <CompanyLogo company={app.company} logoUrl={app.companyLogo} size={36} />
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-[#090A0F] truncate">
                      {app.jobTitle}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500 block">
                      {app.company} · {app.appliedDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={app.status} />
                  <Link
                    to="/dashboard/applications"
                    className="text-slate-400 hover:text-[#090A0F] p-1"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Referral Pipeline Requests */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#090A0F] tracking-tight uppercase font-mono">
                Sponsor Pipeline
              </h2>
              <span className="text-[11px] text-slate-500">Direct employee review queues</span>
            </div>
            <Link
              to="/dashboard/referral-requests"
              className="font-mono text-xs text-[#2563EB] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>MANAGE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {referralRequests.slice(0, 3).map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#090A0F]">{req.company}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] font-mono text-slate-500">{req.referrerName}</span>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-xs text-slate-700 truncate">{req.jobTitle}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                  <span>LOGGED: {req.requestDate}</span>
                  <Link
                    to="/dashboard/messages"
                    className="text-[#2563EB] font-semibold hover:underline"
                  >
                    OPEN_CHAT →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
