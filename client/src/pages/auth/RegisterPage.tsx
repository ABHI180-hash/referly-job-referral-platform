import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { BriefcaseBusiness, UserCheck, Briefcase, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { login, switchRole, addToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRoleParam = searchParams.get('role');
  const [accountType, setAccountType] = useState<'seeker' | 'referrer'>(
    initialRoleParam === 'referrer' ? 'referrer' : 'seeker'
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    if (!formData.agreeTerms) {
      addToast('Please accept the Terms of Service to continue.', 'error');
      return;
    }

    // Initialize mock session
    login(formData.email, accountType);
    addToast(`Account created successfully as a ${accountType === 'seeker' ? 'Job Seeker' : 'Verified Referrer'}!`, 'success');

    if (accountType === 'seeker') {
      navigate('/dashboard');
    } else {
      navigate('/referrer-dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <PageMeta
        title="Create an Account"
        description="Join Referly as a candidate or employee referrer to unlock direct career connections."
      />
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <BriefcaseBusiness className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Referly</span>
          </Link>
          <h1 className="text-2xl sm:text-[26px] font-heading font-bold text-[#090A0F] tracking-tight">Create your Referly account</h1>
          <p className="text-sm font-sans text-slate-500 leading-normal">
            Join thousands getting referred directly to leading product & engineering teams.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-5">
          {/* Account Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Your Role on Referly
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType('seeker')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  accountType === 'seeker'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserCheck
                    className={`w-4 h-4 ${
                      accountType === 'seeker' ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-bold ${
                      accountType === 'seeker' ? 'text-indigo-900' : 'text-slate-700'
                    }`}
                  >
                    Job Seeker
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Looking for referrals & interviews
                </p>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('referrer')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  accountType === 'referrer'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase
                    className={`w-4 h-4 ${
                      accountType === 'referrer' ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-bold ${
                      accountType === 'referrer' ? 'text-indigo-900' : 'text-slate-700'
                    }`}
                  >
                    Referrer
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Employee referring top candidates
                </p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Arjun Mehta"
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {accountType === 'referrer' ? 'Corporate Work Email' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={accountType === 'referrer' ? 'priya@company.com' : 'arjun@example.com'}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
              />
              {accountType === 'referrer' && (
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Used for verified company employer validation.
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="w-full text-xs rounded-lg border border-slate-200 p-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="leading-tight">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-indigo-600 hover:underline font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" target="_blank" className="text-indigo-600 hover:underline font-medium">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
