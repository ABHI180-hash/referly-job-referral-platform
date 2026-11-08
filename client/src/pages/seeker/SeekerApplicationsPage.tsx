import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import { Application, ApplicationStatus } from '@/types';
import { CompanyLogo } from '@/components/common/CompanyLogo';
import {
  Search,
  Filter,
  FileCheck2,
  Calendar,
  Building2,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
} from 'lucide-react';

export const SeekerApplicationsPage: React.FC = () => {
  const { applications } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const statuses: ApplicationStatus[] = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview',
    'Selected',
    'Rejected',
  ];

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesTerm =
        !term ||
        app.jobTitle.toLowerCase().includes(term) ||
        app.company.toLowerCase().includes(term);

      const matchesStatus =
        selectedStatus === 'all' || app.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesTerm && matchesStatus;
    });
  }, [applications, searchTerm, selectedStatus]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageMeta
        title="My Applications"
        description="Track the status of your direct and referred job applications on Referly."
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Application Tracking Pipeline</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track status progression across all your submitted direct and referred job applications.
          </p>
        </div>

        <Link
          to="/dashboard/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors self-start"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Apply to More Jobs</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title or company..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Application Stages</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredApps.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
              <tr>
                <th className="py-3.5 px-5">Job Opening</th>
                <th className="py-3.5 px-5">Applied Date</th>
                <th className="py-3.5 px-5">Referral Status</th>
                <th className="py-3.5 px-5">Stage</th>
                <th className="py-3.5 px-5">Last Updated</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <CompanyLogo company={app.company} logoUrl={app.companyLogo} size={36} />
                      <div>
                        <span className="font-bold text-slate-900 block">{app.jobTitle}</span>
                        <span className="text-[11px] text-slate-500">
                          {app.company} • {app.location}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-600">{app.appliedDate}</td>
                  <td className="py-3.5 px-5">
                    {app.referralStatus === 'Referred' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        Employee Referred
                      </span>
                    ) : app.referralStatus === 'Pending Referral' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                        Pending Referral
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Direct Submission</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="py-3.5 px-5 text-slate-500">{app.lastUpdated}</td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-semibold transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={FileCheck2}
          title="No applications match your filter"
          description="Try resetting your filters or search term to see other submitted applications."
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedStatus('all');
          }}
        />
      )}

      {/* Application Detail Modal */}
      {selectedApp && (
        <Modal
          isOpen={Boolean(selectedApp)}
          onClose={() => setSelectedApp(null)}
          title={selectedApp.jobTitle}
          description={`${selectedApp.company} • Applied on ${selectedApp.appliedDate}`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Current Pipeline Stage:</span>
              <StatusBadge status={selectedApp.status} />
            </div>

            {selectedApp.referrerName && (
              <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 space-y-1">
                <span className="font-semibold text-indigo-900 block">Sponsoring Referrer</span>
                <p className="text-indigo-800">{selectedApp.referrerName}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="font-semibold text-slate-900 block">Status Timeline & Notes</span>
              <p className="p-3 rounded-lg border border-slate-200 bg-white text-slate-600 leading-relaxed">
                {selectedApp.feedback || 'Your application is progressing normally through the evaluation pipeline.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Link
                to={`/jobs/${selectedApp.jobId}`}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                View Job Description
              </Link>
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-1.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
