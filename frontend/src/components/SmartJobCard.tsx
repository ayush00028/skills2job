"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2, MapPin, Briefcase, IndianRupee,
  CheckCircle2, AlertTriangle, ArrowRight, Bookmark,
  Send, Sparkles, Check
} from "lucide-react";
import { api } from "@/lib/api";

interface SmartJobCardProps {
  job: {
    id: number;
    title: string;
    company_name: string;
    company_logo?: string;
    location: string;
    work_type?: string;
    salary_range: string;
    experience_min?: number;
    experience_max?: number;
    compatibility: number;
    match_tier?: string;
    eligibility_status?: string;
    matched_skills?: string[];
    missing_skills?: string[];
    description?: string;
  };
  onApplySuccess?: () => void;
}

export const SmartJobCard: React.FC<SmartJobCardProps> = ({ job, onApplySuccess }) => {
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      await api.applyToJob(job.id, "Applied");
      setApplied(true);
      if (onApplySuccess) onApplySuccess();
    } catch (e) {
      setApplied(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.applyToJob(job.id, "Saved");
      setSaved(!saved);
    } catch (e) {
      setSaved(!saved);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 75) return "text-indigo-700 bg-indigo-50 border-indigo-200";
    if (score >= 60) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-slate-600 bg-slate-100 border-slate-200";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-elevated transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        {/* Header: Company, Logo, Title & Score Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={job.company_logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"}
              alt={job.company_name}
              className="w-12 h-12 rounded-xl object-contain p-1.5 border border-slate-100 bg-slate-50 shadow-2xs group-hover:scale-105 transition-transform"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500">{job.company_name}</p>
            </div>
          </div>

          {/* Compatibility Score */}
          <div className={`px-3 py-1.5 rounded-xl border text-center font-bold text-xs shrink-0 ${getScoreColor(job.compatibility)}`}>
            <div className="text-sm font-extrabold leading-none">{job.compatibility}%</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold">MATCH</div>
          </div>
        </div>

        {/* Location, Salary, Experience Pills */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-4 font-medium">
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
            {job.salary_range}
          </span>
          {job.experience_min !== undefined && (
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              {job.experience_min}–{job.experience_max || 5} yrs
            </span>
          )}
          {job.eligibility_status && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold ${
              job.eligibility_status === 'ELIGIBLE' ? 'bg-emerald-100 text-emerald-800' :
              job.eligibility_status === 'PARTIALLY ELIGIBLE' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {job.eligibility_status}
            </span>
          )}
        </div>

        {/* Matched Skills */}
        <div className="mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Matched Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {job.matched_skills && job.matched_skills.length > 0 ? (
              job.matched_skills.slice(0, 4).map((s, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-lg font-medium border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">Skills matching in progress</span>
            )}
            {job.matched_skills && job.matched_skills.length > 4 && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg font-medium">
                +{job.matched_skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        {job.missing_skills && job.missing_skills.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Missing Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {job.missing_skills.slice(0, 3).map((s, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-xs px-2.5 py-1 rounded-lg font-medium border border-rose-100">
                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        <Link
          href={`/jobs/${job.id}`}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Job & Why</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className={`p-2 rounded-xl border text-xs font-semibold transition-colors ${
              saved ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-500 hover:bg-slate-100 border-slate-200'
            }`}
            title="Save Job"
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-indigo-600' : ''}`} />
          </button>

          <button
            onClick={handleApply}
            disabled={applied || loading}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              applied
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            }`}
          >
            {applied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Applied
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Apply
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
