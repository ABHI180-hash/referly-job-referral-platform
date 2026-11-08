import React from 'react';
import { PageMeta } from '@/components/common/PageMeta';
import { ShieldCheck, Lock, EyeOff, Server, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      <PageMeta
        title="Privacy Policy"
        description="Learn how Referly protects candidate and referrer information with strict corporate privacy standards."
      />

      {/* Header */}
      <div className="space-y-3 border-b border-slate-200/90 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-sans font-semibold text-slate-700 tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Trust & Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#090A0F] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm font-sans text-slate-500">
          Last revised: November 2026 · Effective immediately for all users
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 space-y-8">
        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[#090A0F]">1. Introduction & Core Privacy Commitment</h2>
          <p>
            At Referly, we believe personal career information and corporate employee identities deserve uncompromising confidentiality. We never sell, monetize, or harvest user dossiers, resumes, or communications for advertising or third-party marketing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[#090A0F]">2. Information We Collect</h2>
          <p>
            We collect only the essential information necessary to facilitate direct employee referrals and verify legitimate employment:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Candidate Profiles:</strong> Name, contact email, resume text, portfolio links, GitHub/LinkedIn URLs, and relevant skills.</li>
            <li><strong>Referrer Information:</strong> Professional name, corporate email address (used strictly for domain DNS verification), verified employer, role seniority, and referral capacity.</li>
            <li><strong>Communication Data:</strong> In-app messages, referral request notes, and submission status telemetry.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[#090A0F]">3. Corporate Privacy Protection for Referrers</h2>
          <p>
            We protect verified employee referrers from spam, harassment, and unsolicited inbox bombardment. Your personal work email address is never exposed publicly to candidates. All communications occur via Referly’s secure in-app messaging layer until you choose to submit an internal application.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[#090A0F]">4. Candidate Dossier Visibility</h2>
          <p>
            Candidate profiles and resumes are only visible to referrers when an active referral request is submitted or when the candidate explicitly sets their profile discovery status to "Open to Referrals."
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[#090A0F]">5. Data Security & Encryption</h2>
          <p>
            All network traffic is encrypted in transit using TLS 1.3. User passwords are cryptographic one-way hashes generated with bcrypt, and all database backups are encrypted at rest with AES-256 standards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[#090A0F]">6. User Rights & Data Deletion</h2>
          <p>
            You retain absolute ownership of your data. You may export your complete candidate history or request permanent, irrevocable account deletion at any time via Account Settings or by emailing{' '}
            <a href="mailto:privacy@referly.io" className="text-[#2563EB] hover:underline font-semibold">
              privacy@referly.io
            </a>.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>Questions regarding our privacy practices?</span>
        <Link to="/contact" className="text-[#2563EB] font-semibold hover:underline">
          Contact Privacy Team →
        </Link>
      </div>
    </div>
  );
};
