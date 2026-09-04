"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  LayoutDashboard, Search, Sparkles, FileText,
  Target, Github, Kanban, TrendingUp, Mic,
  FileCheck, ShieldCheck, UserCheck, Settings,
  Briefcase, PlusCircle, Users, Calendar, Award
} from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const isHR = user?.role === "HR";

  const seekerLinks = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Find Jobs", href: "/jobs", icon: Search },
    { label: "My Matches", href: "/matches", icon: Sparkles },
    { label: "Resume Analyzer", href: "/resume-analyzer", icon: FileText },
    { label: "Skill Gap & Roadmap", href: "/skill-gap", icon: Target },
    { label: "GitHub Insights", href: "/github-insights", icon: Github },
    { label: "Applications Tracker", href: "/applications", icon: Kanban },
    { label: "Career Insights", href: "/career-insights", icon: TrendingUp },
    { label: "AI Mock Interview", href: "/mock-interview", icon: Mic },
    { label: "AI Cover Letters", href: "/cover-letter", icon: FileCheck },
    { label: "Verification Center", href: "/verification", icon: ShieldCheck },
    { label: "Profile", href: "/profile", icon: UserCheck },
  ];

  const hrLinks = [
    { label: "HR Overview", href: "/hr/dashboard", icon: LayoutDashboard },
    { label: "Create Job", href: "/hr/create-job", icon: PlusCircle },
    { label: "Active Jobs", href: "/hr/jobs", icon: Briefcase },
    { label: "Candidate Search", href: "/hr/candidates", icon: Users },
    { label: "Interviews", href: "/hr/interviews", icon: Calendar },
    { label: "Company Profile", href: "/hr/profile", icon: BuildingIcon },
  ];

  const links = isHR ? hrLinks : seekerLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16">
      
      {/* Role Indicator Banner */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
            isHR ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {isHR ? 'HR' : 'JS'}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800">
              {isHR ? 'HR Recruiter Portal' : 'Job Seeker Portal'}
            </span>
            <span className="text-[11px] text-slate-400">
              {isHR ? 'TechCorp Global' : 'Alex Sharma'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/hr/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-100 text-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">AI Vector Engine</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            Online
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">5-Factor explainable matching & vector similarity active.</p>
      </div>
    </aside>
  );
};

function BuildingIcon(props: any) {
  return <Briefcase {...props} />;
}
