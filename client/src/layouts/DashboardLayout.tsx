import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ToastContainer } from '@/components/common/ToastContainer';
import {
  BriefcaseBusiness,
  LayoutDashboard,
  User,
  Search,
  Bookmark,
  FileCheck2,
  Send,
  MessageSquare,
  Bell,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Building2,
  BarChart3,
  FileSpreadsheet,
  Users,
  Inbox,
  Globe,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const DashboardLayout: React.FC = () => {
  const { currentUser, currentRole, logout, notifications, conversations, referralRequests } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If unauthenticated, redirect to login
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, navigate]);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const pendingRequestsCount = referralRequests.filter((r) => r.status === 'Pending').length;

  // Determine active portal mode based on route
  const activeRole = location.pathname.startsWith('/admin')
    ? 'admin'
    : location.pathname.startsWith('/referrer-dashboard')
    ? 'referrer'
    : 'seeker';

  // Build sidebar items dynamically according to current perspective
  let sidebarItems: SidebarItem[] = [];

  if (activeRole === 'seeker') {
    sidebarItems = [
      { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { name: 'My Profile', href: '/dashboard/profile', icon: User },
      { name: 'Find Jobs', href: '/dashboard/jobs', icon: Search },
      { name: 'Saved Jobs', href: '/dashboard/saved-jobs', icon: Bookmark },
      { name: 'My Applications', href: '/dashboard/applications', icon: FileCheck2 },
      {
        name: 'Referral Requests',
        href: '/dashboard/referral-requests',
        icon: Send,
        badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      },
      {
        name: 'Messages',
        href: '/dashboard/messages',
        icon: MessageSquare,
        badge: unreadMessages > 0 ? unreadMessages : undefined,
      },
      {
        name: 'Notifications',
        href: '/dashboard/notifications',
        icon: Bell,
        badge: unreadNotifs > 0 ? unreadNotifs : undefined,
      },
      { name: 'Resume Dossier', href: '/dashboard/resume', icon: FileText },
      { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCard },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];
  } else if (activeRole === 'referrer') {
    sidebarItems = [
      { name: 'Overview', href: '/referrer-dashboard', icon: LayoutDashboard },
      { name: 'My Profile', href: '/referrer-dashboard/profile', icon: User },
      {
        name: 'Incoming Requests',
        href: '/referrer-dashboard/requests',
        icon: Inbox,
        badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      },
      { name: 'My Referrals', href: '/referrer-dashboard/referrals', icon: FileCheck2 },
      { name: 'Post Opening', href: '/referrer-dashboard/refer-candidate', icon: Send },
      {
        name: 'Messages',
        href: '/referrer-dashboard/messages',
        icon: MessageSquare,
        badge: unreadMessages > 0 ? unreadMessages : undefined,
      },
      {
        name: 'Notifications',
        href: '/referrer-dashboard/notifications',
        icon: Bell,
        badge: unreadNotifs > 0 ? unreadNotifs : undefined,
      },
      { name: 'Settings', href: '/referrer-dashboard/settings', icon: Settings },
    ];
  } else if (activeRole === 'admin') {
    sidebarItems = [
      { name: 'Overview', href: '/admin', icon: LayoutDashboard },
      { name: 'Users Directory', href: '/admin/users', icon: Users },
      { name: 'Job Requisitions', href: '/admin/jobs', icon: BriefcaseBusiness },
      { name: 'Referral Pipeline', href: '/admin/referrals', icon: Send },
      { name: 'Verified Employers', href: '/admin/companies', icon: Building2 },
      { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
      { name: 'Analytics Telemetry', href: '/admin/analytics', icon: BarChart3 },
      { name: 'Audit Reports', href: '/admin/reports', icon: FileSpreadsheet },
      {
        name: 'Notifications',
        href: '/admin/notifications',
        icon: Bell,
        badge: unreadNotifs > 0 ? unreadNotifs : undefined,
      },
      { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
    ];
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const portalLabel =
    activeRole === 'seeker'
      ? 'Candidate Workspace'
      : activeRole === 'referrer'
      ? 'Referrer Console'
      : 'Admin Command';

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#090A0F] font-sans">
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200/90 flex-shrink-0">
          {/* Brand Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded bg-[#090A0F] flex items-center justify-center text-white font-mono text-xs font-bold shadow-xs">
                R/
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-heading font-bold text-[#090A0F] tracking-tight">Referly</span>
                <span className="text-[10px] font-sans text-slate-500 uppercase -mt-0.5 tracking-wider font-medium">
                  {portalLabel}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/dashboard' || item.href === '/referrer-dashboard' || item.href === '/admin'
                  ? location.pathname === item.href
                  : location.pathname.startsWith(item.href);

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-[#090A0F] font-semibold border-l-2 border-[#2563EB] pl-2.5'
                      : 'text-slate-600 hover:text-[#090A0F] hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-slate-400'}`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-semibold bg-slate-200 text-[#090A0F]">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Back to Public Site link */}
          <div className="px-3 py-2 border-t border-slate-100">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:text-[#090A0F] hover:bg-slate-50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>View Public Website</span>
            </Link>
          </div>

          {/* User Profile & Logout Box */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt={currentUser?.name || 'User'}
                  className="w-8 h-8 rounded-md object-cover flex-shrink-0 ring-1 ring-slate-900/10"
                />
                <div className="truncate">
                  <span className="text-xs font-semibold text-[#090A0F] block truncate">
                    {currentUser?.name || 'User'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block truncate">
                    {currentUser?.email || 'user@referly.io'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* MOBILE SIDEBAR OVERLAY */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-modal">
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-[#090A0F] flex items-center justify-center text-white font-mono text-xs font-bold">
                    R/
                  </div>
                  <span className="text-base font-bold text-[#090A0F]">Referly</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${
                          isActive
                            ? 'bg-slate-100 text-[#090A0F] font-semibold border-l-2 border-[#2563EB] pl-2.5'
                            : 'text-slate-600 hover:text-[#090A0F] hover:bg-slate-50 font-medium'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-500" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-semibold bg-slate-200 text-[#090A0F]">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              <div className="p-3 border-t border-slate-100 space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="w-full py-2 px-3 rounded-md text-xs font-semibold text-slate-700 bg-slate-100 flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>View Public Website</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-md text-xs font-semibold text-rose-600 bg-rose-50 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN DASHBOARD CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/90 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:text-[#090A0F] rounded-md"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-sans font-medium">
                <Link to="/" className="hover:text-[#090A0F] transition-colors">
                  Referly
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-[#090A0F] font-semibold">
                  {portalLabel}
                </span>
              </div>
            </div>

            {/* Quick action buttons & badges */}
            <div className="flex items-center gap-3">
              {activeRole === 'seeker' && (
                <Link
                  to="/dashboard/jobs"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-[#090A0F] hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Find Jobs</span>
                </Link>
              )}

              {activeRole === 'referrer' && (
                <Link
                  to="/referrer-dashboard/refer-candidate"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-[#090A0F] hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Opening</span>
                </Link>
              )}

              {/* Notification icon */}
              <Link
                to={
                  activeRole === 'seeker'
                    ? '/dashboard/notifications'
                    : activeRole === 'referrer'
                    ? '/referrer-dashboard/notifications'
                    : '/admin/notifications'
                }
                className="relative p-2 rounded-md text-slate-500 hover:text-[#090A0F] hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-white" />
                )}
              </Link>

              {/* Message icon */}
              <Link
                to={
                  activeRole === 'seeker'
                    ? '/dashboard/messages'
                    : activeRole === 'referrer'
                    ? '/referrer-dashboard/messages'
                    : '/admin'
                }
                className="relative p-2 rounded-md text-slate-500 hover:text-[#090A0F] hover:bg-slate-100 transition-colors"
                title="Messages"
              >
                <MessageSquare className="w-4 h-4" />
                {unreadMessages > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </Link>
            </div>
          </header>

          {/* Subview Outlet */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
