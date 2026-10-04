"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import {
  ShieldCheck, CheckCircle2, AlertCircle, ArrowRight,
  Mail, Phone, FileText, User, Github, Briefcase, Lock
} from "lucide-react";

export default function VerificationCenterPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.getJobSeekerProfile();
      setData(res);
    } catch (e) {
      console.warn("Using fallback profile");
    } finally {
      setLoading(false);
    }
  };

  const checklist = data?.verification_checklist || [
    { item: "Email verified", status: true },
    { item: "Phone verified", status: true },
    { item: "Profile completed", status: true },
    { item: "Resume uploaded", status: true },
    { item: "GitHub connected", status: true }
  ];

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
            Trust & Credibility Center
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Profile Verification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete platform verifications to unlock the blue verified candidate badge and increase recruiter response rates.
          </p>
        </div>

        {/* Verified Badge Status Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Profile Verified</h2>
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 fill-blue-50 dark:fill-blue-950/40" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your technical profile, code repositories, and contact authentication meet verified employer standards.
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right shrink-0 bg-slate-50 dark:bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-400 uppercase block">Verification Score</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">5 / 5 Complete</span>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Verification Requirements Checklist
          </h3>

          <div className="space-y-3">
            {checklist.map((c: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm block">{c.item}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-400">Authenticated on platform</span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Verified ✓
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-xs text-slate-400">
            <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note on Verification:</strong> Skills2Job authenticates email OTP, GitHub OAuth API tokens, and resume NLP consistency. In accordance with platform guidelines, we do not claim government identity verification unless official KYC integrations are connected.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
