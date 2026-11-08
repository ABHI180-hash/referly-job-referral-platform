import React from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, Briefcase, Globe, Rocket } from 'lucide-react';

export const RoleSwitcherBanner: React.FC = () => {
  const { currentRole, switchRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (role: 'seeker' | 'referrer' | 'admin' | 'guest') => {
    switchRole(role);
    if (role === 'seeker' && !location.pathname.startsWith('/dashboard')) {
      navigate('/dashboard');
    } else if (role === 'referrer' && !location.pathname.startsWith('/referrer-dashboard')) {
      navigate('/referrer-dashboard');
    } else if (role === 'admin' && !location.pathname.startsWith('/admin')) {
      navigate('/admin');
    } else if (role === 'guest' && (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/referrer-dashboard') || location.pathname.startsWith('/admin'))) {
      navigate('/');
    }
  };

  return (
    <aside aria-label="Demo Perspective Switcher" className="bg-[#090A0F] border-b border-slate-800 text-xs py-1.5 px-4 text-slate-300 font-sans">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Interactive Demo
          </span>
          <span className="hidden sm:inline text-slate-400 text-xs font-normal">
            Switch user perspective:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs font-medium">
          <button
            onClick={() => handleRoleChange('guest')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              currentRole === 'guest'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public</span>
          </button>

          <button
            onClick={() => handleRoleChange('seeker')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              currentRole === 'seeker'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-200" />
            <span>Candidate (Arjun)</span>
          </button>

          <button
            onClick={() => handleRoleChange('referrer')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              currentRole === 'referrer'
                ? 'bg-slate-800 text-white border border-slate-600 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-slate-300" />
            <span>Referrer</span>
          </button>

          <button
            onClick={() => handleRoleChange('admin')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              currentRole === 'admin'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
            <span>Admin</span>
          </button>

          <Link
            to="/launchpilot"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/50 transition-all ml-1"
            title="Open Website Launch Readiness Control Center"
          >
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span>Launch Control</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
