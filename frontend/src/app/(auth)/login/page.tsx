"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import { Sparkles, ArrowRight, Github, Mail, Lock, User, Building2, KeyRound, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithOtp, switchDemoRole } = useAuth();

  const [activeTab, setActiveTab] = useState<"password" | "otp">("password");
  
  // Password login state
  const [email, setEmail] = useState("alex.sharma@example.com");
  const [password, setPassword] = useState("DemoAlex2026!");
  const [rememberMe, setRememberMe] = useState(true);

  // OTP login state
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [devCodePreview, setDevCodePreview] = useState<string | null>(null);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpEmail) {
      setError("Please provide a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.requestOtp({ email: otpEmail, purpose: "LOGIN" });
      setOtpRequested(true);
      setOtpSuccessMessage(res.message || "Verification code sent!");
      if (res.dev_code) {
        setDevCodePreview(res.dev_code);
        setOtpCode(res.dev_code); // Pre-fill for instant development testing
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await loginWithOtp(otpEmail, otpCode);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role: "JOB_SEEKER" | "HR" | "ADMIN") => {
    setLoading(true);
    try {
      await switchDemoRole(role);
      if (role === "HR") router.push("/hr/dashboard");
      else if (role === "ADMIN") router.push("/admin");
      else router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 via-slate-100/50 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-elevated transition-colors">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 border border-indigo-100 dark:border-indigo-900/50 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in to your verified Skills2Job account</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6 border border-slate-200/70 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => { setActiveTab("password"); setError(""); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "password"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Password
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("otp"); setError(""); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "otp"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Instant OTP Login
          </button>
        </div>

        {/* 1-Click Demo Quick Start */}
        <div className="mb-6 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-center">
          <span className="text-[10px] font-extrabold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider block mb-2">
            ⚡ Instant Verified Roles
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick("JOB_SEEKER")}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-slate-700 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              Candidate View
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick("HR")}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-slate-700 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              HR Recruiter View
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Form: Password Login */}
        {activeTab === "password" ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 transition-colors"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="ml-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                Keep me signed in
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Signing in..." : "Sign In with Password"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Form: Instant OTP Login */
          <div className="space-y-4">
            {!otpRequested ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enter Email for Instant One-Time Password
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 transition-colors"
                      placeholder="e.g. user@example.com"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    We will instantly generate a secure 6-digit login token.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Generating OTP..." : "Send Instant Login Code"}
                  <KeyRound className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in zoom-in-95">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">{otpSuccessMessage}</span>
                    <div className="text-[11px] mt-0.5">Code sent to: {otpEmail}</div>
                    {devCodePreview && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 rounded-lg border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs">
                        <span>Dev Test Code:</span>
                        <span className="tracking-widest text-indigo-600 dark:text-indigo-400">{devCodePreview}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    6-Digit One-Time Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-mono tracking-widest font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 transition-colors"
                      placeholder="123456"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setOtpRequested(false); setOtpCode(""); }}
                    className="flex-1 py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Change Email
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? "Authenticating..." : "Verify & Sign In"}
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* OAuth Dividers */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoClick("JOB_SEEKER")}
              className="py-2.5 px-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => handleDemoClick("JOB_SEEKER")}
              className="py-2.5 px-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors"
            >
              <Github className="w-4 h-4 text-slate-800 dark:text-slate-200" />
              GitHub
            </button>
          </div>

          <div className="text-center mt-6">
            <span className="text-xs text-slate-500 dark:text-slate-400">Don't have an account? </span>
            <Link href="/register" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
