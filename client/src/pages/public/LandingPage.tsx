import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { JobCard } from '@/components/jobs/JobCard';
import { CompanyCard } from '@/components/jobs/CompanyCard';
import { RequestReferralModal } from '@/components/referrals/RequestReferralModal';
import { Job, ReferrerProfile } from '@/types';
import { PageMeta } from '@/components/common/PageMeta';
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Briefcase,
  ShieldCheck,
  Zap,
  Clock,
  Send,
  Users,
  Compass,
  FileCheck,
  Award,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { jobs, companies, referrers } = useApp();
  const [selectedJobForReferral, setSelectedJobForReferral] = useState<Job | null>(null);
  const [selectedReferrerForModal, setSelectedReferrerForModal] = useState<ReferrerProfile | null>(null);
  const [referralModalOpen, setReferralModalOpen] = useState(false);

  // Interactive Hero Sponsor Console State
  const [activeHeroTab, setActiveHeroTab] = useState<number>(0);

  // Featured referral mentors on the hero preview (Sarah Mitchell, Ethan Parker, Olivia Bennett)
  const heroSponsors = [
    {
      name: 'Sarah Mitchell',
      role: 'Senior Product Designer',
      company: 'Figma',
      avatar:
        'https://images.openai.com/static-rsc-4/wcZQrGOHLRSZgfrY-OeL9LO4FjHdwwHG2RiiD_RfHK6ac7W75Dk7o2jtF_OypMx__EWQfyU0cXslOXysxxsfYcagw7KjkIbgnKNjNCHvnJgKNWDI99RhgP3CaRiQ80twTJoExYsheVnJKkK9wr1-4PaXyXD6BVL7JKvKzKu0-EE?purpose=inline',
      experience: '8 years exp',
      location: 'San Francisco, CA',
      targetJob: 'Senior Product Designer (Design Systems)',
      bio: 'Passionate about bridging designers and developers. Happy to review portfolios and refer talented product designers.',
      skills: ['Design Systems', 'Figma', 'User Research'],
      status: 'Open to Refer',
    },
    {
      name: 'Ethan Parker',
      role: 'Senior Frontend Engineer',
      company: 'Vercel',
      avatar:
        'https://images.openai.com/static-rsc-4/UQCDet-eM0wWVSuvKNC0QVYveM_rIWGcuWrF0afgLIRf9uEBSgkCiVhY1sdF_1gyfetpN-LAU51_rOS83NBKJUhzRJz0-Op9rLeTofDU9WIGm_Cg6l-vNgJxMGv_uDgD6icYwsAUDxMz8zEB5oVkadfW7z06ierDIvTvvfB5efc?purpose=inline',
      experience: '10 years exp',
      location: 'Remote',
      targetJob: 'Senior Frontend Engineer (Cloud Platform)',
      bio: 'Leading frontend engineering teams. Actively looking to refer talented frontend, full-stack, and developer candidates.',
      skills: ['TypeScript', 'Next.js', 'React'],
      status: 'Open to Refer',
    },
    {
      name: 'Olivia Bennett',
      role: 'Principal Software Engineer',
      company: 'Linear',
      avatar:
        'https://images.openai.com/static-rsc-4/LrjTbrOtWAKF0CbMMwIXwRsa0kxQXA8_QB_Bd9gn0faOtatUB79V8BMh_BYCp4HwnAUODKXPDL6ssls67FJO_bLoHsKKBzJwLchz4wgPZQwQfZOaZVFYmeKXKnHYNBB9e4gHLSDOl391mK9i48KcOQl7BOi4yXAvttVxjGp6Ht4?purpose=inline',
      experience: '7 years exp',
      location: 'San Francisco, CA',
      targetJob: 'Principal Software Engineer (Core Systems)',
      bio: 'Obsessed with software craftsmanship, keyboard shortcuts, and snappy UI. Happy to review portfolios and refer promising engineers.',
      skills: ['React', 'TypeScript', 'System Design'],
      status: 'Open to Refer',
    },
  ];

  const currentSponsor = heroSponsors[activeHeroTab];

  const featuredJobs = jobs.filter((j) => j.featured).slice(0, 4);
  const topCompanies = companies.slice(0, 4);

  const handleRequestReferral = (job: Job) => {
    setSelectedJobForReferral(job);
    setSelectedReferrerForModal(null);
    setReferralModalOpen(true);
  };

  const handleSponsorDirectReferral = (sponsorName: string) => {
    const matchingRef = referrers.find((r) => r.name.toLowerCase().includes(sponsorName.toLowerCase()));
    const matchingJob = jobs.find((j) => j.company.toLowerCase() === currentSponsor.company.toLowerCase()) || jobs[0];

    setSelectedReferrerForModal(matchingRef || referrers[0]);
    setSelectedJobForReferral(matchingJob);
    setReferralModalOpen(true);
  };

  return (
    <div className="space-y-24 lg:space-y-32 pb-20">
      <PageMeta
        title="Referly — Get Referred. Get Hired."
        description="Connect directly with verified employees at leading companies, discover hidden jobs, and get meaningful internal referrals."
      />
      {/* 1. HERO SECTION: CLEAN, PROFESSIONAL SAAS HERO */}
      <section className="relative pt-12 lg:pt-18 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* Left Column: Typographic & CTA Hierarchy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] sm:text-xs font-sans font-medium text-slate-600 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              <span>YOUR CAREER. YOUR CONNECTIONS. YOUR NEXT OPPORTUNITY.</span>
            </div>

            {/* Main Heading: Inter font-bold, tight line-height and exact purple from reference */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[50px] xl:text-[54px] font-bold text-[#090A0F] leading-[1.12] sm:leading-[1.14] tracking-[-0.035em] max-w-3xl"
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
            >
              Find better career{' '}
              <br className="hidden sm:inline" />
              opportunities through{' '}
              <br className="hidden sm:inline" />
              <span className="text-[#6E56CF]">the right connections.</span>
            </h1>

            {/* Description: Inter, weight 400 with comfortable line-height */}
            <p className="text-base sm:text-lg font-sans font-normal text-slate-600 max-w-2xl leading-[1.65] text-pretty">
              Connect with professionals at leading companies, discover hidden job opportunities, and get meaningful referrals from people who understand your industry.
            </p>

            {/* Action Buttons: Inter, weight 500-600 */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-sans font-semibold text-white bg-[#090A0F] hover:bg-slate-800 shadow-xs transition-all btn-tactile"
              >
                <span>Explore Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-sans font-semibold text-slate-700 hover:text-[#090A0F] bg-white border border-slate-200/90 hover:bg-slate-50 transition-colors shadow-xs btn-tactile"
              >
                <span>Join Referly</span>
              </Link>
            </div>

            {/* Authentic Platform Value Indicators */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-sans text-slate-500 font-normal">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Verified Company Profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Direct Professional Introductions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Transparent Application Tracking</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Referral Preview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
              {/* Tab Selector Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-sans text-xs font-medium text-slate-500">
                  Featured Referrers
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active on Referly
                </span>
              </div>

              {/* Sponsor Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-lg">
                {heroSponsors.map((sponsor, idx) => (
                  <button
                    key={sponsor.company}
                    onClick={() => setActiveHeroTab(idx)}
                    className={`py-1.5 text-xs font-sans font-medium rounded-md transition-all ${
                      activeHeroTab === idx
                        ? 'bg-white text-[#090A0F] shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-[#090A0F]'
                    }`}
                  >
                    {sponsor.company}
                  </button>
                ))}
              </div>

              {/* Active Profile & Bio Preview */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentSponsor.avatar}
                      alt={`${currentSponsor.name} - ${currentSponsor.role} at ${currentSponsor.company}`}
                      className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-900/10 shadow-xs flex-shrink-0"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <h4 className="text-sm font-heading font-semibold text-[#090A0F] flex items-center gap-1">
                        {currentSponsor.name}
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                      </h4>
                      <p className="text-xs font-sans text-slate-500">
                        {currentSponsor.role} at{' '}
                        <strong className="text-slate-800 font-medium">{currentSponsor.company}</strong>
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-white text-slate-600 border border-slate-200/80 shadow-2xs">
                    {currentSponsor.experience}
                  </span>
                </div>

                {/* Candidate Endorsement Note / Bio */}
                <div className="p-3 rounded-lg bg-white border border-slate-200/70 text-xs font-sans text-slate-600 leading-relaxed">
                  "{currentSponsor.bio}"
                </div>

                {/* Skills Preview */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-sans font-medium text-slate-500 block">
                    Specializations & Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSponsor.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded text-[11px] font-sans font-medium bg-slate-200/60 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Location & Open Status */}
                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs font-sans text-slate-500">
                  <span>Location: {currentSponsor.location}</span>
                  <span className="font-medium text-emerald-600">{currentSponsor.status}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSponsorDirectReferral(currentSponsor.name)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-sans font-semibold text-white bg-[#090A0F] hover:bg-slate-800 transition-colors btn-tactile shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Referral from {currentSponsor.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE ADVANTAGE: TRADITIONAL FUNNEL VS REFERRAL CONNECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3.5 rounded-full bg-blue-50/90 border border-blue-200/70 text-xs font-sans font-semibold text-[#2563EB] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            <span>The Referral Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-heading font-bold text-[#090A0F] leading-[1.25] tracking-tight text-balance">
            Why cold applications get lost — and referrals succeed.
          </h2>
          <p className="mt-3.5 text-base sm:text-lg font-sans font-normal text-slate-600 leading-[1.65] text-pretty">
            Hiring teams prioritize employee referrals over anonymous resumes. Here is how Referly connects you directly with the team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column A: Conventional Cold Funnel */}
          <div className="rounded-2xl border border-rose-200/60 bg-rose-50/20 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-100/70 text-xs font-sans font-semibold text-rose-700 tracking-wide">
                01 · Traditional Cold Inbound
              </span>
              <span className="text-xs font-sans text-rose-700 bg-rose-100/50 px-2.5 py-0.5 rounded font-medium">
                High Filtering Rate
              </span>
            </div>

            <h3 className="text-xl font-heading font-semibold text-[#090A0F]">
              The Automated Keyword Filter
            </h3>

            <div className="space-y-4 text-sm font-sans text-slate-600 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-white border border-rose-100 space-y-1">
                <span className="font-semibold text-slate-800 block">Automated Parsing Gates</span>
                <p>Resumes are filtered by keyword parsers. Minor phrasing differences can lead to silent drop-offs before a hiring manager reviews your portfolio.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-rose-100 space-y-1">
                <span className="font-semibold text-slate-800 block">Crowded Inbound Queues</span>
                <p>Popular listings receive hundreds of applications, making it difficult for talented candidates to stand out in the inbox.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-rose-100 space-y-1">
                <span className="font-semibold text-slate-800 block">No Application Feedback</span>
                <p>Candidates often experience weeks of silence without knowing if their materials were reviewed or evaluated.</p>
              </div>
            </div>
          </div>

          {/* Column B: Referral Connection Path */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-8 space-y-6 shadow-card">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200/60 text-xs font-sans font-semibold text-[#2563EB] tracking-wide">
                02 · The Direct Referral Route
              </span>
              <span className="text-xs font-sans text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200/60 font-medium">
                Direct Evaluation
              </span>
            </div>

            <h3 className="text-xl font-heading font-semibold text-[#090A0F]">
              Direct Internal Sponsoring
            </h3>

            <div className="space-y-4 text-sm font-sans text-slate-600 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="font-semibold text-slate-900 block">Personal Profile Review</span>
                <p>Your profile and portfolio are reviewed by an employee working in the domain who can highlight your relevant strengths.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="font-semibold text-slate-900 block">Internal Portal Submission</span>
                <p>Approved referrals enter the internal employee submission portal directly, ensuring review by the talent acquisition team.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="font-semibold text-slate-900 block">Clear Progress Tracking</span>
                <p>Track your referral request and receive real-time status updates as your candidate dossier moves through the pipeline.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED OPPORTUNITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-blue-50/90 border border-blue-200/60 text-xs font-sans font-semibold text-[#2563EB] tracking-wide">
              <span>Featured Roles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-heading font-bold text-[#090A0F] tracking-tight leading-[1.25]">
              Featured Opportunities With Active Referrers
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#090A0F] hover:text-[#2563EB] transition-colors self-start sm:self-auto"
          >
            <span>View All Openings ({jobs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onRequestReferral={handleRequestReferral}
            />
          ))}
        </div>
      </section>

      {/* 4. FEATURED EMPLOYERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-blue-50/90 border border-blue-200/60 text-xs font-sans font-semibold text-[#2563EB] tracking-wide">
              <span>Employer Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-heading font-bold text-[#090A0F] tracking-tight leading-[1.25]">
              Companies Actively Hiring Through Referrals
            </h2>
          </div>
          <Link
            to="/companies"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#090A0F] hover:text-[#2563EB] transition-colors self-start sm:self-auto"
          >
            <span>Explore All Companies ({companies.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>

      {/* 5. PLATFORM VALUE METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-blue-50/90 border border-blue-200/60 text-xs font-sans font-semibold text-[#2563EB] tracking-wide">
                <span>Platform Standards</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-[28px] font-heading font-bold text-[#090A0F] tracking-tight">
                Referral Network Operating Standards
              </h3>
            </div>
            <div className="font-sans text-xs text-slate-500 font-medium">
              Active Referly Network Standards
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="font-sans text-xs text-slate-500 uppercase block font-medium">
                Fast Turnaround
              </span>
              <span className="text-2xl font-bold text-[#090A0F] font-heading mt-1 block">
                &lt; 24 Hours
              </span>
              <span className="text-xs font-sans text-slate-500 mt-1 block">
                Typical response from referrers
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="font-sans text-xs text-slate-500 uppercase block font-medium">
                Direct Evaluation
              </span>
              <span className="text-2xl font-bold text-[#090A0F] font-heading mt-1 block">
                Human Review
              </span>
              <span className="text-xs font-sans text-slate-500 mt-1 block">
                Evaluated by domain specialists
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="font-sans text-xs text-slate-500 uppercase block font-medium">
                Contextual Insights
              </span>
              <span className="text-2xl font-bold text-[#090A0F] font-heading mt-1 block">
                Role Context
              </span>
              <span className="text-xs font-sans text-slate-500 mt-1 block">
                Insights before official submission
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="font-sans text-xs text-slate-500 uppercase block font-medium">
                Verified Members
              </span>
              <span className="text-2xl font-bold text-[#2563EB] font-heading mt-1 block">
                100%
              </span>
              <span className="text-xs font-sans text-slate-500 mt-1 block">
                Corporate email verified members
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED REFERRAL EXPERIENCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-blue-50/90 border border-blue-200/60 text-xs font-sans font-semibold text-[#2563EB] tracking-wide">
            <span>Community Experiences</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-heading font-bold text-[#090A0F] tracking-tight leading-[1.25]">
            Real Stories From Meaningful Connections
          </h2>
          <p className="mt-3.5 text-base font-sans text-slate-600 leading-relaxed text-pretty">
            Real outcomes from direct connections and employee referrals on Referly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brief 1 */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-sans">
              <span className="text-slate-500 font-medium">Outcome: Interview Scheduled</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">Verified Connection</span>
            </div>
            <p className="text-sm font-sans text-slate-600 leading-relaxed">
              "Applying cold through external portals felt like a black box. Connecting with an engineer at Stripe via Referly led directly to an internal submission and recruiter call within the same week."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
                alt="Arjun Mehta - Senior Frontend Engineer"
                className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-900/10"
                loading="lazy"
                decoding="async"
              />
              <div className="text-xs font-sans">
                <span className="font-semibold text-slate-900 block font-heading">Arjun Mehta</span>
                <span className="text-slate-500 text-[11px]">Senior Frontend Engineer · Referred to Stripe</span>
              </div>
            </div>
          </div>

          {/* Brief 2 */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-sans">
              <span className="text-slate-500 font-medium">Role: Verified Referrer</span>
              <span className="text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-medium">Active Member</span>
            </div>
            <p className="text-sm font-sans text-slate-600 leading-relaxed">
              "Candidates arrive with well-structured profiles, GitHub repositories, and clear skill breakdowns. I can evaluate quality in minutes and submit qualified applicants to our internal portal."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.openai.com/static-rsc-4/wcZQrGOHLRSZgfrY-OeL9LO4FjHdwwHG2RiiD_RfHK6ac7W75Dk7o2jtF_OypMx__EWQfyU0cXslOXysxxsfYcagw7KjkIbgnKNjNCHvnJgKNWDI99RhgP3CaRiQ80twTJoExYsheVnJKkK9wr1-4PaXyXD6BVL7JKvKzKu0-EE?purpose=inline"
                alt="Sarah Mitchell - Senior Product Designer at Figma"
                className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-900/10"
                loading="lazy"
                decoding="async"
              />
              <div className="text-xs font-sans">
                <span className="font-semibold text-slate-900 block font-heading">Sarah Mitchell</span>
                <span className="text-slate-500 text-[11px]">Senior Product Designer · Figma</span>
              </div>
            </div>
          </div>

          {/* Brief 3 */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-sans">
              <span className="text-slate-500 font-medium">Outcome: Direct Referral</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">Verified Connection</span>
            </div>
            <p className="text-sm font-sans text-slate-600 leading-relaxed">
              "Having direct status visibility gives you confidence throughout your search. You never have to wonder whether your profile reached a hiring team or vanished into an inbox."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.openai.com/static-rsc-4/LrjTbrOtWAKF0CbMMwIXwRsa0kxQXA8_QB_Bd9gn0faOtatUB79V8BMh_BYCp4HwnAUODKXPDL6ssls67FJO_bLoHsKKBzJwLchz4wgPZQwQfZOaZVFYmeKXKnHYNBB9e4gHLSDOl391mK9i48KcOQl7BOi4yXAvttVxjGp6Ht4?purpose=inline"
                alt="Olivia Bennett - Principal Software Engineer at Linear"
                className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-900/10"
                loading="lazy"
                decoding="async"
              />
              <div className="text-xs font-sans">
                <span className="font-semibold text-slate-900 block font-heading">Olivia Bennett</span>
                <span className="text-slate-500 text-[11px]">Principal Software Engineer · Linear</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#090A0F] text-white p-8 sm:p-14 border border-slate-800 space-y-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3.5 rounded-full bg-white/10 border border-white/15 text-xs font-sans font-medium text-blue-300 tracking-wide">
              <span>Start Your Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-heading font-bold tracking-tight text-white leading-[1.25] text-balance">
              Accelerate your career search with the right connection.
            </h2>
            <p className="mt-3.5 text-base sm:text-lg font-sans text-slate-300 leading-[1.65] text-pretty">
              Join job seekers and industry professionals discovering opportunities and building career relationships through Referly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-sans font-semibold text-[#090A0F] bg-white hover:bg-slate-100 transition-colors btn-tactile shadow-sm"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/referrals"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-sans font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 hover:bg-slate-800 transition-colors btn-tactile"
            >
              <span>Find Referrers</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Referral Modal */}
      <RequestReferralModal
        job={selectedJobForReferral}
        referrer={selectedReferrerForModal}
        isOpen={referralModalOpen}
        onClose={() => {
          setReferralModalOpen(false);
          setSelectedJobForReferral(null);
          setSelectedReferrerForModal(null);
        }}
      />
    </div>
  );
};
