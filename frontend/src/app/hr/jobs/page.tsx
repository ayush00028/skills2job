"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import {
  Briefcase, PlusCircle, Users, MapPin,
  IndianRupee, CheckCircle2, ArrowRight
} from "lucide-react";

export default function HRJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await api.getHRJobs();
      setJobs(data || []);
    } catch (e) {
      console.warn("Using fallback HR jobs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
              Active Listings
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Company Job Postings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your published positions and view real-time matched candidate pools.
            </p>
          </div>

          <Link
            href="/hr/create-job"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all self-start"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Position</span>
          </Link>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{j.title}</h3>
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] rounded-full border border-emerald-200 dark:border-emerald-800">
                      Active
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{j.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{j.salary_range}</span>
                    <span>•</span>
                    <span>{j.work_type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/hr/candidates?job_id=${j.id}`}
                    className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Ranked Candidates</span>
                  </Link>
                </div>
              </div>

              {/* Skill Tiers Display */}
              <div className="grid sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60">
                  <span className="text-[10px] font-extrabold text-indigo-900 dark:text-indigo-300 uppercase block mb-1">Required Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {j.required_skills?.map((s: string) => (
                      <span key={s} className="bg-white dark:bg-slate-800 text-indigo-950 dark:text-indigo-200 font-semibold px-2 py-0.5 rounded text-[11px] border border-indigo-100 dark:border-indigo-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60">
                  <span className="text-[10px] font-extrabold text-blue-900 dark:text-blue-300 uppercase block mb-1">Preferred Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {j.preferred_skills?.map((s: string) => (
                      <span key={s} className="bg-white dark:bg-slate-800 text-blue-950 dark:text-blue-200 font-semibold px-2 py-0.5 rounded text-[11px] border border-blue-100 dark:border-blue-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
                  <span className="text-[10px] font-extrabold text-emerald-900 dark:text-emerald-300 uppercase block mb-1">Bonus Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {j.bonus_skills?.map((s: string) => (
                      <span key={s} className="bg-white dark:bg-slate-800 text-emerald-950 dark:text-emerald-200 font-semibold px-2 py-0.5 rounded text-[11px] border border-emerald-100 dark:border-emerald-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
