import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Briefcase,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { switchRole, addToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState<'seeker' | 'referrer' | 'admin'>('seeker');
  const [email, setEmail] = useState('arjun.mehta@example.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const roleProfiles = {
    seeker: {
      title: 'Candidate / Job Seeker',
      subtitle: 'Track applications, request employee referrals & prepare interviews',
      email: 'arjun.mehta@example.com',
      destination: '/dashboard',
      destinationName: 'Candidate Workspace',
      user: 'Arjun Mehta (Software Engineer)',
      badgeColor: 'border-blue-500 bg-blue-50/60 text-blue-700',
      activeBorder: 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40',
      icon: UserCheck,
    },
    referrer: {
      title: 'Company Referrer',
      subtitle: 'Review candidate dossiers, refer candidates & post hiring roles',
      email: 'priya.sharma@stripe.com',
      destination: '/referrer-dashboard',
      destinationName: 'Referrer Console',
      user: 'Priya Sharma (Staff SWE @ Stripe)',
      badgeColor: 'border-purple-500 bg-purple-50/60 text-purple-700',
      activeBorder: 'border-purple-600 ring-2 ring-purple-500/20 bg-purple-50/40',
      icon: Briefcase,
    },
    admin: {
      title: 'Platform Administrator',
      subtitle: 'Oversee users, verify employers, moderate jobs & inspect analytics',
      email: 'admin@referly.io',
      destination: '/admin',
      destinationName: 'Admin Center',
      user: 'Platform Administrator (Superuser)',
      badgeColor: 'border-emerald-500 bg-emerald-50/60 text-emerald-700',
      activeBorder: 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/40',
      icon: ShieldCheck,
    },
  };

  const handleSelectRole = (role: 'seeker' | 'referrer' | 'admin') => {
    setSelectedRole(role);
    setEmail(roleProfiles[role].email);
    setPassword('Password123!');
  };

  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    await switchRole(selectedRole);
    navigate(roleProfiles[selectedRole].destination);
  };

  const handleDirectRoleLogin = async (role: 'seeker' | 'referrer' | 'admin') => {
    setSelectedRole(role);
    setEmail(roleProfiles[role].email);
    await switchRole(role);
    navigate(roleProfiles[role].destination);
  };

  const currentProfile = roleProfiles[selectedRole];
  const CurrentIcon = currentProfile.icon;

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <PageMeta
        title="Sign In — Choose Role & Access Workspace"
        description="Sign in as a Candidate, Referrer, or Administrator to access your tailored dashboard."
      />

      <div className="w-full max-w-xl space-y-6">
        {/* Top Back Link & Logo */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#090A0F] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Homepage</span>
          </Link>

          <span className="text-[11px] font-mono text-slate-400">
            REFERLY SECURE AUTH
          </span>
        </div>

        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-2.5 justify-center mb-1">
            <div className="w-9 h-9 rounded-lg bg-[#090A0F] flex items-center justify-center text-white font-mono text-xs font-bold shadow-xs">
              R/
            </div>
            <span className="text-xl font-heading font-bold text-[#090A0F]">Referly</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#090A0F] tracking-tight">
            Sign In to Your Workspace
          </h1>
          <p className="text-xs sm:text-sm font-sans text-slate-500 max-w-md mx-auto">
            Select your account role below to open your personalized dashboard and pipeline.
          </p>
        </div>

        {/* 3 Dedicated Role Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['seeker', 'referrer', 'admin'] as const).map((roleKey) => {
            const role = roleProfiles[roleKey];
            const RoleIcon = role.icon;
            const isSelected = selectedRole === roleKey;

            return (
              <button
                key={roleKey}
                type="button"
                onClick={() => handleSelectRole(roleKey)}
                className={`relative text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between min-h-[110px] ${
                  isSelected
                    ? role.activeBorder
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-white shadow-2xs' : 'bg-slate-100'}`}>
                    <RoleIcon className={`w-4 h-4 ${isSelected ? 'text-[#090A0F]' : 'text-slate-600'}`} />
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                </div>

                <div className="mt-2.5">
                  <div className="font-heading font-bold text-slate-900 text-xs">
                    {roleKey === 'seeker' ? 'Candidate' : roleKey === 'referrer' ? 'Referrer' : 'Admin'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans leading-tight mt-0.5 line-clamp-2">
                    {roleKey === 'seeker' ? 'Applications & Referrals' : roleKey === 'referrer' ? 'Review & Endorse' : 'Platform Operations'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Role Card & Credentials Form */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-card space-y-5">
          {/* Selected Role Indicator Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#090A0F]">
                <CurrentIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-heading font-bold text-slate-900 block">
                  {currentProfile.title}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Workspace: <strong className="text-slate-700 font-medium">{currentProfile.destinationName}</strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDirectRoleLogin(selectedRole)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#090A0F] hover:bg-slate-800 transition-colors shadow-2xs inline-flex items-center gap-1.5"
            >
              <span>1-Click Enter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-blue-600 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs rounded-lg border border-slate-200 p-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Keep me signed in</span>
              </label>

              <span className="text-[11px] text-slate-400 font-mono">
                Verified: {currentProfile.user}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-[#090A0F] hover:bg-slate-800 shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Sign In as {selectedRole === 'seeker' ? 'Candidate' : selectedRole === 'referrer' ? 'Referrer' : 'Admin'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register as a Candidate or Referrer
          </Link>
        </p>
      </div>
    </div>
  );
};
