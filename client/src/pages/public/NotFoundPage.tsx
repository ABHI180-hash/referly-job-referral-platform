import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageMeta } from '@/components/common/PageMeta';
import { ArrowLeft, Home, Search, Users, LifeBuoy, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <PageMeta
        title="Page Not Found (404)"
        description="The page you requested could not be located on Referly."
      />

      <div className="max-w-xl w-full text-center space-y-6">
        {/* 404 Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-sans font-semibold text-slate-700 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>Error 404 · Page Not Found</span>
        </div>

        {/* Big Code */}
        <div className="relative">
          <span className="text-8xl sm:text-9xl font-heading font-black text-slate-100 select-none block">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-[#090A0F] tracking-tight">
              We couldn't find that page
            </h1>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base font-sans text-slate-600 max-w-md mx-auto leading-relaxed">
          The link you followed may be broken, the address might be mistyped, or the page may have been moved to a new destination.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#090A0F] hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Explore Jobs</span>
          </Link>
        </div>

        {/* Helpful Destinations Box */}
        <div className="pt-8 border-t border-slate-200/80 mt-8">
          <span className="text-xs font-sans font-semibold text-slate-400 uppercase tracking-wider block mb-4">
            Popular Destinations
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
            <Link
              to="/referrals"
              className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 transition-colors flex items-center gap-2 text-xs font-semibold text-slate-800 shadow-2xs"
            >
              <Users className="w-4 h-4 text-[#2563EB]" />
              <span>Find Referrers</span>
            </Link>
            <Link
              to="/companies"
              className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 transition-colors flex items-center gap-2 text-xs font-semibold text-slate-800 shadow-2xs"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Top Companies</span>
            </Link>
            <Link
              to="/contact"
              className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 transition-colors flex items-center gap-2 text-xs font-semibold text-slate-800 shadow-2xs col-span-2 sm:col-span-1"
            >
              <LifeBuoy className="w-4 h-4 text-amber-500" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
