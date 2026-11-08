import React from 'react';
import { Link } from 'react-router-dom';
import { Company } from '@/types';
import { CompanyLogo } from '@/components/common/CompanyLogo';
import { MapPin, Users, ArrowUpRight } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-400/80 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
      {/* Top subtle highlight line on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-[#2563EB] transition-colors" />

      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <CompanyLogo company={company.name} logoUrl={company.logo} size={48} />

            <div>
              <h3 className="text-base sm:text-lg font-heading font-semibold text-[#090A0F] group-hover:text-[#2563EB] transition-colors tracking-tight">
                {company.name}
              </h3>
              <p className="font-sans text-xs text-slate-500 font-medium">
                {company.industry}
              </p>
            </div>
          </div>

          {company.featured && (
            <span className="px-2 py-0.5 rounded text-[11px] font-sans font-medium uppercase bg-slate-100 text-slate-700 border border-slate-200/90">
              Actively Hiring
            </span>
          )}
        </div>

        <p className="mt-3.5 text-xs sm:text-sm font-sans text-slate-600 line-clamp-2 leading-relaxed">
          {company.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-y-1.5 gap-x-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{company.location}</span>
          </span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px]">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{company.employeeCount}</span>
          </span>
        </div>

        {/* Hiring Roles Tags */}
        {company.hiringRoles && company.hiringRoles.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-slate-100/90">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
              Hiring Roles:
            </div>
            <div className="flex flex-wrap gap-1">
              {company.hiringRoles.slice(0, 3).map((role) => (
                <span
                  key={role}
                  className="px-1.5 py-0.5 rounded text-[10px] font-sans font-medium bg-blue-50 text-[#2563EB] border border-blue-200/60"
                >
                  {role}
                </span>
              ))}
              {company.hiringRoles.length > 3 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-500">
                  +{company.hiringRoles.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tech Stack Chips */}
        {company.techStack && company.techStack.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {company.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-50 text-slate-600 border border-slate-200/80"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {company.openPositions} ROLES OPEN
        </span>

        <Link
          to={`/jobs?company=${encodeURIComponent(company.name)}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#090A0F] group-hover:underline transition-colors"
        >
          <span>View Roles</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
