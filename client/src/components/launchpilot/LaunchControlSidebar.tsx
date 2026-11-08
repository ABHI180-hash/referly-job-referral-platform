import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Rocket,
  LayoutDashboard,
  Globe2,
  ListChecks,
  BarChart3,
  History,
  Settings,
  User,
  ShieldCheck,
  Radio,
  ExternalLink,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useLaunchPilot } from '../../context/LaunchPilotContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const LaunchControlSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { websites, activeWebsite, currentScan } = useLaunchPilot();

  const navItems = [
    { label: 'Control Center', path: '/launchpilot', icon: LayoutDashboard, exact: true },
    { label: 'My Websites', path: '/launchpilot/websites', icon: Globe2 },
    { label: 'Launch Checklist', path: '/launchpilot/checklist', icon: ListChecks },
    { label: 'Analytics', path: '/launchpilot/analytics', icon: BarChart3 },
    { label: 'Scan History', path: '/launchpilot/history', icon: History },
    { label: 'Scanner Settings', path: '/launchpilot/settings', icon: Settings },
    { label: 'Profile & Access', path: '/launchpilot/profile', icon: User },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#07090E] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Top Branding Section */}
      <div>
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link
            to="/launchpilot"
            className="flex items-center gap-2.5 group"
            onClick={onClose}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#07090E] rounded-[10px] flex items-center justify-center">
                <Rocket className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight font-heading">
                  Launch<span className="text-cyan-400">Pilot</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 block leading-tight">
                LAUNCH CONTROL CENTER
              </span>
            </div>
          </Link>
        </div>

        {/* Active Target Banner */}
        <div className="p-3.5 mx-3 mt-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-cyan-400">
              <Radio className="w-3 h-3 animate-pulse" /> TARGET ORBIT
            </span>
            <span
              className={`font-bold ${
                activeWebsite?.launchStatus === 'GO'
                  ? 'text-emerald-400'
                  : activeWebsite?.launchStatus === 'NO-GO'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {activeWebsite?.launchStatus || 'STANDBY'}
            </span>
          </div>

          <p className="text-xs font-bold text-white truncate font-mono">
            {activeWebsite?.domain || 'Select Website'}
          </p>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-0.5">
            <span>Readiness:</span>
            <span className="text-slate-200 font-bold">
              {activeWebsite?.readinessScore ?? 0}%
            </span>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="px-3 py-4 space-y-1 font-mono text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section: Fleet Status & Return Link */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs font-mono space-y-1">
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>TRACKED WEBSITES</span>
            <span className="text-cyan-400 font-bold">{websites.length}</span>
          </div>
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>READY TO LAUNCH</span>
            <span className="text-emerald-400 font-bold">
              {websites.filter((w) => w.launchStatus === 'GO').length}
            </span>
          </div>
        </div>

        {/* Career Platform Switcher Link */}
        <Link
          to="/"
          className="w-full py-2 px-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center justify-between text-[11px] font-mono border border-slate-800"
        >
          <span>Return to Referly</span>
          <ExternalLink className="w-3 h-3 text-cyan-400" />
        </Link>
      </div>
    </aside>
  );
};
