"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useTheme } from "@/lib/themeContext";
import { api } from "@/lib/api";
import {
  Sparkles, Bell, CheckCircle2, ShieldCheck,
  User, Building2, LayoutDashboard, LogOut,
  ChevronDown, ExternalLink, Menu, X, Cpu, Sun, Moon, Settings
} from "lucide-react";

export const Navbar = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data || []);
      setUnreadCount(data ? data.filter((n: any) => !n.is_read).length : 0);
    } catch (e) {
      // fallback
      setNotifications([
        { id: 1, title: "New 94% Match Found", message: "Full Stack Developer at Google matches your profile.", time: "10m ago", is_read: false },
        { id: 2, title: "Interview Scheduled! 📅", message: "Technical round scheduled for Saturday 02:30 PM.", time: "1h ago", is_read: false },
        { id: 3, title: "Resume Analysis Complete", message: "Your ATS score is 89%. View recommendations.", time: "3h ago", is_read: true }
      ]);
      setUnreadCount(2);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Top-Left Section: Dark Theme Toggle + Logo & Slogan */}
          <div className="flex items-center gap-3">
            {/* Dark Theme Toggle Button at the Top-Left Corner */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition-all shadow-xs flex items-center justify-center group"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform" />
              )}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent">
                  Skills<span className="text-indigo-600 dark:text-indigo-400">2</span>Job
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500 -mt-1 hidden sm:block">
                  AI Career Matchmaking
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/" className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${pathname === '/' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}`}>
              Home
            </Link>
            <Link href="/jobs" className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${pathname.startsWith('/jobs') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}`}>
              Find Jobs
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            
            {/* Settings & System Diagnostics Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
                title="Settings & System Tools"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showSettings && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-elevated border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">Settings & Developer Tools</span>
                    </div>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Viva & Architecture Link */}
                  <div className="mb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
                      Technical Architecture
                    </span>
                    <Link
                      href="/viva"
                      onClick={() => setShowSettings(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-100 dark:border-indigo-900 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            Viva & Architecture Portal
                          </div>
                          <div className="text-[10px] text-indigo-700/80 dark:text-indigo-400">
                            5-Factor ML Engine & Presentation Deck
                          </div>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-indigo-400 -rotate-90" />
                    </Link>
                  </div>

                  {/* Demo Persona Switcher (Job Seeker, HR, Admin) */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
                      Demo Persona Switcher
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => { switchDemoRole("JOB_SEEKER"); setShowSettings(false); }}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          user?.role === "JOB_SEEKER"
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold"
                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                        }`}
                      >
                        <User className="w-4 h-4 mx-auto mb-1 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-[11px] block">Job Seeker</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { switchDemoRole("HR"); setShowSettings(false); }}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          user?.role === "HR"
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold"
                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                        }`}
                      >
                        <Building2 className="w-4 h-4 mx-auto mb-1 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-[11px] block">HR Recruiter</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { switchDemoRole("ADMIN"); setShowSettings(false); }}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          user?.role === "ADMIN"
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold"
                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-[11px] block">Admin</span>
                      </button>
                    </div>
                  </div>

                  {/* Dark Theme Quick Toggle */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Current Theme:</span>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                      <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Drawer Trigger */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-elevated border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-800 dark:text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-xs">No notifications yet</div>
                    ) : (
                      notifications.map((n: any) => (
                        <div key={n.id} className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${!n.is_read ? 'bg-indigo-50/40 dark:bg-indigo-950/30' : ''}`}>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-xs text-slate-900 dark:text-white">{n.title}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Portal Action */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === "HR" ? "/hr/dashboard" : user.role === "ADMIN" ? "/admin" : "/dashboard"}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xs transition-all"
                >
                  <img
                    src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt={user.full_name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-slate-800 dark:text-white leading-none">{user.full_name.split(' ')[0]}</span>
                      {user.is_email_verified && (
                        <span title="Verified Account"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 inline" /></span>
                      )}
                    </div>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium leading-tight">
                      {user.role === "HR" ? "Recruiter" : user.role === "ADMIN" ? "Admin" : "Candidate"}
                    </span>
                  </div>
                </Link>
                
                <button
                  onClick={() => router.push("/login")}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                  title="Switch or Login"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col gap-2 font-medium text-sm text-slate-700 dark:text-slate-200">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
            <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-indigo-600 dark:hover:text-indigo-400">Find Jobs</Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-indigo-600 dark:hover:text-indigo-400">Job Seeker Portal</Link>
            <Link href="/hr/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-indigo-600 dark:hover:text-indigo-400">HR Recruiter Portal</Link>
            <Link href="/viva" onClick={() => setMobileMenuOpen(false)} className="py-2 text-indigo-600 dark:text-indigo-400 font-semibold">Viva & Architecture</Link>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Quick Demo Switch:</span>
            <div className="flex gap-2">
              <button
                onClick={() => { switchDemoRole("JOB_SEEKER"); setMobileMenuOpen(false); }}
                className="flex-1 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg font-medium text-slate-800 dark:text-slate-200 text-center"
              >
                Alex (Seeker)
              </button>
              <button
                onClick={() => { switchDemoRole("HR"); setMobileMenuOpen(false); }}
                className="flex-1 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg font-medium text-slate-800 dark:text-slate-200 text-center"
              >
                Sarah (HR)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
