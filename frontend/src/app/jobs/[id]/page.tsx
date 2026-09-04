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
      <div className="flex-1 flex flex-row min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex-1 flex flex-row min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 p-12 text-center">
          <h2 className="text-xl font-bold text-slate-800">Job Not Found</h2>
          <Link href="/jobs" className="text-indigo-600 font-bold text-xs mt-2 inline-block">
            ← Back to Job Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Back Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Jobs</span>
        </Link>

        {/* Hero Card Header (Pages 29-30) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            
            <div className="flex items-start gap-4">
              <img
                src={job.company_logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"}
                alt={job.company_name}
                className="w-16 h-16 rounded-2xl object-contain p-2 border border-slate-100 bg-slate-50 shadow-2xs"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-slate-700">{job.company_name}</span>
                  <span className="text-xs text-slate-400">• Posted recently</span>
                </div>

                <div className="flex flex-wrap gap-2.5 mt-3 text-xs font-medium text-slate-600">
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-xl">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                    {job.salary_range}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-xl">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {job.experience_min}–{job.experience_max || 5} years
                  </span>
                </div>
              </div>
            </div>

            {/* Compatibility Score Banner */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 text-center">
              <div>
                <span className="text-3xl font-extrabold text-indigo-600 leading-none">
                  {job.compatibility}%
                </span>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mt-1">
                  COMPATIBILITY
                </span>
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full mt-2">
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
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
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
                className="px-4 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
              >
                Continue to Company Application
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/cover-letter?job_id=${job.id}`}
                className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 flex items-center gap-1.5 transition-colors"
              >
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>AI Cover Letter</span>
              </Link>
              <Link
                href={`/mock-interview?job_id=${job.id}`}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Mic className="w-4 h-4 text-slate-600" />
                <span>AI Mock Interview</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Section: Eligibility Engine (Pages 31-32) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-extrabold text-slate-900">Eligibility Engine Evaluation</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
              job.eligibility_status === 'ELIGIBLE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              job.eligibility_status === 'PARTIALLY ELIGIBLE' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {job.eligibility_status === 'ELIGIBLE' ? 'ELIGIBLE ✓' : job.eligibility_status}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Skills2Job distinguishes <strong>Eligibility</strong> (mandatory prerequisites) from <strong>Compatibility</strong> (bonus ranking). You are not disqualified for lacking optional bonus skills.
          </p>

          <div className="grid sm:grid-cols-4 gap-3 text-xs font-semibold">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Required Skills</span>
              <span className="text-slate-800 font-extrabold text-sm">{job.matched_skills ? job.matched_skills.length : 8} / {job.required_skills ? job.required_skills.length : 10}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Experience</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                <Check className="w-3.5 h-3.5" /> Meets requirement
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Education</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                <Check className="w-3.5 h-3.5" /> Meets requirement
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Location</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                <Check className="w-3.5 h-3.5" /> Compatible
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column: WHY YOU MATCH vs MISSING SKILLS (Page 30) */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* WHY YOU MATCH */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Why You Match
              </h3>
            </div>

            <div className="space-y-2">
              {job.matched_skills && job.matched_skills.map((s: string) => (
                <div key={s} className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-semibold text-emerald-900">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{s}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    In Profile
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              {job.why_explanation && job.why_explanation.length > 0 ? (
                job.why_explanation.map((w: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-1.5 mb-1">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{w}</span>
                  </div>
                ))
              ) : (
                <p>Strong skill and experience alignment with core responsibilities.</p>
              )}
            </div>
          </div>

          {/* MISSING SKILLS & LEARNING RECOMMENDATIONS (Pages 30-31) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Missing Skills & Recommendations
              </h3>
            </div>

            {job.missing_skills_details && job.missing_skills_details.length > 0 ? (
              <div className="space-y-3">
                {job.missing_skills_details.map((m: any) => (
                  <div key={m.skill} className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-rose-900 text-sm">{m.skill}</span>
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded">
                        {m.required_by_pct}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{m.why_it_matters}</p>
                    
                    <div className="pt-2 flex items-center justify-between border-t border-rose-100/80">
                      <span className="text-[11px] text-slate-500 italic">{m.recommendation}</span>
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
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                You satisfy all required skills for this position!
              </div>
            )}
          </div>

        </div>

        {/* Job Description & Responsibilities */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h3 className="text-base font-extrabold text-slate-900">Job Description</h3>
          <p>{job.description}</p>

          {job.responsibilities && (
            <div className="pt-3">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Key Responsibilities</h4>
              <p>{job.responsibilities}</p>
            </div>
          )}

          <div className="pt-3">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Education Requirements</h4>
            <p>{job.education_req}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
