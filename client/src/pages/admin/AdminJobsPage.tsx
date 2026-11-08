import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Job } from '@/types';
import { PageMeta } from '@/components/common/PageMeta';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import { CompanyLogo } from '@/components/common/CompanyLogo';
import { getCompanyLogo } from '@/utils/companyLogos';
import { formatSalaryDisplay } from '@/utils/cn';
import { Search, Plus, Trash2, Edit2, Building2, Eye, EyeOff, Briefcase } from 'lucide-react';

export const AdminJobsPage: React.FC = () => {
  const { jobs, addJob, deleteJob, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: 'Bengaluru, India',
    workMode: 'Hybrid' as 'Remote' | 'Hybrid' | 'On-site',
    jobType: 'Full-time' as any,
    experienceLevel: 'Senior' as any,
    experienceRange: '4 - 7 years',
    salary: '₹30L – ₹45L / yr',
    department: 'Engineering',
    description: '',
    aboutCompany: 'Verified hiring partner on Referly.',
  });

  const filteredJobs = jobs.filter((j) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      !term ||
      j.title.toLowerCase().includes(term) ||
      j.company.toLowerCase().includes(term) ||
      j.location.toLowerCase().includes(term)
    );
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company) return;

    addJob({
      ...newJob,
      companyLogo: getCompanyLogo(newJob.company),
      responsibilities: [
        'Lead key technical initiatives in distributed infrastructure.',
        'Champion developer velocity and testing standards.',
      ],
      skills: ['TypeScript', 'React', 'Node.js', 'System Design'],
      benefits: ['Competitive compensation', 'Comprehensive healthcare'],
      openPositions: 3,
      featured: true,
    });

    setAddModalOpen(false);
    setNewJob({
      title: '',
      company: '',
      location: 'Bengaluru, India',
      workMode: 'Hybrid',
      jobType: 'Full-time',
      experienceLevel: 'Senior',
      experienceRange: '4 - 7 years',
      salary: '₹30L – ₹45L / yr',
      department: 'Engineering',
      description: '',
      aboutCompany: 'Verified hiring partner on Referly.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageMeta
        title="Admin Job Management"
        description="Audit, publish, and govern verified job openings across all partner employers on Referly."
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Job Requisition Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise open roles, configure referral limits, and audit published opportunities.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Job Opening</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-card flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs by title, company, or location..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
          />
        </div>
        <span className="text-xs text-slate-500">
          Total listings: <strong className="text-slate-900">{jobs.length}</strong>
        </span>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
              <tr>
                <th className="py-3.5 px-5">Job Title & Company</th>
                <th className="py-3.5 px-5">Location</th>
                <th className="py-3.5 px-5">Experience</th>
                <th className="py-3.5 px-5">Compensation</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <CompanyLogo company={job.company} logoUrl={job.companyLogo} size={32} />
                      <div>
                        <span className="font-bold text-slate-900 block">{job.title}</span>
                        <span className="text-[11px] text-slate-500">{job.company}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-600">
                    {job.location} ({job.workMode})
                  </td>
                  <td className="py-3.5 px-5 text-slate-600">{job.experienceRange}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">{formatSalaryDisplay(job.salary, job.minSalary, job.maxSalary)}</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Published
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Try modifying your search criteria or add a new job opening."
        />
      )}

      {/* Add Job Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Create New Job Requisition"
        description="Add a verified opening to the Referly directory."
      >
        <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              required
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              placeholder="e.g. Lead SRE Engineer"
              className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
              <input
                type="text"
                required
                value={newJob.company}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                placeholder="e.g. Figma"
                className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Range</label>
            <input
              type="text"
              value={newJob.salary}
              onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              required
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              placeholder="Role duties and responsibilities..."
              className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-800 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Publish Job
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
