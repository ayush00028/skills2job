"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import {
  Sparkles, Bell, CheckCircle2, ShieldCheck,
  User, Building2, LayoutDashboard, LogOut,
  ChevronDown, ExternalLink, Menu, X, Cpu
} from "lucide-react";

export const Navbar = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
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
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-700 bg-clip-text text-transparent">
                  Skills<span className="text-indigo-600">2</span>Job
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 -mt-1 hidden sm:block">
                  AI Career Matchmaking
                </span>
              </div>
            </Link>

            {/* Viva / Tech Architecture Quick Badge */}
            <Link
              href="/viva"
              className="ml-2 hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>Viva & Architecture</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className={`hover:text-indigo-600 transition-colors ${pathname === '/' ? 'text-indigo-600 font-semibold' : ''}`}>
              Home
            </Link>
            <Link href="/jobs" className={`hover:text-indigo-600 transition-colors ${pathname.startsWith('/jobs') ? 'text-indigo-600 font-semibold' : ''}`}>
              Find Jobs
            </Link>
            <Link href="/dashboard" className={`hover:text-indigo-600 transition-colors ${pathname.startsWith('/dashboard') ? 'text-indigo-600 font-semibold' : ''}`}>
              For Job Seekers
            </Link>
            <Link href="/hr/dashboard" className={`hover:text-indigo-600 transition-colors ${pathname.startsWith('/hr') ? 'text-indigo-600 font-semibold' : ''}`}>
              For Recruiters
            </Link>
          </nav>

          {/* Right Action Bar & Demo Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Quick Demo Persona Switcher */}
            <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
              <span className="px-2 text-slate-400 font-semibold uppercase text-[10px]">Demo:</span>
              <button
                onClick={() => switchDemoRole("JOB_SEEKER")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  user?.role === "JOB_SEEKER"
                    ? "bg-white text-indigo-700 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-indigo-600"
                }`}
                title="Switch to Candidate Alex Sharma"
              >
                <User className="w-3.5 h-3.5" />
                Job Seeker
              </button>
              <button
                onClick={() => switchDemoRole("HR")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  user?.role === "HR"
                    ? "bg-white text-indigo-700 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-indigo-600"
                }`}
                title="Switch to Recruiter Sarah Jenkins"
              >
                <Building2 className="w-3.5 h-3.5" />
                HR Recruiter
              </button>
              <button
                onClick={() => switchDemoRole("ADMIN")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  user?.role === "ADMIN"
                    ? "bg-white text-indigo-700 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-indigo-600"
                }`}
                title="Switch to Admin"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>

            {/* Notification Drawer Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-elevated border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-800">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-indigo-600 hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">No notifications yet</div>
                    ) : (
                      notifications.map((n: any) => (
                        <div key={n.id} className={`p-3.5 hover:bg-slate-50 transition-colors ${!n.is_read ? 'bg-indigo-50/40' : ''}`}>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-xs text-slate-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
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
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all"
                >
                  <img
                    src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt={user.full_name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-slate-800 leading-none">{user.full_name.split(' ')[0]}</span>
                      {user.is_email_verified && (
                        <span title="Verified Account"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600 inline" /></span>
                      )}
                    </div>
                    <span className="text-[10px] text-indigo-600 font-medium leading-tight">
                      {user.role === "HR" ? "Recruiter" : user.role === "ADMIN" ? "Admin" : "Candidate"}
                    </span>
                  </div>
                </Link>
                
                <button
                  onClick={() => router.push("/login")}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Switch or Login"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2"
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
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col gap-2 font-medium text-sm text-slate-700">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Home</Link>
            <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Find Jobs</Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Job Seeker Portal</Link>
            <Link href="/hr/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">HR Recruiter Portal</Link>
            <Link href="/viva" onClick={() => setMobileMenuOpen(false)} className="py-2 text-indigo-600 font-semibold">Viva & Architecture</Link>
          </div>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Quick Demo Switch:</span>
            <div className="flex gap-2">
              <button
                onClick={() => { switchDemoRole("JOB_SEEKER"); setMobileMenuOpen(false); }}
                className="flex-1 py-1.5 text-xs bg-slate-100 rounded-lg font-medium text-slate-800 text-center"
              >
                Alex (Seeker)
              </button>
              <button
                onClick={() => { switchDemoRole("HR"); setMobileMenuOpen(false); }}
                className="flex-1 py-1.5 text-xs bg-slate-100 rounded-lg font-medium text-slate-800 text-center"
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
