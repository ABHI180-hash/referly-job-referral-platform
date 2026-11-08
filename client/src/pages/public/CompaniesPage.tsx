import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { CompanyCard } from '@/components/jobs/CompanyCard';
import { PageMeta } from '@/components/common/PageMeta';
import { EmptyState } from '@/components/common/EmptyState';
import { Search, Building2, X, Globe2 } from 'lucide-react';

export const CompaniesPage: React.FC = () => {
  const { companies } = useApp();

  const hiringRoleCategories = useMemo(
    () => [
      { id: 'all', label: 'All Roles' },
      { id: 'Frontend', label: 'Frontend' },
      { id: 'Backend', label: 'Backend' },
      { id: 'Full Stack', label: 'Full Stack' },
      { id: 'AI / ML', label: 'AI & Machine Learning' },
      { id: 'DevOps & Cloud', label: 'DevOps & Cloud' },
      { id: 'Product Management', label: 'Product Management' },
      { id: 'UI/UX Design', label: 'UI/UX Design' },
      { id: 'Mobile', label: 'Mobile' },
      { id: 'Data Engineering', label: 'Data Engineering' },
      { id: 'Cybersecurity', label: 'Cybersecurity' },
    ],
    []
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedHiringRole, setSelectedHiringRole] = useState<string>('all');

  const industries = useMemo(() => {
    return Array.from(new Set(companies.map((c) => c.industry)));
  }, [companies]);

  const hiringRoleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: companies.length };
    companies.forEach((comp) => {
      comp.hiringRoles?.forEach((role) => {
        counts[role] = (counts[role] || 0) + 1;
      });
    });
    return counts;
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesTerm =
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.location.toLowerCase().includes(term) ||
        c.industry.toLowerCase().includes(term) ||
        (c.techStack && c.techStack.some((t) => t.toLowerCase().includes(term))) ||
        (c.hiringRoles && c.hiringRoles.some((r) => r.toLowerCase().includes(term)));

      const matchesIndustry =
        selectedIndustry === 'all' || c.industry.toLowerCase() === selectedIndustry.toLowerCase();

      const matchesHiringRole =
        selectedHiringRole === 'all' ||
        (c.hiringRoles &&
          c.hiringRoles.some((r) => r.toLowerCase().includes(selectedHiringRole.toLowerCase())));

      return matchesTerm && matchesIndustry && matchesHiringRole;
    });
  }, [companies, searchTerm, selectedIndustry, selectedHiringRole]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('all');
    setSelectedHiringRole('all');
  };

  const hasActiveFilters =
    Boolean(searchTerm) || selectedIndustry !== 'all' || selectedHiringRole !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      <PageMeta
        title="Partner Employers & Engineering Hubs"
        description="Explore top technology companies actively hiring candidates through verified employee referrals."
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/80">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-sans font-medium text-slate-600 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            <span>Companies Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-heading font-bold text-[#090A0F] tracking-tight leading-[1.25]">
            Partner Employers & Engineering Hubs
          </h1>
          <p className="mt-3.5 text-sm sm:text-base font-sans font-normal text-slate-600 max-w-2xl leading-relaxed text-pretty">
            Explore companies actively hiring across engineering, design, data, security, and product organizations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-sans font-medium text-slate-600 self-start md:self-auto bg-white px-3.5 py-2 rounded-lg border border-slate-200/90 shadow-2xs">
          <Globe2 className="w-4 h-4 text-[#2563EB]" />
          <span>Global Tech Employers</span>
        </div>
      </div>

      {/* Quick Hiring Role Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="font-sans text-xs font-medium text-slate-500 pr-1 shrink-0">Hiring Discipline:</span>
        {hiringRoleCategories.map((cat) => {
          const count = hiringRoleCounts[cat.id] ?? 0;
          const isActive = selectedHiringRole.toLowerCase() === cat.id.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedHiringRole(cat.id)}
              className={`px-3 py-1.5 rounded-md font-sans text-xs transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-[#090A0F] text-white shadow-xs font-semibold'
                  : 'bg-white border border-slate-200/90 text-slate-600 hover:border-slate-400 hover:text-[#090A0F]'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-card space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies by name, domain, stack, or role (e.g. Stripe, Go, React, AI)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] text-slate-900 placeholder:text-slate-400 font-sans"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedHiringRole}
              onChange={(e) => setSelectedHiringRole(e.target.value)}
              className="w-full py-2.5 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] font-medium"
            >
              {hiringRoleCategories.map((rc) => (
                <option key={rc.id} value={rc.id}>
                  {rc.label} {rc.id !== 'all' ? `(${hiringRoleCounts[rc.id] ?? 0})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full py-2.5 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
            >
              <option value="all">All Tech Domains</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span className="font-mono text-xs text-slate-500">
            SHOWING <strong className="text-[#090A0F]">{filteredCompanies.length}</strong> ACTIVE EMPLOYER TEAMS
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-rose-600 hover:text-rose-700 font-medium inline-flex items-center gap-1 text-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No companies match query"
          description="Try broadening your keyword search or resetting industry domains."
          actionText="Reset Filters"
          onAction={handleClearFilters}
        />
      )}
    </div>
  );
};
