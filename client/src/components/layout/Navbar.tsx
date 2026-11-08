import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import {
  Menu,
  X,
  LogOut,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Command,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, currentRole, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Find Jobs', href: '/jobs' },
    { name: 'Find Referrals', href: '/referrals' },
    { name: 'Companies', href: '/companies' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  const getDashboardPath = () => {
    if (currentRole === 'seeker') return '/dashboard';
    if (currentRole === 'referrer') return '/referrer-dashboard';
    if (currentRole === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Architecture */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#090A0F] flex items-center justify-center text-white shadow-xs group-hover:bg-slate-800 transition-colors">
              <span className="font-mono text-xs font-bold tracking-tight text-white">R/</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-heading font-bold tracking-tight text-[#090A0F] group-hover:text-[#2563EB] transition-colors">
                Referly
              </span>
              <span className="text-[10px] -mt-0.5 font-sans text-slate-500 tracking-wide">
                Get Referred. Get Hired.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'text-[#090A0F] bg-slate-100 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-[#090A0F] hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-[#090A0F] border border-slate-200/60 transition-all btn-tactile"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    ({currentUser.role})
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </Link>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50/80 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#090A0F] hover:bg-slate-100 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#090A0F] hover:bg-slate-800 shadow-xs transition-all btn-tactile"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3 shadow-dropdown animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `min-h-[44px] flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#2563EB] bg-blue-50/80 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            {currentUser ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 text-sm font-semibold text-slate-800"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center justify-center py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center justify-center py-2.5 text-sm font-semibold text-white bg-[#090A0F] hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
