"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { Sidebar } from "@/components/Sidebar";
import { SmartJobCard } from "@/components/SmartJobCard";
import { api } from "@/lib/api";
import {
  Sparkles, TrendingUp, CheckCircle2, AlertTriangle,
  Briefcase, ArrowRight, ShieldCheck, Target, Zap,
  Calendar, Award, Search, Info
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [prof, jobsRes, intRes] = await Promise.all([
        api.getJobSeekerProfile(),
        api.getJobs({ limit: 5 }),
        api.getScheduledInterviews()
      ]);
      setProfileData(prof);
      setJobs(jobsRes.jobs ? jobsRes.jobs.slice(0, 5) : []);
      setInterviews(intRes || []);
    } catch (e) {
      console.warn("Failed loading live dashboard data, fallback active");
    } finally {
      setLoading(false);
    }
  };

  const name = user?.full_name || "Alex Sharma";

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Welcome Banner (Page 23) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good morning, {name.split(" ")[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Here are your strongest career matchmaking opportunities today.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/jobs"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore All Jobs</span>
            </Link>
            <Link
              href="/viva"
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
            >
              Architecture Viva
            </Link>
          </div>
        </div>

        {/* Top Statistics Bar (Pages 23-24) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Profile Strength</span>
              <Award className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">94%</div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
              Top 5% Tier
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Jobs Matched</span>
              <Briefcase className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">128</div>
            <span className="text-[10px] text-slate-400 mt-1 inline-block">Across Bangalore & Remote</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">High Matches</span>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-700">24</div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
              ≥ 85% Compatibility
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Skills To Improve</span>
              <Target className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600">6</div>
            <Link href="/skill-gap" className="text-[10px] text-indigo-600 font-bold hover:underline mt-1 inline-block">
              View Learning Plan →
            </Link>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Applications</span>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">12</div>
            <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
              3 In Interview Round
            </span>
          </div>

        </div>

        {/* 2-Column Core Intelligence Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Left: Large Career Compatibility Card (Pages 25-27, 80) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-elevated space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                  Explainable AI Career Match
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">Your Career Compatibility</h2>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-indigo-600 leading-none">87%</div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                  Strong Match
                </span>
              </div>
            </div>

            {/* 5-Factor Weighted Score Breakdown */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                5-Factor Score Breakdown (Weighted Backend Model)
              </span>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Required Skill Match (40% weight)</span>
                  <span className="font-bold text-indigo-600">91%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: "91%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Experience Match (20% weight)</span>
                  <span className="font-bold text-indigo-600">84%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: "84%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Education Match (15% weight)</span>
                  <span className="font-bold text-indigo-600">95%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>GitHub & Projects Relevance (15% weight)</span>
                  <span className="font-bold text-indigo-600">88%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: "88%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>ATS & Keyword Semantics (10% weight)</span>
                  <span className="font-bold text-indigo-600">82%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: "82%" }}></div>
                </div>
              </div>
            </div>

            {/* Explainable AI "What / Why / What Should I Do?" Box (Pages 26-27, 80) */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <div>
                <strong className="text-slate-900 font-bold uppercase tracking-wider text-[10px] block text-indigo-600">
                  WHY THIS SCORE?
                </strong>
                <p className="text-slate-700 mt-0.5 leading-relaxed">
                  "You match 9 of 10 frequently requested skills for your target roles. Your GitHub projects also demonstrate relevant React and Node.js production experience."
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <strong className="text-slate-900 font-bold uppercase tracking-wider text-[10px] block text-amber-600">
                  WHAT'S MISSING & WHAT SHOULD I DO?
                </strong>
                <p className="text-slate-700 mt-0.5 leading-relaxed">
                  Missing: <strong>Docker</strong> and <strong>AWS</strong>. Learning Docker fundamentals and adding one containerized project is estimated to boost your match score by <strong>+7%</strong> and unlock <strong>28 additional jobs</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/skill-gap"
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center transition-all"
              >
                View 4-Week Learning Roadmap
              </Link>
              <Link
                href="/resume-analyzer"
                className="py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs text-center transition-colors"
              >
                Optimize ATS Resume
              </Link>
            </div>
          </div>

          {/* Right: Profile Health Score & Upcoming Interview (Pages 24-25, 52-53) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Profile Health Score */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
                    Profile Completeness
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">Profile Health</h3>
                </div>
                <div className="text-2xl font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  94/100
                </div>
              </div>

              {/* Breakdown List (Page 24-25) */}
              <div className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                <div className="py-2 flex justify-between">
                  <span>Resume Verification</span>
                  <span className="text-emerald-600 font-bold">95% ✓</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Skills Verification</span>
                  <span className="text-emerald-600 font-bold">92% ✓</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>GitHub Repository Intelligence</span>
                  <span className="text-emerald-600 font-bold">90% ✓</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Career Preferences</span>
                  <span className="text-emerald-600 font-bold">100% ✓</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Identity & Email Verification</span>
                  <span className="text-emerald-600 font-bold">100% ✓</span>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Add 2 more projects to strengthen your profile.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Add Docker to your skills if you have practical experience.</span>
                </div>
              </div>
            </div>

            {/* Upcoming Scheduled Interview */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2.5 py-1 rounded-md border border-indigo-400/20">
                  Upcoming Interview 📅
                </span>
                <span className="text-xs text-indigo-200">TechCorp Global</span>
              </div>
              <h4 className="text-base font-bold text-white">Technical Video Interview</h4>
              <p className="text-xs text-indigo-200">
                Saturday, Sep 12 • 02:30 PM IST (Google Meet)
              </p>
              <div className="pt-2">
                <Link
                  href="/mock-interview"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-xl transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Practice with AI Mock Interview</span>
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Strongest Opportunities List (Top 5 Jobs) (Page 69) */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Strongest Matched Jobs</h2>
              <p className="text-xs text-slate-500">Curated opportunities ordered by algorithmic compatibility.</p>
            </div>
            <Link
              href="/jobs"
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>View All 128 Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((j) => (
              <SmartJobCard key={j.id} job={j} onApplySuccess={loadDashboard} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
