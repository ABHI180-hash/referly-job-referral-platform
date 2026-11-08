import React from 'react';
import { ReferrerProfile } from '@/types';
import { CompanyLogo } from '@/components/common/CompanyLogo';
import { CheckCircle2, Send, ExternalLink } from 'lucide-react';

interface ReferrerCardProps {
  referrer: ReferrerProfile;
  onRequestReferral: (referrer: ReferrerProfile) => void;
  onViewProfile?: (referrer: ReferrerProfile) => void;
}

export const ReferrerCard: React.FC<ReferrerCardProps> = ({
  referrer,
  onRequestReferral,
}) => {
  const isAvailable = referrer.availability === 'Available';
  const isBusy = referrer.availability === 'Busy';

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-400/80 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
      {/* Top subtle highlight line on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-[#2563EB] transition-colors" />

      <div>
        {/* Header: Verified badge & Availability */}
        <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100/90 mb-4">
          <div className="inline-flex items-center gap-2 font-sans text-xs text-slate-500 font-medium flex-wrap">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAvailable ? 'bg-emerald-500' : isBusy ? 'bg-amber-500' : 'bg-slate-400'
              }`}
            />
            <CompanyLogo company={referrer.company} logoUrl={referrer.companyLogo} size={18} className="rounded-xs border-0 p-0 shadow-none bg-transparent" />
            <span className="font-semibold text-slate-800">{referrer.company}</span>
            {referrer.roleCategory && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-medium bg-blue-50 text-[#2563EB] border border-blue-200/80">
                {referrer.roleCategory}
              </span>
            )}
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium border ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                : isBusy
                ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                : 'bg-slate-100 text-slate-600 border-slate-200/80'
            }`}
          >
            {isAvailable ? 'Open to Refer' : isBusy ? 'High Volume' : 'Unavailable'}
          </span>
        </div>

        {/* Identity Row: Defensively constrained avatar + Name + Position */}
        <div className="flex items-start gap-3.5">
          {/* Avatar Container: strict inline dimensions and Tailwind classes so it can never stretch */}
          <div
            className="relative flex-shrink-0 rounded-lg overflow-hidden ring-1 ring-slate-900/10 bg-slate-100"
            style={{
              width: '56px',
              height: '56px',
              minWidth: '56px',
              minHeight: '56px',
              maxWidth: '56px',
              maxHeight: '56px',
            }}
          >
            <img
              src={referrer.avatar}
              alt={referrer.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-heading font-semibold text-[#090A0F] tracking-tight truncate group-hover:text-[#2563EB] transition-colors">
                {referrer.name}
              </h3>
              <span title="Verified Corporate Identity">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
              </span>
            </div>

            <p className="text-xs font-sans text-slate-700 font-medium truncate mt-0.5">
              {referrer.position}
            </p>

            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-900">{referrer.company}</span>
              <span>·</span>
              <span className="font-mono text-slate-600">{referrer.experienceYears}y exp</span>
              {referrer.department && (
                <>
                  <span>·</span>
                  <span className="truncate text-slate-500">{referrer.department}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-3.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {referrer.bio}
        </p>

        {/* Skills Ledger */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {referrer.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200/80"
            >
              {skill}
            </span>
          ))}
          {referrer.skills.length > 4 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400">
              +{referrer.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Card footer: Telemetry Ledger & Primary Action */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="font-mono text-xs font-semibold text-[#090A0F]">
              {referrer.totalReferrals}
            </div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
              Spon.
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div>
            <div className="font-mono text-xs font-semibold text-emerald-600">
              {referrer.successRate}%
            </div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
              Pass Rate
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {referrer.linkedinUrl && (
            <a
              href={referrer.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-md border border-slate-200 text-slate-500 hover:text-[#090A0F] hover:border-slate-400 transition-colors"
              title="Verified LinkedIn Profile"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={() => onRequestReferral(referrer)}
            disabled={referrer.availability === 'Unavailable'}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-white bg-[#090A0F] hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
          >
            <Send className="w-3 h-3" />
            <span>Request Referral</span>
          </button>
        </div>
      </div>
    </div>
  );
};
