import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { JobCard } from '@/components/jobs/JobCard';
import { EmptyState } from '@/components/common/EmptyState';
import { RequestReferralModal } from '@/components/referrals/RequestReferralModal';
import { Bookmark, Search } from 'lucide-react';
import { Job } from '@/types';

export const SeekerSavedJobsPage: React.FC = () => {
  const { jobs, savedJobIds } = useApp();
  const [selectedJobForReferral, setSelectedJobForReferral] = useState<Job | null>(null);
  const [referralModalOpen, setReferralModalOpen] = useState(false);

  const savedJobs = jobs.filter((job) => savedJobIds.includes(job.id));

  const handleRequestReferral = (job: Job) => {
    setSelectedJobForReferral(job);
    setReferralModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageMeta
        title="Saved Jobs"
        description="View and manage the job openings you bookmarked on Referly."
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Saved Job Bookmarks</h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of open positions you are preparing referral requests for.
          </p>
        </div>

        <Link
          to="/dashboard/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors self-start"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Explore More Jobs</span>
        </Link>
      </div>

      {savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onRequestReferral={handleRequestReferral}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Browse open listings and bookmark positions you'd like to ask for referrals on."
          actionText="Discover Jobs"
          onAction={() => {
            window.location.href = '/dashboard/jobs';
          }}
        />
      )}

      <RequestReferralModal
        job={selectedJobForReferral}
        isOpen={referralModalOpen}
        onClose={() => setReferralModalOpen(false)}
      />
    </div>
  );
};
