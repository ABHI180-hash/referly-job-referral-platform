import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatSalaryDisplay } from '@/utils/cn';
import { CompanyLogo } from '@/components/common/CompanyLogo';
import { Bookmark, MapPin, Building2, Clock, Users, ArrowUpRight, Send } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onRequestReferral?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onRequestReferral }) => {
  const { isJobSaved, toggleSaveJob } = useApp();
  const saved = isJobSaved(job.id);

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-400/80 p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
      {/* Top subtle highlight line on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-[#2563EB] transition-colors" />

      <div>
        {/* Top bar: Company & save action */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <CompanyLogo company={job.company} logoUrl={job.companyLogo} size={44} />

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-800 tracking-tight">
                  {job.company}
                </span>
                {job.roleCategory && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans font-medium bg-blue-50 text-[#2563EB] border border-blue-200/80">
                    {job.roleCategory}
                  </span>
                )}
                {job.featured && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-700 border border-slate-200/90">
                    FEATURED
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-heading font-semibold text-[#090A0F] group-hover:text-[#2563EB] transition-colors mt-0.5 tracking-tight">
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
              </h3>
            </div>
          </div>

          <button
            onClick={() => toggleSaveJob(job.id)}
            title={saved ? 'Remove from saved' : 'Save position'}
            className={`p-2 rounded-md border transition-all ${
              saved
                ? 'bg-blue-50 border-blue-200 text-[#2563EB]'
                : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 bg-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-[#2563EB]' : ''}`} />
          </button>
        </div>

        {/* Metadata Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.location}</span>
            <span className="font-mono text-[11px] text-slate-500">({job.workMode})</span>
          </span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.jobType}</span>
          </span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.experienceRange}</span>
          </span>
          {job.referrerCount && job.referrerCount > 0 && (
            <>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{job.referrerCount} ACTIVE SPONSORS</span>
              </span>
            </>
          )}
        </div>

        {/* Skills Ledger */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200/80"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400">
              +{job.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Card footer: Salary & Action buttons */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-sans font-medium text-slate-400 block">
            Compensation
          </span>
          <span className="font-sans text-xs sm:text-sm font-semibold text-[#090A0F] tracking-tight">
            {formatSalaryDisplay(job.salary, job.minSalary, job.maxSalary)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onRequestReferral && (
            <button
              onClick={() => onRequestReferral(job)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-[#090A0F] hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xs"
            >
              <Send className="w-3 h-3" />
              <span>Ask Referral</span>
            </button>
          )}

          <Link
            to={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-[#090A0F] bg-white border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
