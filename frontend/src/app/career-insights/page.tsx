"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import {
  TrendingUp, BarChart3, Target, Award,
  Sparkles, Briefcase, CheckCircle2, AlertTriangle
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

export default function CareerInsightsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const res = await api.getCareerInsights();
      setData(res);
    } catch (e) {
      console.warn("Failed loading career insights");
    } finally {
      setLoading(false);
    }
  };

  const trendData = data?.compatibility_trend || [
    { month: "Nov", score: 68 },
    { month: "Dec", score: 74 },
    { month: "Jan", score: 79 },
    { month: "Feb", score: 83 },
    { month: "Mar", score: 87 }
  ];

  const skillData = data?.skill_demand_market || [
    { skill: "React", demand_pct: 92, in_profile: true },
    { skill: "Node.js", demand_pct: 86, in_profile: true },
    { skill: "Docker", demand_pct: 82, in_profile: false },
    { skill: "AWS", demand_pct: 78, in_profile: false },
    { skill: "Python", demand_pct: 75, in_profile: true },
    { skill: "Kubernetes", demand_pct: 65, in_profile: false }
  ];

  const funnelData = data?.application_funnel || [
    { stage: "Saved", count: 22 },
    { stage: "Applied", count: 12 },
    { stage: "Assessment", count: 6 },
    { stage: "Interview", count: 3 },
    { stage: "Offer", count: 1 }
  ];

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
            Data-Driven Career Telemetry
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Career Insights & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visualize your career readiness, compatibility velocity, and market demand trends.
          </p>
        </div>

        {/* Overview Visualization Row (Page 68) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                Overview Telemetry
              </span>
              <h2 className="text-lg font-extrabold text-slate-900">Your Career Profile</h2>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              High Readiness Index
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-2xl font-extrabold text-indigo-600">94%</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mt-0.5">Profile Strength</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-2xl font-extrabold text-indigo-600">87%</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mt-0.5">Career Readiness</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-2xl font-extrabold text-indigo-600">82%</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mt-0.5">Avg Job Match</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-2xl font-extrabold text-slate-900">12</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mt-0.5">Applications</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-2xl font-extrabold text-purple-600">3</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mt-0.5">Interviews</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-2xl font-extrabold text-emerald-600">1</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mt-0.5">Offers</span>
            </div>
          </div>
        </div>

        {/* 2-Column Charts (Page 46) */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Compatibility Trend Over Time */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Compatibility Trend
                </h3>
                <p className="text-xs text-slate-400">Monthly progression as skills & projects were added</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                +19% Growth
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: "#4f46e5", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Skill Demand Market Distribution */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Market Skill Demand %
                </h3>
                <p className="text-xs text-slate-400">Blue = in your profile • Amber = missing skill gap</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillData} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="skill" tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                  />
                  <Bar dataKey="demand_pct" radius={[0, 8, 8, 0]}>
                    {skillData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.in_profile ? "#4f46e5" : "#f59e0b"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Application Funnel Chart & Best Roles (Pages 46, 68-69) */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Application Funnel (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Application Pipeline Funnel
              </h3>
              <span className="text-xs text-slate-400 font-semibold">Conversion Rate: 8.3%</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="stage" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Best Matching Roles (5 cols) (Page 46) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Best Matching Roles
            </h3>

            <div className="space-y-2.5 pt-1">
              {data?.best_matching_roles?.map((role: any) => (
                <div key={role.role} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-slate-900 font-bold block">{role.role}</strong>
                    <span className="text-[11px] text-slate-400">{role.openings} matching openings</span>
                  </div>
                  <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100">
                    {role.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
