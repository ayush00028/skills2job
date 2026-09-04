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
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
              Active Listings
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Company Job Postings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
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
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900">{j.title}</h3>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
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
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Ranked Candidates</span>
                  </Link>
                </div>
              </div>

              {/* Skill Tiers Display (Pages 48-49) */}
              <div className="grid sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <span className="text-[10px] font-extrabold text-indigo-900 uppercase block mb-1">Required Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {j.required_skills?.map((s: string) => (
                      <span key={s} className="bg-white text-indigo-950 font-semibold px-2 py-0.5 rounded text-[11px] border border-indigo-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                  <span className="text-[10px] font-extrabold text-blue-900 uppercase block mb-1">Preferred Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {j.preferred_skills?.map((s: string) => (
                      <span key={s} className="bg-white text-blue-950 font-semibold px-2 py-0.5 rounded text-[11px] border border-blue-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-extrabold text-emerald-900 uppercase block mb-1">Bonus Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {j.bonus_skills?.map((s: string) => (
                      <span key={s} className="bg-white text-emerald-950 font-semibold px-2 py-0.5 rounded text-[11px] border border-emerald-100">
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
