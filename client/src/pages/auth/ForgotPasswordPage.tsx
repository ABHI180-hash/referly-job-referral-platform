import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { BriefcaseBusiness, Mail, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { addToast } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      addToast('Password reset link sent to your email!', 'success');
    }, 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <PageMeta
        title="Reset Password"
        description="Receive a secure password reset link for your Referly account."
      />
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <BriefcaseBusiness className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Referly</span>
          </Link>
          <h1 className="text-2xl sm:text-[26px] font-heading font-bold text-[#090A0F] tracking-tight">Reset your password</h1>
          <p className="text-sm font-sans text-slate-500 leading-normal">
            Enter the email associated with your account and we’ll send a secure reset link.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Reset Link Sent</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an account exists for <strong className="text-slate-900">{email}</strong>, you will receive password reset instructions shortly.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to sign in</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs rounded-lg border border-slate-200 p-2.5 pl-9 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? 'Sending link...' : 'Send Reset Instructions'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
