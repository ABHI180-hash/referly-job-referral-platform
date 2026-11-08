import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Code2, Mail, Phone, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#090A0F] flex items-center justify-center text-white shadow-xs group-hover:bg-slate-800 transition-colors">
                <span className="font-mono text-xs font-bold text-white">R/</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-heading font-bold tracking-tight text-[#090A0F]">
                  Referly
                </span>
                <span className="text-[10px] -mt-0.5 font-sans text-slate-500">
                  Get Referred. Get Hired.
                </span>
              </div>
            </Link>
            <p className="text-xs font-sans text-slate-500 max-w-sm leading-relaxed">
              A professional job referral and career networking platform connecting talented job seekers directly with verified employees at top technology companies.
            </p>

            {/* Direct Contact Links */}
            <div className="space-y-1.5 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <a href="mailto:support@referly.io" className="hover:text-[#2563EB] transition-colors">
                  support@referly.io
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <a href="tel:+918049201940" className="hover:text-[#2563EB] transition-colors">
                  +91 (80) 4920-1940
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 text-slate-400 pt-1">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-[#090A0F] transition-colors" title="Twitter / X">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-[#090A0F] transition-colors" title="LinkedIn">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-[#090A0F] transition-colors" title="GitHub">
                <Code2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-900">Platform</h4>
            <ul className="mt-3.5 space-y-2.5 text-xs">
              <li>
                <Link to="/jobs" className="text-slate-500 hover:text-[#090A0F] transition-colors">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/referrals" className="text-slate-500 hover:text-[#090A0F] transition-colors">
                  Find Referrals
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-slate-500 hover:text-[#090A0F] transition-colors">
                  Companies Directory
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-500 hover:text-[#090A0F] transition-colors">
                  Membership & Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-900">Company</h4>
            <ul className="mt-3.5 space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="text-slate-500 hover:text-[#090A0F] transition-colors">
                  About Referly
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-500 hover:text-[#090A0F] transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-slate-500 hover:text-[#090A0F] transition-colors">
                  Careers (We're Hiring)
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-500 hover:text-[#090A0F] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-500 hover:text-[#090A0F] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-900">Trust & Security</h4>
            <ul className="mt-3.5 space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="text-slate-500 hover:text-[#090A0F] transition-colors">
                  Corporate DNS Verification
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-500 hover:text-[#090A0F] transition-colors">
                  Zero ATS Keyword Filtering
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-500 hover:text-[#090A0F] transition-colors">
                  End-to-End Referral Telemetry
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-500 hover:text-[#090A0F] transition-colors">
                  Zero Data Selling Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Referly Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-sans font-medium text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
