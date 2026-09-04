"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import {
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  Bookmark, MapPin, IndianRupee, Send, Check
} from "lucide-react";

export default function MatchesPage() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"all" | "excellent" | "strong" | "potential" | "low">("all");
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const res = await api.getMyMatches();
      setData(res);
    } catch (e) {
      console.warn("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: number) => {
    try {
      await api.applyToJob(jobId, "Applied");
      setAppliedJobs(prev => ({ ...prev, [jobId]: true }));
    } catch (e) {
      setAppliedJobs(prev => ({ ...prev, [jobId]: true }));
    }
  };

  const currentList = data ? (data[activeTab] || []) : [];

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
            Algorithmically Ranked Roles
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Matches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Jobs segmented by compatibility tiers (90-100% Excellent, 75-89% Strong, 60-74% Potential, &lt;60% Low).
          </p>
        </div>

        {/* Tier Tabs (Page 40) */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          {[
            { id: "all", label: "All Opportunities", count: data?.counts?.all || 0 },
            { id: "excellent", label: "Excellent Match (90–100%)", count: data?.counts?.excellent || 0 },
            { id: "strong", label: "Strong Match (75–89%)", count: data?.counts?.strong || 0 },
            { id: "potential", label: "Potential Match (60–74%)", count: data?.counts?.potential || 0 },
            { id: "low", label: "Low Match (<60%)", count: data?.counts?.low || 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Matches List (Page 41) */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 font-semibold">Calculating vector similarity tiers...</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-2">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matches in this tier</h3>
            <p className="text-xs text-slate-500">Explore other tiers or expand your skills.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {currentList.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 hover:shadow-elevated transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left info */}
                <div className="flex items-start gap-4">
                  <img
                    src={item.company_logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"}
                    alt={item.company_name}
                    className="w-12 h-12 rounded-xl object-contain p-1 border border-slate-100 bg-slate-50 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/jobs/${item.id}`} className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                        {item.title}
                      </Link>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        item.score >= 90 ? "bg-emerald-100 text-emerald-800" :
                        item.score >= 75 ? "bg-indigo-100 text-indigo-800" :
                        item.score >= 60 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                      }`}>
                        {item.match_tier}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="font-bold text-slate-700">{item.company_name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{item.location}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{item.salary}</span>
                    </div>

                    {/* Matched / Missing inline pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {item.matched_skills && item.matched_skills.slice(0, 4).map((s: string) => (
                        <span key={s} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {s}
                        </span>
                      ))}
                      {item.missing_skills && item.missing_skills.slice(0, 2).map((s: string) => (
                        <span key={s} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100">
                          <AlertTriangle className="w-3 h-3 text-rose-500" /> {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right score and action buttons */}
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-center md:text-right">
                    <div className="text-2xl font-extrabold text-indigo-600 leading-none">{item.score}%</div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Match Score</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/jobs/${item.id}`}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      Why You Match
                    </Link>

                    <button
                      onClick={() => handleApply(item.id)}
                      disabled={appliedJobs[item.id]}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        appliedJobs[item.id]
                          ? "bg-emerald-600 text-white"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                      }`}
                    >
                      {appliedJobs[item.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Applied
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> Apply
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
