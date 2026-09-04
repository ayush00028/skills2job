"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import { User, Building2, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function RoleSelectPage() {
  const router = useRouter();
  const { user, switchDemoRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"JOB_SEEKER" | "HR">("JOB_SEEKER");
  const [loading, setLoading] = useState(false);

  const handleContinue = async (role: "JOB_SEEKER" | "HR") => {
    setLoading(true);
    try {
      if (user?.email) {
        await api.selectRole({ email: user.email, role });
      }
      await switchDemoRole(role);
      if (role === "JOB_SEEKER") {
        router.push("/onboarding");
      } else {
        router.push("/hr/dashboard");
      }
    } catch (e) {
      await switchDemoRole(role);
      router.push(role === "JOB_SEEKER" ? "/onboarding" : "/hr/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-indigo-50/40">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 p-8 shadow-elevated text-center">
        
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2 block">
            Step 2 of Onboarding
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">
            How do you want to use Skills2Job?
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Select your primary objective so we can customize your AI workspace.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
          
          {/* Card 1: Job Seeker */}
          <div
            onClick={() => setSelectedRole("JOB_SEEKER")}
            className={`cursor-pointer rounded-2xl border-2 p-6 transition-all relative ${
              selectedRole === "JOB_SEEKER"
                ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-4 ring-indigo-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            {selectedRole === "JOB_SEEKER" && (
              <div className="absolute top-4 right-4 text-indigo-600">
                <CheckCircle2 className="w-6 h-6 fill-indigo-600 text-white" />
              </div>
            )}
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">JOB SEEKER</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Find jobs that match your skills and career goals. Get explainable ATS compatibility, skill-gap analysis, and tailored learning plans.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-200/60">
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                Candidate Experience <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: HR / Recruiter */}
          <div
            onClick={() => setSelectedRole("HR")}
            className={`cursor-pointer rounded-2xl border-2 p-6 transition-all relative ${
              selectedRole === "HR"
                ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-4 ring-indigo-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            {selectedRole === "HR" && (
              <div className="absolute top-4 right-4 text-indigo-600">
                <CheckCircle2 className="w-6 h-6 fill-indigo-600 text-white" />
              </div>
            )}
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">HR / RECRUITER</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Find the best candidates for your open positions. Post jobs with separated Required vs Preferred skills and rank applicants by compatibility.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-200/60">
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                Hiring Partner Experience <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>

        <button
          onClick={() => handleContinue(selectedRole)}
          disabled={loading}
          className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
        >
          <span>{selectedRole === "JOB_SEEKER" ? "Continue as Job Seeker" : "Continue as HR"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
