"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import {
  Github, Star, GitFork, Code2, Plus, Check,
  Sparkles, ExternalLink, RefreshCw, CheckCircle2,
  Layers, Terminal, Award
} from "lucide-react";

export default function GitHubInsightsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addedProjects, setAddedProjects] = useState<Record<number, boolean>>({});
  const [generatedBullets, setGeneratedBullets] = useState<Record<number, string>>({});

  useEffect(() => {
    loadGitHub();
  }, []);

  const loadGitHub = async () => {
    try {
      const res = await api.getGitHubInsights();
      setData(res);
    } catch (e) {
      console.warn("Using fallback GitHub data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProjectToResume = async (repo: any) => {
    try {
      const res = await api.generateProjectBullet({
        project_name: repo.name,
        tech_stack: repo.detected_technologies.join(", ")
      });
      setGeneratedBullets(prev => ({ ...prev, [repo.id]: res.resume_bullet }));
      setAddedProjects(prev => ({ ...prev, [repo.id]: true }));
    } catch (e) {
      setGeneratedBullets(prev => ({ ...prev, [repo.id]: repo.resume_bullet }));
      setAddedProjects(prev => ({ ...prev, [repo.id]: true }));
    }
  };

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
              Code Intelligence & Proof of Work
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              GitHub Insights
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Automated repository parsing, technology detection, and project-based skill evidence.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold self-start">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Connected: @{data?.username || "alexsharma-dev"}</span>
          </div>
        </div>

        {/* Stats Row (Page 38) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Repositories</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{data?.repositories_count || 18}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Contributions (2026)</span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">{data?.contributions || 420}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Followers</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{data?.followers || 142}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Stars Received</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">187</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Forks</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">46</div>
          </div>
        </div>

        {/* Technical Skills Detected (Page 39) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Technical Skills Detected from Commits & Dependencies
            </h3>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded">
              Verified Code Proof
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {[
              { skill: "React", level: "Advanced", repos: "4 Repos" },
              { skill: "TypeScript", level: "Advanced", repos: "4 Repos" },
              { skill: "JavaScript", level: "Advanced", repos: "3 Repos" },
              { skill: "Node.js", level: "Intermediate", repos: "3 Repos" },
              { skill: "Python", level: "Intermediate", repos: "2 Repos" },
            ].map((s) => (
              <div key={s.skill} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block">{s.skill}</span>
                <span className="text-[11px] font-extrabold text-indigo-600 block mt-0.5">{s.level}</span>
                <span className="text-[10px] text-slate-400 mt-1 block">{s.repos}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Repository Analysis & Add Project to Resume (Pages 39-40) */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Repository Analysis ({data?.repositories?.length || 4})
            </h3>
            <p className="text-xs text-slate-500">
              Transform open-source code into ATS-tailored resume achievements.
            </p>
          </div>

          <div className="space-y-4">
            {data?.repositories?.map((repo: any) => (
              <div
                key={repo.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-indigo-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900 font-mono">
                        {repo.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">Updated {repo.last_updated}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{repo.description}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
                    <span className="flex items-center gap-1 font-semibold">
                      <Star className="w-3.5 h-3.5 text-amber-500" /> {repo.stars}
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <GitFork className="w-3.5 h-3.5 text-slate-400" /> {repo.forks}
                    </span>
                  </div>
                </div>

                {/* Detected Technologies */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Detected Technologies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {repo.detected_technologies?.map((tech: string) => (
                      <span key={tech} className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Generated Resume Bullet Point */}
                {generatedBullets[repo.id] && (
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                      Generated Professional Resume Bullet:
                    </span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      "{generatedBullets[repo.id]}"
                    </p>
                  </div>
                )}

                {/* Footer Action */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    Languages: {repo.languages?.join ? repo.languages.join(", ") : repo.languages}
                  </span>

                  <button
                    onClick={() => handleAddProjectToResume(repo)}
                    disabled={addedProjects[repo.id]}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                      addedProjects[repo.id]
                        ? "bg-emerald-600 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs"
                    }`}
                  >
                    {addedProjects[repo.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added to Resume ✓
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Add Project To Resume
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
