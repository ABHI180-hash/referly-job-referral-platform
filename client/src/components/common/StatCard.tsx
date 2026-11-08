import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  subtitle,
}) => {
  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-400/80 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-[#2563EB] transition-colors" />

      <div className="flex items-center justify-between">
        <span className="font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-heading font-bold text-[#090A0F] tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`font-sans text-xs font-medium ${
              changeType === 'positive'
                ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200'
                : changeType === 'negative'
                ? 'text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200'
                : 'text-slate-600'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs font-sans text-slate-500 font-normal">{subtitle}</p>
      )}
    </div>
  );
};
