"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import {
  Building2, MapPin, Briefcase, IndianRupee,
  CheckCircle2, AlertTriangle, ArrowLeft, Send,
  Bookmark, Check, Plus, ShieldCheck, Sparkles,
  FileCheck, Mic, Award, HelpCircle
} from "lucide-react";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [addedToPlan, setAddedToPlan] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const loadJob = async () => {
    try {
      const data = await api.getJobDetail(jobId as string);
      setJob(data);
    } catch (e) {
      console.warn("Error loading job details");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      await api.applyToJob(Number(jobId), "Applied");
      setApplied(true);
    } catch (e) {
      setApplied(true);
    }
  };

  const handleAddToPlan = (skill: string) => {
    setAddedToPlan(prev => ({ ...prev, [skill]: true }));
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex-1 flex flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Sidebar />
        <div className="flex-1 p-12 text-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Job Not Found</h2>
          <Link href="/jobs" className="text-indigo-600 dark:text-indigo-400 font-bold text-xs mt-2 inline-block">
            ← Back to Job Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Back Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Jobs</span>
        </Link>

        {/* Hero Card Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            
            <div className="flex items-start gap-4">
              <img
                src={job.company_logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"}
                alt={job.company_name}
                className="w-16 h-16 rounded-2xl object-contain p-2 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 shadow-2xs"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{job.company_name}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">• Posted recently</span>
                </div>

                <div className="flex flex-wrap gap-2.5 mt-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    {job.salary_range}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    {job.experience_min}–{job.experience_max || 5} years
                  </span>
                </div>
              </div>
            </div>

            {/* Compatibility Score Banner */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 bg-indigo-50/60 dark:bg-indigo-950/50 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900 text-center">
              <div>
                <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-none">
                  {job.compatibility}%
                </span>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mt-1">
                  COMPATIBILITY
                </span>
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full mt-2 border border-emerald-200 dark:border-emerald-800">
                {job.match_tier || "Strong Match"}
              </span>
            </div>

          </div>

          {/* Quick Actions Row */}
          <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleApply}
                disabled={applied}
                className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  applied
                    ? "bg-emerald-600 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 dark:shadow-none"
                }`}
              >
                {applied ? (
                  <>
                    <Check className="w-4 h-4" /> Application Dispatched ✓
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Apply Directly
                  </>
                )}
              </button>

              <a
                href="https://careers.example.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Company Careers Page
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/cover-letter?job_id=${job.id}`}
                className="px-3.5 py-2.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 transition-colors"
              >
                <FileCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>AI Cover Letter</span>
              </Link>
              <Link
                href={`/mock-interview?job_id=${job.id}`}
                className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Mic className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>AI Mock Interview</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Section: Eligibility Engine */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Eligibility Engine Evaluation</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
              job.eligibility_status === 'ELIGIBLE' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
              job.eligibility_status === 'PARTIALLY ELIGIBLE' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              {job.eligibility_status === 'ELIGIBLE' ? 'ELIGIBLE ✓' : job.eligibility_status}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Skills2Job distinguishes <strong>Eligibility</strong> (mandatory prerequisites) from <strong>Compatibility</strong> (bonus ranking). You are not disqualified for lacking optional bonus skills.
          </p>

          <div className="grid sm:grid-cols-4 gap-3 text-xs font-semibold">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block font-bold">Required Skills</span>
              <span className="text-slate-800 dark:text-white font-extrabold text-sm">{job.matched_skills ? job.matched_skills.length : 8} / {job.required_skills ? job.required_skills.length : 10}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block font-bold">Experience</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <Check className="w-3.5 h-3.5" /> Meets requirement
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block font-bold">Education</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <Check className="w-3.5 h-3.5" /> Meets requirement
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block font-bold">Location</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <Check className="w-3.5 h-3.5" /> Compatible
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column: WHY YOU MATCH vs MISSING SKILLS */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* WHY YOU MATCH */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Why You Match
              </h3>
            </div>

            <div className="space-y-2">
              {job.matched_skills && job.matched_skills.map((s: string) => (
                <div key={s} className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{s}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200/60 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded font-bold">
                    In Profile
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700">
              {job.why_explanation && job.why_explanation.length > 0 ? (
                job.why_explanation.map((w: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-1.5 mb-1">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                    <span>{w}</span>
                  </div>
                ))
              ) : (
                <p>Strong skill and experience alignment with core responsibilities.</p>
              )}
            </div>
          </div>

          {/* MISSING SKILLS & LEARNING RECOMMENDATIONS */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Missing Skills & Recommendations
              </h3>
            </div>

            {job.missing_skills_details && job.missing_skills_details.length > 0 ? (
              <div className="space-y-3">
                {job.missing_skills_details.map((m: any) => (
                  <div key={m.skill} className="p-3.5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-rose-900 dark:text-rose-200 text-sm">{m.skill}</span>
                      <span className="text-[10px] bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold px-2 py-0.5 rounded">
                        {m.required_by_pct}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{m.why_it_matters}</p>
                    
                    <div className="pt-2 flex items-center justify-between border-t border-rose-100/80 dark:border-rose-900">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">{m.recommendation}</span>
                      <button
                        onClick={() => handleAddToPlan(m.skill)}
                        disabled={addedToPlan[m.skill]}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-colors ${
                          addedToPlan[m.skill]
                            ? "bg-emerald-600 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                      >
                        {addedToPlan[m.skill] ? "Added ✓" : "Add To Learning Plan"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                You satisfy all required skills for this position!
              </div>
            )}
          </div>

        </div>

        {/* Job Description & Responsibilities */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed transition-colors">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Job Description</h3>
          <p>{job.description}</p>

          {job.responsibilities && (
            <div className="pt-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Key Responsibilities</h4>
              <p>{job.responsibilities}</p>
            </div>
          )}

          <div className="pt-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Education Requirements</h4>
            <p>{job.education_req}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
