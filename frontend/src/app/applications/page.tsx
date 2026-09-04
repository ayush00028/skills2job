"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import {
  Kanban, TrendingUp, CheckCircle2, Clock,
  ArrowRight, Building2, MapPin, IndianRupee,
  MoreVertical, MoveRight, Award, Send
} from "lucide-react";

export default function ApplicationsPage() {
  const [columns, setColumns] = useState<Record<string, any[]>>({
    Saved: [],
    Applied: [],
    Assessment: [],
    Interview: [],
    Offer: [],
    Rejected: []
  });
  const [analytics, setAnalytics] = useState<any>({
    total_applications: 12,
    interviews: 3,
    offers: 1,
    response_rate: "25%"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.getApplications();
      if (res.columns) setColumns(res.columns);
      if (res.analytics) setAnalytics(res.analytics);
    } catch (e) {
      console.warn("Using fallback applications");
    } finally {
      setLoading(false);
    }
  };

  const handleMoveStage = async (cardId: number, currentStage: string, nextStage: string) => {
    // Optimistic UI update
    const card = columns[currentStage]?.find((c) => c.id === cardId);
    if (!card) return;

    const newCols = { ...columns };
    newCols[currentStage] = newCols[currentStage].filter((c) => c.id !== cardId);
    newCols[nextStage] = [...(newCols[nextStage] || []), { ...card, status: nextStage }];
    setColumns(newCols);

    try {
      await api.updateApplicationStatus(cardId, nextStage);
    } catch (e) {
      // rollback or refresh
      loadApplications();
    }
  };

  const STAGES = ["Saved", "Applied", "Assessment", "Interview", "Offer", "Rejected"];

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
            Job Search Pipeline
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track and progress your job applications across live hiring stages.
          </p>
        </div>

        {/* Analytics Header (Page 42) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Applications</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{analytics.total_applications}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Interviews Secured</span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">{analytics.interviews}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Job Offers</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{analytics.offers}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Response Rate</span>
            <div className="text-2xl font-extrabold text-purple-600 mt-1">{analytics.response_rate}</div>
          </div>
        </div>

        {/* Kanban Board Container (Pages 41-42) */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1100px]">
            {STAGES.map((stage) => {
              const items = columns[stage] || [];
              const stageColors: Record<string, string> = {
                Saved: "border-slate-300 bg-slate-100/70 text-slate-700",
                Applied: "border-blue-300 bg-blue-50/70 text-blue-800",
                Assessment: "border-amber-300 bg-amber-50/70 text-amber-800",
                Interview: "border-purple-300 bg-purple-50/70 text-purple-800",
                Offer: "border-emerald-300 bg-emerald-50/70 text-emerald-800",
                Rejected: "border-rose-300 bg-rose-50/70 text-rose-800",
              };

              return (
                <div key={stage} className="flex-1 bg-slate-100/80 rounded-3xl p-3.5 border border-slate-200 min-w-[260px] flex flex-col max-h-[75vh]">
                  
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-2 py-1.5 mb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      {stage}
                    </span>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${stageColors[stage]}`}>
                      {items.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {items.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                        No applications in {stage}
                      </div>
                    ) : (
                      items.map((card) => (
                        <div
                          key={card.id}
                          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-indigo-300 hover:shadow-elevated transition-all space-y-3"
                        >
                          {/* Card Header: Company, Logo, Score */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={card.company_logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"}
                                alt={card.company_name}
                                className="w-8 h-8 rounded-lg object-contain p-0.5 border border-slate-100 bg-slate-50"
                              />
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{card.title}</h4>
                                <span className="text-[10px] text-slate-500 font-semibold">{card.company_name}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md shrink-0">
                              {card.compatibility}%
                            </span>
                          </div>

                          {/* Notes */}
                          {card.notes && (
                            <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                              "{card.notes}"
                            </p>
                          )}

                          {/* Card Footer: Date & Move Stage Dropdown */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                            <span>{card.applied_date}</span>

                            <div className="flex items-center gap-1">
                              <select
                                value={card.status}
                                onChange={(e) => handleMoveStage(card.id, card.status, e.target.value)}
                                className="text-[10px] font-bold bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none"
                              >
                                {STAGES.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                        </div>
                      ))
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
