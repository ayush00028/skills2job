"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import {
  Target, CheckCircle2, AlertTriangle, ArrowRight,
  Sparkles, Calendar, BookOpen, Clock, Check, Plus
} from "lucide-react";

export default function SkillGapPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.getSkillGap();
      setData(res);
      setActivePlan(res.learning_plan || []);
    } catch (e) {
      console.warn("Using fallback skill gap");
    } finally {
      setLoading(false);
    }
  };

  const toggleWeekDone = (idx: number) => {
    const updated = [...activePlan];
    updated[idx].completed = !updated[idx].completed;
    setActivePlan(updated);
  };

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
            Skill Differential Intelligence
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Your Skill Gap & Career Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Know exactly what skills you're missing before you apply, and follow a personalized 4-week project plan.
          </p>
        </div>

        {/* Top Highlight Metric Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-800 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full">
              Growth Impact Forecast
            </span>
            <h3 className="text-lg sm:text-xl font-bold">
              Adding missing skills could increase your eligibility for dozens of additional jobs.
            </h3>
            <p className="text-xs text-indigo-200">
              Targeted upskilling unlocks high-match opportunities with an estimated +13% total score improvement.
            </p>
          </div>

          <div className="text-center shrink-0 bg-white/10 px-5 py-3 rounded-2xl border border-white/10">
            <span className="text-2xl font-extrabold text-emerald-400">+13%</span>
            <span className="text-[10px] uppercase font-bold text-indigo-200 block">Match Boost</span>
          </div>
        </div>

        {/* 2-Column: YOU HAVE vs YOU'RE MISSING */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* YOU HAVE */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                You Have ({data?.you_have?.length || 0})
              </h3>
            </div>

            <div className="space-y-2">
              {data?.you_have?.map((skill: any) => (
                <div key={skill.name} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-xs">
                  <div>
                    <span className="font-bold text-emerald-950 dark:text-emerald-200">{skill.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{skill.source}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-md">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* YOU'RE MISSING WITH PRIORITY */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                You're Missing ({data?.you_are_missing?.length || 0})
              </h3>
            </div>

            <div className="space-y-3">
              {data?.you_are_missing?.map((item: any) => (
                <div key={item.skill} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
                  
                  {/* Skill name & priority badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">{item.skill}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        item.priority === 'HIGH' ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300' :
                        item.priority === 'MEDIUM' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {item.priority} PRIORITY
                      </span>
                    </div>

                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900">
                      {item.potential_match_improvement}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.why_it_matters}</p>

                  {/* Metadata Row: Demand, Levels, Jobs affected */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Demand</span>
                      <strong className="text-slate-800 dark:text-white">{item.demand}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Your Level</span>
                      <strong className="text-rose-600 dark:text-rose-400">{item.current_level}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Jobs Affected</span>
                      <strong className="text-indigo-600 dark:text-indigo-400">{item.matching_jobs_affected} jobs</strong>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Personalized Career Learning Plan */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                Actionable Career Roadmap
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Your Career Learning Plan
              </h2>
            </div>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold px-3 py-1 rounded-xl self-start border border-indigo-100 dark:border-indigo-900">
              Converts Skill Gap into Proof of Competence
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activePlan.map((week, idx) => (
              <div
                key={week.week}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  week.completed
                    ? "bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                    : "bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                      Week {week.week}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleWeekDone(idx)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        week.completed
                          ? "bg-emerald-600 text-white"
                          : "border border-slate-300 dark:border-slate-600 text-slate-300 dark:text-slate-500 hover:border-indigo-600"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{week.title}</h4>
                  
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-3">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{week.estimated_effort}</span>
                    <span>•</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{week.priority}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300">
                    <strong className="block text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">Project Goal:</strong>
                    {week.recommended_project}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 flex justify-between items-center">
                  <span>Status:</span>
                  <span className={week.completed ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-amber-600 dark:text-amber-400"}>
                    {week.completed ? "Completed ✓" : "In Progress"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
