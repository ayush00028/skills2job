"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import {
  Building2, PlusCircle, Users, Briefcase,
  Calendar, CheckCircle2, ArrowRight, Sparkles,
  ShieldCheck, Award, MessageSquare, Send
} from "lucide-react";

export default function HRDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHRData();
  }, []);

  const loadHRData = async () => {
    try {
      const [st, jbs, cnds] = await Promise.all([
        api.getHRStats(),
        api.getHRJobs(),
        api.getCandidates({ limit: 5 })
      ]);
      setStats(st);
      setJobs(jbs || []);
      setCandidates(cnds.candidates ? cnds.candidates.slice(0, 5) : []);
    } catch (e) {
      console.warn("Using fallback HR dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Recruiter Verified Header */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"
              alt="TechCorp"
              className="w-14 h-14 rounded-2xl object-cover p-1 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  TechCorp Global
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Verified Recruiter ✓
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Recruiter: <strong>Sarah Jenkins</strong> • Lead Technical Talent Partner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/hr/create-job"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Job</span>
            </Link>
          </div>
        </div>

        {/* 5 HR KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Active Jobs</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">3</div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Engineering roles</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Total Applicants</span>
            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">15</div>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded mt-1 inline-block border border-indigo-100 dark:border-indigo-900">
              AI Ranked
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Shortlisted</span>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">5</div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Ready for review</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Interviews</span>
            <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">2</div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Scheduled this week</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1 transition-colors">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Offers Extended</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">1</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded mt-1 inline-block border border-emerald-100 dark:border-emerald-900">
              Accepted
            </span>
          </div>
        </div>

        {/* Top Candidates Ranked by Compatibility */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                AI Candidate Matching
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Best Matching Candidates
              </h2>
            </div>
            <Link
              href="/hr/candidates"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All 15 Candidates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {candidates.map((c, idx) => (
              <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/50 p-3 rounded-2xl transition-colors">
                
                <div className="flex items-start gap-3.5">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{c.name}</h4>
                      <span className="text-xs text-slate-400 dark:text-slate-500">• {c.experience}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">• {c.location}</span>
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{c.headline}</p>

                    {/* Matched Skills */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {c.skills?.slice(0, 5).map((s: string) => (
                        <span key={s} className="text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900">
                          ✓ {s}
                        </span>
                      ))}
                      {c.missing?.slice(0, 1).map((m: string) => (
                        <span key={m} className="text-[11px] bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-semibold px-2 py-0.5 rounded border border-rose-100 dark:border-rose-900">
                          ⚠ Missing: {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-none">{c.compatibility}%</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mt-0.5">Compatibility</span>
                  </div>

                  <Link
                    href={`/hr/candidates?selected=${c.name}`}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Review Profile
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Active Jobs Quick List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Your Active Job Postings</h3>
            <Link href="/hr/jobs" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Manage All Jobs →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {jobs.map((j) => (
              <div key={j.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{j.title}</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {j.location} • {j.salary_range}
                </div>
                <div className="pt-2 flex justify-between items-center text-xs font-bold">
                  <span className="text-indigo-600 dark:text-indigo-400">{j.applicants_count} applicants</span>
                  <Link href={`/hr/candidates?job_id=${j.id}`} className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                    Match Candidates →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
