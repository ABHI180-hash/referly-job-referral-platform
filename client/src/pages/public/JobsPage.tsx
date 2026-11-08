import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { JobCard } from '@/components/jobs/JobCard';
import { Pagination } from '@/components/common/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { RequestReferralModal } from '@/components/referrals/RequestReferralModal';
import { PageMeta } from '@/components/common/PageMeta';
import { Job } from '@/types';
import {
  Search,
  MapPin,
  X,
  Briefcase,
  SlidersHorizontal,
  Flame,
} from 'lucide-react';

export const JobsPage: React.FC = () => {
  const { jobs } = useApp();
  const [searchParams] = useSearchParams();

  // Role categories definition
  const roleCategories = useMemo(
    () => [
      { id: 'all', label: 'All Roles' },
      { id: 'Frontend', label: 'Frontend' },
      { id: 'Backend', label: 'Backend' },
      { id: 'Full Stack', label: 'Full Stack' },
      { id: 'AI / ML', label: 'AI & Machine Learning' },
      { id: 'DevOps & Cloud', label: 'DevOps & Cloud' },
      { id: 'Product Management', label: 'Product Management' },
      { id: 'UI/UX Design', label: 'UI/UX Design' },
      { id: 'Mobile', label: 'Mobile (iOS & Android)' },
      { id: 'Data Engineering', label: 'Data Engineering' },
      { id: 'Cybersecurity', label: 'Cybersecurity' },
    ],
    []
  );

  // Search & filter states
  const initialCompany = searchParams.get('company') || '';
  const initialRole = searchParams.get('role') || 'all';
  const [searchTerm, setSearchTerm] = useState(initialCompany);
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<string>(initialRole);
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [selectedJobType, setSelectedJobType] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'salary'>('latest');

  // Role counts
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: jobs.length };
    jobs.forEach((job) => {
      if (job.roleCategory) {
        counts[job.roleCategory] = (counts[job.roleCategory] || 0) + 1;
      }
    });
    return counts;
  }, [jobs]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Referral modal state
  const [selectedJobForReferral, setSelectedJobForReferral] = useState<Job | null>(null);
  const [referralModalOpen, setReferralModalOpen] = useState(false);

  // Filter logic
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const term = searchTerm.toLowerCase().trim();
        const matchesTerm =
          !term ||
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          (job.roleCategory && job.roleCategory.toLowerCase().includes(term)) ||
          job.department.toLowerCase().includes(term) ||
          (Array.isArray(job.skills) && job.skills.some((s) => s.toLowerCase().includes(term)));

        const matchesRole =
          selectedRoleCategory === 'all' ||
          (job.roleCategory && job.roleCategory.toLowerCase() === selectedRoleCategory.toLowerCase()) ||
          job.department.toLowerCase().includes(selectedRoleCategory.toLowerCase()) ||
          job.title.toLowerCase().includes(selectedRoleCategory.toLowerCase());

        const loc = locationSearch.toLowerCase().trim();
        const matchesLocation = !loc || job.location.toLowerCase().includes(loc);

        const matchesWorkMode =
          selectedWorkMode === 'all' || job.workMode.toLowerCase() === selectedWorkMode.toLowerCase();

        const matchesJobType =
          selectedJobType === 'all' || job.jobType.toLowerCase() === selectedJobType.toLowerCase();

        const matchesExperience =
          selectedExperience === 'all' ||
          job.experienceLevel.toLowerCase() === selectedExperience.toLowerCase();

        return (
          matchesTerm &&
          matchesRole &&
          matchesLocation &&
          matchesWorkMode &&
          matchesJobType &&
          matchesExperience
        );
      })
      .sort((a, b) => {
        if (sortBy === 'salary') {
          return (b.maxSalary || 0) - (a.maxSalary || 0);
        }
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      });
  }, [
    jobs,
    searchTerm,
    selectedRoleCategory,
    locationSearch,
    selectedWorkMode,
    selectedJobType,
    selectedExperience,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRoleCategory('all');
    setLocationSearch('');
    setSelectedWorkMode('all');
    setSelectedJobType('all');
    setSelectedExperience('all');
    setSortBy('latest');
    setCurrentPage(1);
  };

  const handleRequestReferral = (job: Job) => {
    setSelectedJobForReferral(job);
    setReferralModalOpen(true);
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedRoleCategory !== 'all' ||
    Boolean(locationSearch) ||
    selectedWorkMode !== 'all' ||
    selectedJobType !== 'all' ||
    selectedExperience !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      <PageMeta
        title="Verified Engineering & Product Jobs"
        description="Discover active engineering, design, and product management openings with employee referral sponsors."
      />
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/80">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-sans font-medium text-slate-600 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            <span>Opportunities Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-heading font-bold text-[#090A0F] tracking-tight leading-[1.25]">
            Verified Engineering & Product Roles
          </h1>
          <p className="mt-3.5 text-sm sm:text-base font-sans font-normal text-slate-600 max-w-2xl leading-relaxed text-pretty">
            Discover roles with active employee referral opportunities across engineering, design, and product teams.
          </p>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-sans font-medium text-slate-600 self-start md:self-auto bg-white px-3.5 py-2 rounded-lg border border-slate-200/90 shadow-2xs">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Roles Updated Daily</span>
        </div>
      </div>

      {/* Quick Role Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="font-sans text-xs font-medium text-slate-500 pr-1 shrink-0">Role Category:</span>
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

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-card space-y-4">
        {/* Main Search Inputs */}
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
              placeholder="Search by job title, company, or stack (e.g. Stripe, Rust, React)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] text-slate-900 placeholder:text-slate-400 font-sans"
            />
          </div>

          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={locationSearch}
              onChange={(e) => {
                setLocationSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Location (e.g. San Francisco, Remote)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] text-slate-900 placeholder:text-slate-400 font-sans"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'salary')}
              className="w-full py-2.5 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
            >
              <option value="latest">Sort: Latest Published</option>
              <option value="salary">Sort: Highest Compensation</option>
            </select>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-sans text-xs font-medium text-slate-500">Filters:</span>
            </div>

            {/* Role Filter Dropdown */}
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

            {/* Work Mode */}
            <select
              value={selectedWorkMode}
              onChange={(e) => {
                setSelectedWorkMode(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1 px-2.5 text-xs rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <option value="all">All Work Modes</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>

            {/* Job Type */}
            <select
              value={selectedJobType}
              onChange={(e) => {
                setSelectedJobType(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1 px-2.5 text-xs rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <option value="all">All Job Types</option>
              <option value="full-time">Full-time</option>
              <option value="contract">Contract</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
            </select>

            {/* Experience Level */}
            <select
              value={selectedExperience}
              onChange={(e) => {
                setSelectedExperience(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1 px-2.5 text-xs rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <option value="all">All Experience Levels</option>
              <option value="entry-level">Entry-level (1-3y)</option>
              <option value="mid-level">Mid-level (3-5y)</option>
              <option value="senior">Senior (5-8y)</option>
              <option value="lead / staff">Lead / Staff (8y+)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          <div className="font-mono text-xs text-slate-500">
            SHOWING <strong className="text-[#090A0F]">{filteredJobs.length}</strong> VERIFIED ROLES
          </div>
        </div>
      </div>

      {/* Jobs Grid / List */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onRequestReferral={handleRequestReferral}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No open jobs match your criteria"
          description="Try broadening your search term, adjusting work mode options, or resetting your active filters."
          actionText="Reset All Filters"
          onAction={handleClearFilters}
        />
      )}

      {/* Referral Modal */}
      <RequestReferralModal
        job={selectedJobForReferral}
        isOpen={referralModalOpen}
        onClose={() => setReferralModalOpen(false)}
      />
    </div>
  );
};
