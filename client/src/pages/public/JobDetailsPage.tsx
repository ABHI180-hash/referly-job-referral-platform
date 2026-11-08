import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { JobCard } from '@/components/jobs/JobCard';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import { RequestReferralModal } from '@/components/referrals/RequestReferralModal';
import { formatSalaryDisplay } from '@/utils/cn';
import { PageMeta } from '@/components/common/PageMeta';
import { CompanyLogo } from '@/components/common/CompanyLogo';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Clock,
  Send,
  Bookmark,
  Share2,
  CheckCircle2,
  Users,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, isJobSaved, toggleSaveJob, addToast } = useApp();

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [referralModalOpen, setReferralModalOpen] = useState(false);

  const job = jobs.find((j) => j.id === id) || jobs[0];
  const saved = job ? isJobSaved(job.id) : false;

  // Similar jobs
  const similarJobs = jobs.filter((j) => j.id !== job?.id).slice(0, 2);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Job link copied to clipboard!', 'info');
  };

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Job Not Found</h2>
        <p className="text-sm text-slate-500">The requested job listing could not be located.</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      <PageMeta
        title={`${job.title} at ${job.company}`}
        description={`Explore requirements and request an internal employee referral for ${job.title} at ${job.company}.`}
      />
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </button>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <CompanyLogo company={job.company} logoUrl={job.companyLogo} size={64} className="rounded-xl" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">{job.company}</span>
                {job.featured && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Featured Opening
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-heading font-bold text-[#090A0F] tracking-tight leading-tight mt-1">
                {job.title}
              </h1>

              {/* Meta tags */}
              <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.location} ({job.workMode})
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {job.jobType}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {job.experienceRange}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 sm:min-w-[180px]">
            <button
              onClick={() => setReferralModalOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Request Referral</span>
            </button>

            <button
              onClick={() => setApplyModalOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span>Apply Directly</span>
            </button>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => toggleSaveJob(job.id)}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  saved
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-indigo-600' : ''}`} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Compensation
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {formatSalaryDisplay(job.salary, job.minSalary, job.maxSalary)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Department
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{job.department}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Seniority
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {job.experienceLevel}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Referral Endorsements
            </span>
            <span className="text-sm font-bold text-indigo-600 mt-0.5 block">
              {job.referrerCount || 8} Active Employees
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Job Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Overview / Description */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-lg font-bold text-slate-900">About the Role</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {job.description}
            </p>
          </section>

          {/* Key Responsibilities */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Key Responsibilities</h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Required Skills & Technologies */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Required Skills & Tooling</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Perks & Benefits */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Benefits & Perks</h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              {job.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right 4 Cols: Company Card & Similar Jobs */}
        <div className="lg:col-span-4 space-y-6">
          {/* About Company */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900">About {job.company}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{job.aboutCompany}</p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Verified Employer</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          {/* Referral Tip */}
          <div className="bg-indigo-50/70 rounded-2xl border border-indigo-100 p-6 space-y-3">
            <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              Maximize Your Chances
            </h3>
            <p className="text-xs text-indigo-800/80 leading-relaxed">
              Applications accompanied by an internal employee referral are prioritized by recruiting managers within 48 hours.
            </p>
            <button
              onClick={() => setReferralModalOpen(true)}
              className="w-full mt-2 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              Ask an Employee to Refer You
            </button>
          </div>
        </div>
      </div>

      {/* Similar Jobs Section */}
      <div className="pt-8 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Similar Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {similarJobs.map((simJob) => (
            <JobCard
              key={simJob.id}
              job={simJob}
              onRequestReferral={() => {
                setReferralModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <ApplyModal
        job={job}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />

      <RequestReferralModal
        job={job}
        isOpen={referralModalOpen}
        onClose={() => setReferralModalOpen(false)}
      />
    </div>
  );
};
