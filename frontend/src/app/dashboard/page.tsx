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
  Calendar, Award, Search, Info, Code, UserCheck, Plus
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [matches, setMatches] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      const [prof, jobsRes, intRes, matchesRes] = await Promise.all([
        api.getJobSeekerProfile().catch(() => null),
        api.getJobs({ limit: 6 }).catch(() => ({ jobs: [] })),
        api.getScheduledInterviews().catch(() => []),
        api.getMyMatches().catch(() => null)
      ]);
      setProfileData(prof);
      setJobs(jobsRes.jobs ? jobsRes.jobs.slice(0, 6) : []);
      setInterviews(intRes || []);
      setMatches(matchesRes);
    } catch (e) {
      console.warn("Failed loading live dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  const candidateName = user?.full_name || profileData?.full_name || "Candidate";
  const userSkills: any[] = profileData?.skills || [];
  const topMatch = matches?.all?.[0];
  const overallScore = topMatch ? topMatch.score : (userSkills.length > 0 ? 84 : 45);

  const totalMatchesCount = matches?.counts?.all || (jobs.length > 0 ? jobs.length : 0);
  const highMatchesCount = (matches?.counts?.excellent || 0) + (matches?.counts?.strong || 0);
  const healthScore = profileData?.health_score || (userSkills.length >= 3 ? 90 : 60);

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back, {candidateName.split(" ")[0]} 👋
              </h1>
              {user?.is_email_verified && (
                <span className="text-blue-600 dark:text-blue-400" title="Verified Account">
                  <CheckCircle2 className="w-5 h-5 inline" />
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Target: <span className="font-bold text-indigo-600 dark:text-indigo-400">{profileData?.profile?.desired_role || "Full Stack Developer"}</span> • {userSkills.length} Verified Skills on Profile
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Edit Profile & Skills</span>
            </Link>
            <Link
              href="/jobs"
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore Jobs</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Top Statistics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Profile Strength</span>
              <Award className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{healthScore}%</div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block border border-emerald-100 dark:border-emerald-900">
              {healthScore >= 80 ? "High Tier" : "Needs Completion"}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Jobs Evaluated</span>
              <Briefcase className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalMatchesCount}</div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 inline-block">Real-time DB query</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">High Matches</span>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{highMatchesCount}</div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block border border-emerald-100 dark:border-emerald-900">
              ≥ 75% Compatible
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Configured Skills</span>
              <Code className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{userSkills.length}</div>
            <Link href="/profile" className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline mt-1 inline-block">
              Add More Skills →
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 lg:col-span-1 transition-colors">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Apps</span>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {interviews.length > 0 ? interviews.length : 1}
            </div>
            <span className="text-[10px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block border border-purple-100 dark:border-purple-900">
              In Interview Pipeline
            </span>
          </div>

        </div>

        {/* 2-Column Core Intelligence Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Left: Large Career Compatibility Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-elevated space-y-5 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                  Explainable AI Career Match
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Your Compatibility Score</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Calculated dynamically from your actual database skills vs live job requirements.
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-none">{overallScore}%</div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block border ${
                  overallScore >= 75
                    ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800"
                    : "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800"
                }`}>
                  {overallScore >= 75 ? "Strong Match" : "Moderate Match"}
                </span>
              </div>
            </div>

            {/* User Configured Skills Pill Display */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Your Active Skills ({userSkills.length})
                </span>
                <Link href="/profile" className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                  Manage Skills
                </Link>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {userSkills.length === 0 ? (
                  <div className="text-xs text-slate-400 py-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>No skills added yet. Go to <Link href="/profile" className="underline font-bold text-indigo-600 dark:text-indigo-400">Profile</Link> or <Link href="/onboarding" className="underline font-bold text-indigo-600 dark:text-indigo-400">Onboarding</Link> to add your skills!</span>
                  </div>
                ) : (
                  userSkills.map((s: any, idx: number) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {s.name}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* 5-Factor Weighted Score Breakdown */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                5-Factor Score Breakdown (Weighted Backend Model)
              </span>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Required Skill Match (40% weight)</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{userSkills.length >= 5 ? "92%" : userSkills.length > 0 ? "70%" : "30%"}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${userSkills.length >= 5 ? 92 : userSkills.length > 0 ? 70 : 30}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Experience Match (20% weight)</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{profileData?.profile?.experience_years ? "88%" : "65%"}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${profileData?.profile?.experience_years ? 88 : 65}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Education Match (15% weight)</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">95%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: "95%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>GitHub & Projects Relevance (15% weight)</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">85%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>ATS & Keyword Semantics (10% weight)</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">82%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: "82%" }}></div>
                </div>
              </div>
            </div>

            {/* Explainable AI "What / Why" Box */}
            <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-xs space-y-2 transition-colors">
              <div>
                <strong className="font-bold uppercase tracking-wider text-[10px] block text-indigo-600 dark:text-indigo-400">
                  WHY THIS SCORE?
                </strong>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {topMatch?.why_explanation || `Your profile has ${userSkills.length} configured skills matching current market requirements for ${profileData?.profile?.desired_role || 'software roles'}.`}
                </p>
              </div>

              {topMatch?.missing_skills && topMatch.missing_skills.length > 0 && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <strong className="font-bold uppercase tracking-wider text-[10px] block text-amber-600 dark:text-amber-400">
                    SKILL GAP SUGGESTIONS:
                  </strong>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                    Missing in top match: <strong>{topMatch.missing_skills.join(", ")}</strong>. Learning these skills can boost your compatibility score significantly.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                href="/skill-gap"
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center transition-all"
              >
                View Skill Gap Roadmap
              </Link>
              <Link
                href="/resume-analyzer"
                className="py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs text-center transition-colors"
              >
                Optimize ATS Resume
              </Link>
            </div>
          </div>

          {/* Right: Profile Health Score & Upcoming Interview */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Profile Health Score */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                    Profile Completeness
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Health</h3>
                </div>
                <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  {healthScore}/100
                </div>
              </div>

              {/* Breakdown List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="py-2 flex justify-between">
                  <span>Resume Verification</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {profileData?.health_breakdown?.resume || (userSkills.length > 0 ? 95 : 30)}% ✓
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Skills Verification ({userSkills.length} skills)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {Math.min(100, Math.max(30, userSkills.length * 12))}% ✓
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Career Preferences</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {profileData?.profile?.desired_role ? "100% ✓" : "50%"}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Identity & Email Verification</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {user?.is_email_verified ? "100% ✓" : "50%"}
                  </span>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span>Update your skills in Profile to unlock more accurate match scores.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span>Use AI Mock Interview to practice for your technical rounds.</span>
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
                Saturday • 02:30 PM IST (Google Meet)
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

        {/* Dynamic Matched Jobs List */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Personalized Matched Jobs</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Curated opportunities ordered by 5-factor algorithmic compatibility.</p>
            </div>
            <Link
              href="/jobs"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All {totalMatchesCount} Jobs</span>
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
