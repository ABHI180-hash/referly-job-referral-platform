import React, { useState } from 'react';
import {
  Menu,
  ChevronDown,
  Globe,
  Bell,
  Play,
  RotateCw,
  Volume2,
  VolumeX,
  Plus,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  User,
  Check,
  X,
} from 'lucide-react';
import { useLaunchPilot } from '../../context/LaunchPilotContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenAddModal: () => void;
}

export const LaunchControlNavbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenAddModal,
}) => {
  const {
    websites,
    activeWebsite,
    setActiveWebsite,
    isScanning,
    triggerScan,
    soundEnabled,
    setSoundEnabled,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useLaunchPilot();

  const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const status = activeWebsite?.launchStatus || 'NOT_SCANNED';

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#07090E]/95 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Domain Selector Dropdown */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Website Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDomainDropdownOpen(!domainDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all font-mono text-xs font-semibold"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="max-w-[140px] sm:max-w-[200px] truncate">
              {activeWebsite ? activeWebsite.domain : 'Select Target'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {domainDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-2xl p-2 z-50 font-mono text-xs space-y-1">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                REGISTERED TARGET WEBSITES
              </div>

              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {websites.map((site) => (
                  <button
                    key={site._id}
                    onClick={() => {
                      setActiveWebsite(site);
                      setDomainDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                      activeWebsite?._id === site._id
                        ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{site.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{site.domain}</div>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        site.launchStatus === 'GO'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : site.launchStatus === 'NO-GO'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {site.readinessScore}%
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-1 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setDomainDropdownOpen(false);
                    onOpenAddModal();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-1.5 font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register New Website</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Launch Status HUD Pill */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 font-mono text-xs">
          <span className="text-[10px] text-slate-500">GATE:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${
              status === 'GO'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : status === 'NO-GO'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : status === 'CONDITIONAL'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {status === 'GO' ? (
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
            ) : status === 'NO-GO' ? (
              <ShieldAlert className="w-3 h-3 text-rose-400" />
            ) : (
              <AlertTriangle className="w-3 h-3 text-amber-400" />
            )}
            {status}
          </span>
        </div>
      </div>

      {/* Right: Quick Action Controls, Sound, Notifications, User */}
      <div className="flex items-center gap-2.5">
        {/* Instant Scan CTA Button */}
        <button
          onClick={() => triggerScan()}
          disabled={isScanning || !activeWebsite}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-black uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          {isScanning ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Scanning Telemetry...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Scan Again</span>
            </>
          )}
        </button>

        {/* Audio Telemetry Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-xl border transition-colors ${
            soundEnabled
              ? 'bg-slate-900 text-cyan-400 border-cyan-500/30'
              : 'bg-slate-900/60 text-slate-500 border-slate-800'
          }`}
          title={soundEnabled ? 'Telemetry Audio Active' : 'Telemetry Audio Muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors relative"
            title="Launch Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold text-[9px] flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Drawer Menu */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-2xl p-4 z-50 space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  TELEMETRY ADVISORIES
                </span>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No active telemetry advisories.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => markNotificationRead(notif._id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        notif.read
                          ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                          : notif.type === 'critical'
                          ? 'bg-rose-500/10 border-rose-500/30'
                          : notif.type === 'warning'
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-cyan-500/10 border-cyan-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px] truncate">
                          {notif.title}
                        </span>
                        <span className="text-[9px] text-slate-500">
                          {new Date(notif.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Capsule */}
        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-md">
            LP
          </div>
          <div className="text-left font-mono">
            <span className="text-xs font-bold text-white block leading-tight">Commander</span>
            <span className="text-[10px] text-cyan-400">Mission Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
};
