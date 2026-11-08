import React from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { FileCheck, ShieldAlert, Award, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      <PageMeta
        title="Terms of Service"
        description="Review the rules, referral compliance standards, and user obligations governing the Referly platform."
      />

      {/* Header */}
      <div className="space-y-3 border-b border-slate-200/90 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-sans font-semibold text-slate-700 tracking-wide">
          <FileCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Platform Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#090A0F] tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm font-sans text-slate-500">
          Last updated: November 2026 · Governing all usage of the Referly platform
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 space-y-8">
        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[#090A0F]">1. Acceptance of Terms</h2>
          <p>
            By accessing or registering with Referly, you agree to be bound by these Terms of Service and all applicable federal and state labor laws. If you do not accept these terms, you may not access or use the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[#090A0F]">2. Strict Zero-Kickback Policy</h2>
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 space-y-2">
            <h4 className="font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700" /> Mandatory Referral Integrity Rules
            </h4>
            <p className="text-xs leading-relaxed text-amber-800">
              Candidates shall NEVER pay, offer gratuity, or compensate employees for providing a referral. Referrers shall NEVER solicit, accept, or demand money from candidates. All employee referral bonuses must originate exclusively from sanctioned internal employer compensation programs. Violation results in immediate, permanent account termination and legal reporting.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[#090A0F]">3. Candidate Conduct & Truthfulness</h2>
          <p>
            Candidates agree to provide authentic, verifiable employment histories, portfolios, and skills. Submitting fraudulent resumes, impersonating another individual, or spamming multiple referrers with generic scripts is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[#090A0F]">4. Referrer Obligations</h2>
          <p>
            Employees participating as referrers agree to conduct reviews in good faith and submit candidate profiles only when the candidate meets reasonable standards for the target opening. Referrers agree to comply with their respective employer’s employee referral policies and intellectual property agreements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[#090A0F]">5. Subscriptions & Billing</h2>
          <p>
            Referly Pro memberships provide enhanced platform tools, application analytics, and increased monthly referral request capacity. Subscriptions renew automatically unless cancelled before the renewal date. Cancellations take effect at the conclusion of the active billing period.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[#090A0F]">6. Limitation of Liability</h2>
          <p>
            Referly does not guarantee employment, interview invitations, or hiring decisions. Final hiring outcomes remain solely at the discretion of the prospective employer and their talent acquisition teams.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>Need clarification on our terms?</span>
        <Link to="/contact" className="text-[#2563EB] font-semibold hover:underline">
          Contact Legal Counsel →
        </Link>
      </div>
    </div>
  );
};
