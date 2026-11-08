import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PageMeta } from '@/components/common/PageMeta';
import {
  Inbox,
  Clock,
  CheckCircle2,
  Award,
  ArrowRight,
  Send,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export const ReferrerOverviewPage: React.FC = () => {
  const { currentUser, referralRequests } = useApp();

  const totalRequests = referralRequests.length;
  const pendingRequests = referralRequests.filter((r) => r.status === 'Pending').length;
  const acceptedRequests = referralRequests.filter((r) => r.status === 'Accepted').length;
  const completedReferrals = referralRequests.filter((r) => r.status === 'Completed').length + 12;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageMeta
        title="Referrer Hub & Review Pipeline"
        description="Review candidate referral requests and publish internal openings."
      />
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-7 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-sans font-medium text-slate-600 tracking-wide mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Verified Referrer · {currentUser?.company || 'Stripe'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#090A0F] tracking-tight">
            Referrer Hub & Pipeline
          </h1>
          <p className="text-sm sm:text-base font-sans text-slate-600 mt-2.5 max-w-xl leading-relaxed">
            Staff Engineer at <strong className="text-slate-900">{currentUser?.company || 'Stripe'}</strong>. You have {pendingRequests} candidate portfolios awaiting verification.
          </p>
        </div>

        <Link
          to="/referrer-dashboard/refer-candidate"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold text-white bg-[#090A0F] hover:bg-slate-800 shadow-xs transition-colors self-start"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Publish Referral Role</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Incoming Inquiries"
          value={totalRequests}
          subtitle="All candidate dossiers received"
          icon={Inbox}
        />
        <StatCard
          title="Pending Verification"
          value={pendingRequests}
          change="Action required"
          changeType="neutral"
          icon={Clock}
        />
        <StatCard
          title="Endorsed Candidates"
          value={acceptedRequests}
          change="89% interview pass rate"
          changeType="positive"
          icon={CheckCircle2}
        />
        <StatCard
          title="Hired Placement"
          value={completedReferrals}
          change="₹3,40,000 corporate awards"
          changeType="positive"
          icon={Award}
        />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Requests requiring attention */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#090A0F] tracking-tight uppercase font-mono">
                Candidate Review Queue
              </h2>
              <span className="text-[11px] text-slate-500">Awaiting internal employee decision</span>
            </div>
            <Link
              to="/referrer-dashboard/requests"
              className="font-mono text-xs text-[#2563EB] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>VIEW_QUEUE ({pendingRequests})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {referralRequests.map((req) => (
              <div key={req.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={req.candidateAvatar}
                    alt={req.candidateName}
                    className="w-9 h-9 rounded-md object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-[#090A0F] truncate">
                      {req.candidateName}
                    </h4>
                    <p className="text-[11px] text-slate-600 truncate">{req.jobTitle}</p>
                    <span className="text-[10px] font-mono text-slate-400">
                      SUBMITTED: {req.requestDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={req.status} />
                  <Link
                    to="/referrer-dashboard/requests"
                    className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-400 transition-colors"
                  >
                    Review Dossier
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Company Referral Policy */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-[#090A0F] tracking-tight uppercase font-mono">
              Employer Bonus Guide
            </h2>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-mono text-xs font-bold text-[#090A0F] block">
              {currentUser?.company?.toUpperCase() || 'STRIPE'} INTERNAL REFERRAL POLICY
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engineering and product referrals submitted via your internal company portal qualify for standard employee referral bonuses (₹1,50,000 to ₹3,00,000) issued directly by your employer upon 90-day retention.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="font-mono text-xs uppercase text-slate-500 font-semibold tracking-wide">
              SPONSORSHIP_CHECKLIST:
            </h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 flex-shrink-0" />
                <span>Verify GitHub repos and production live links.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 flex-shrink-0" />
                <span>Check alignment with your team's open level requirements.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 flex-shrink-0" />
                <span>Submit into internal HR portal (Workday/Greenhouse).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
