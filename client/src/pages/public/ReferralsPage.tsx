import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { ReferrerCard } from '@/components/referrals/ReferrerCard';
import { RequestReferralModal } from '@/components/referrals/RequestReferralModal';
import { Pagination } from '@/components/common/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { PageMeta } from '@/components/common/PageMeta';
import { ReferrerProfile } from '@/types';
import { Search, Users, X, SlidersHorizontal, ShieldCheck } from 'lucide-react';

export const ReferralsPage: React.FC = () => {
  const { referrers, companies } = useApp();

  const roleCategories = useMemo(
    () => [
      { id: 'all', label: 'All Disciplines' },
      { id: 'Frontend', label: 'Frontend & UI' },
      { id: 'Backend', label: 'Backend & Systems' },
      { id: 'Full Stack', label: 'Full Stack' },
      { id: 'AI / ML', label: 'AI & Machine Learning' },
      { id: 'DevOps & Cloud', label: 'DevOps & Cloud' },
      { id: 'Product Management', label: 'Product Management' },
      { id: 'UI/UX Design', label: 'UI/UX & Design' },
      { id: 'Mobile', label: 'Mobile Dev' },
      { id: 'Data Engineering', label: 'Data Engineering' },
      { id: 'Cybersecurity', label: 'Cybersecurity' },
    ],
    []
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'successRate' | 'totalReferrals'>('successRate');

  const [selectedReferrer, setSelectedReferrer] = useState<ReferrerProfile | null>(null);
  const [referralModalOpen, setReferralModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: referrers.length };
    referrers.forEach((ref) => {
      if (ref.roleCategory) {
        counts[ref.roleCategory] = (counts[ref.roleCategory] || 0) + 1;
      }
    });
    return counts;
  }, [referrers]);

  const topCompanies = useMemo(() => {
    return ['all', 'Stripe', 'Google', 'Microsoft', 'Figma', 'Vercel', 'Uber', 'OpenAI', 'Linear', 'CRED', 'Amazon'];
  }, []);

  const filteredReferrers = useMemo(() => {
    return referrers
      .filter((ref) => {
        const term = searchTerm.toLowerCase().trim();
        const matchesTerm =
          !term ||
          ref.name.toLowerCase().includes(term) ||
          ref.company.toLowerCase().includes(term) ||
          ref.position.toLowerCase().includes(term) ||
          (ref.roleCategory && ref.roleCategory.toLowerCase().includes(term)) ||
          ref.department.toLowerCase().includes(term) ||
          (Array.isArray(ref.skills) && ref.skills.some((s) => s.toLowerCase().includes(term)));

        const matchesRole =
          selectedRoleCategory === 'all' ||
          (ref.roleCategory && ref.roleCategory.toLowerCase() === selectedRoleCategory.toLowerCase()) ||
          ref.department.toLowerCase().includes(selectedRoleCategory.toLowerCase()) ||
          ref.position.toLowerCase().includes(selectedRoleCategory.toLowerCase());

        const matchesCompany =
          selectedCompany === 'all' || ref.company.toLowerCase() === selectedCompany.toLowerCase();

        const matchesAvailability =
          selectedAvailability === 'all' ||
          ref.availability.toLowerCase() === selectedAvailability.toLowerCase();

        return matchesTerm && matchesRole && matchesCompany && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === 'totalReferrals') {
          return b.totalReferrals - a.totalReferrals;
        }
        return b.successRate - a.successRate;
      });
  }, [referrers, searchTerm, selectedRoleCategory, selectedCompany, selectedAvailability, sortBy]);

  const totalPages = Math.ceil(filteredReferrers.length / pageSize);
  const paginatedReferrers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReferrers.slice(start, start + pageSize);
  }, [filteredReferrers, currentPage, pageSize]);

  const handleRequestReferral = (referrer: ReferrerProfile) => {
    setSelectedReferrer(referrer);
    setReferralModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRoleCategory('all');
    setSelectedCompany('all');
    setSelectedAvailability('all');
    setSortBy('successRate');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedRoleCategory !== 'all' ||
    selectedCompany !== 'all' ||
    selectedAvailability !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      <PageMeta
        title="Find Verified Employee Referrers"
        description="Connect with engineers, designers, and managers at Stripe, Figma, Vercel, and Linear willing to refer talented candidates."
      />
      {/* Header with Premium SaaS Pill */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/80">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-sans font-medium text-slate-600 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            <span>Referrer Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-heading font-bold text-[#090A0F] tracking-tight leading-[1.25]">
            Direct Employee Sponsorship
          </h1>
          <p className="mt-3.5 text-sm sm:text-base font-sans font-normal text-slate-600 max-w-2xl leading-relaxed text-pretty">
            Connect with professionals at leading companies who can share insights, review your profile, and help you navigate internal referral opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-sans font-medium text-slate-600 self-start md:self-auto bg-white px-3.5 py-2 rounded-lg border border-slate-200/90 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Response SLA &lt; 48h</span>
        </div>
      </div>

      {/* Quick Role & Discipline Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="font-sans text-xs font-medium text-slate-500 pr-1 shrink-0">Discipline:</span>
        {roleCategories.map((cat) => {
          const count = roleCounts[cat.id] ?? 0;
          const isActive = selectedRoleCategory.toLowerCase() === cat.id.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedRoleCategory(cat.id);
                setCurrentPage(1);
              }}
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

      {/* Quick Company Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="font-sans text-xs font-medium text-slate-500 pr-1 shrink-0">Company:</span>
        {topCompanies.map((c) => (
          <button
            key={c}
            onClick={() => {
              setSelectedCompany(c);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-md font-sans text-xs transition-all whitespace-nowrap ${
              selectedCompany.toLowerCase() === c.toLowerCase()
                ? 'bg-[#2563EB] text-white shadow-xs font-semibold'
                : 'bg-white border border-slate-200/90 text-slate-600 hover:border-slate-400 hover:text-[#090A0F]'
            }`}
          >
            {c === 'all' ? 'All Companies' : c}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by sponsor name, role, company, or stack (e.g. Figma, React, Go)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] text-slate-900 placeholder:text-slate-400 font-sans"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2.5 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
            >
              <option value="all">All Companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'successRate' | 'totalReferrals')}
              className="w-full py-2.5 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
            >
              <option value="successRate">Sort: Interview Rate (Highest)</option>
              <option value="totalReferrals">Sort: Total Spon. (Highest)</option>
            </select>
          </div>
        </div>

        {/* Bottom Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-[11px] text-slate-500 uppercase">Filters:</span>
            </div>

            {/* Role Dropdown */}
            <select
              value={selectedRoleCategory}
              onChange={(e) => {
                setSelectedRoleCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1 px-2.5 text-xs rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none font-medium"
            >
              {roleCategories.map((rc) => (
                <option key={rc.id} value={rc.id}>
                  {rc.label} {rc.id !== 'all' ? `(${roleCounts[rc.id] ?? 0})` : ''}
                </option>
              ))}
            </select>

            <select
              value={selectedAvailability}
              onChange={(e) => {
                setSelectedAvailability(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1 px-2.5 text-xs rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Now</option>
              <option value="busy">High Volume</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="font-mono text-xs text-slate-500">
            SHOWING <strong className="text-[#090A0F]">{filteredReferrers.length}</strong> ACTIVE SPONSORS
          </div>
        </div>
      </div>

      {/* Referrers Grid */}
      {filteredReferrers.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedReferrers.map((referrer) => (
              <ReferrerCard
                key={referrer.id}
                referrer={referrer}
                onRequestReferral={handleRequestReferral}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No verified sponsors found matching query"
          description="Try broadening your search term or clearing company filters to view all active sponsors."
          actionText="Reset All Filters"
          onAction={handleClearFilters}
        />
      )}

      {/* Request Modal */}
      <RequestReferralModal
        referrer={selectedReferrer}
        isOpen={referralModalOpen}
        onClose={() => setReferralModalOpen(false)}
      />
    </div>
  );
};
