"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  Sparkles, ArrowRight, CheckCircle2, AlertTriangle,
  FileText, Github, Target, Briefcase, Cpu, Layers,
  ChevronRight, Shield, TrendingUp, Zap, Building2, Check,
  Search, BarChart3, Settings
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { switchDemoRole } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-slate-50 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Prop & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-2xs">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Turn Your Skills Into Your Next Opportunity</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Find Jobs That Actually <span className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">Match Your Skills.</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Skills2Job analyzes your resume, GitHub profile, and career preferences to find relevant opportunities, calculate your explainable compatibility score, and pinpoint the exact skills you are missing.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/register"
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 dark:shadow-none flex items-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/jobs"
                className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm shadow-2xs transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Explore Jobs</span>
              </Link>
              <a
                href="#how-it-works"
                className="px-5 py-3.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm transition-colors flex items-center"
              >
                See How It Works
              </a>
            </div>

            {/* Subtle note about Demo / Architecture in Settings */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Settings className="w-3.5 h-3.5 inline mr-1 text-indigo-600 dark:text-indigo-400" />
                Settings Icon
              </span>
              <span>Available in navbar: Technical Architecture & Instant Demo Persona switchers (Job Seeker, HR, Admin).</span>
            </div>
          </div>

          {/* Right Column: Hero Dashboard Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-elevated relative overflow-hidden transition-colors">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    92%
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Career Compatibility</h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strong Match Verified
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900">
                  AI Analyzed
                </span>
              </div>

              {/* Matched Skills 9/10 */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Matched Skills</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">9 / 10 (90%)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["React", "JavaScript", "Node.js", "Python", "SQL", "Git", "REST APIs"].map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Missing Skills:</span>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Docker
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> AWS
                    </span>
                  </div>
                </div>

                {/* Recommended Jobs Mini Cards */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                    Recommended Jobs:
                  </span>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Full Stack Developer</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Google • Bangalore • ₹16L-₹28L</div>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">94%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Software Engineer</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Atlassian • Remote • ₹14L-₹22L</div>
                      </div>
                      <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">91%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Visual Pipeline Section */}
      <section className="py-14 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Explainable AI Intelligence
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              The Skills2Job Matchmaking Pipeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            
            {/* Stage 1: Ingestion */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-center transition-colors">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-2 font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">1. Candidate Signals</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Resume + GitHub Repos + Career Preferences</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-300 dark:text-slate-600">
              <ChevronRight className="w-6 h-6" />
            </div>

            {/* Stage 2: AI Matching */}
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-center shadow-xs transition-colors">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2 font-bold shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200">2. AI Matching Engine</div>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-1">5-Factor Scorer + Vector Cosine Similarity</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-300 dark:text-slate-600">
              <ChevronRight className="w-6 h-6" />
            </div>

            {/* Stage 3: Output */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-center transition-colors">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2 font-bold">
                <Target className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">3. Actionable Outcomes</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Compatibility Score + Skill Gap + Learning Plan</p>
            </div>

          </div>
        </div>
      </section>

      {/* Trust / Value Section: Stop Applying Blindly */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 block">
            Why Skills2Job?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Stop Applying Blindly.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-3 text-sm sm:text-base">
            Blindly submitting hundreds of resumes leads to algorithmic rejection. Get transparent intelligence before you hit apply.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1: ATS */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-elevated transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-5">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">ATS Optimization</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Understand whether your resume contains the exact skills and keywords employers and applicant tracking systems are screening for.
            </p>
          </div>

          {/* Card 2: Skill Gap */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-elevated transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Skill Gap Detection</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Know exactly what you are missing before you apply. Receive actionable 4-week learning roadmaps to unlock dozens of matching jobs.
            </p>
          </div>

          {/* Card 3: Explainable Match */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-elevated transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Job Matching</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Find opportunities ranked by how well you actually match across skills, experience, education, projects, and ATS semantic vectors.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works Visual Timeline */}
      <section id="how-it-works" className="py-20 bg-slate-100/70 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 block">
              5-Step Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How Skills2Job Works
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-2">Step 1</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Upload Resume</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">PDF text extraction, NLP skill parsing, and experience verification.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-2">Step 2</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Connect GitHub</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Automatic repository inspection and technical project evidence generation.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-2">Step 3</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Set Preferences</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Select desired role, work type (Remote/Hybrid), and compensation targets.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-2">Step 4</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">AI Matches Profile</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Evaluates Required vs Preferred skills with transparent 5-factor scoring.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-2">Step 5</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Apply With Confidence</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Track applications via Kanban, generate tailored cover letters, and prepare.</p>
            </div>

          </div>

          <div className="mt-14 text-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <span>Start Your Career Match</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">Skills2Job Platform</span>
            <span>• Turn Your Skills Into Your Next Opportunity</span>
          </div>
          <div className="flex gap-6 text-slate-600 dark:text-slate-400 font-medium">
            <Link href="/viva" className="hover:text-indigo-600 dark:hover:text-indigo-400">Viva & Architecture</Link>
            <Link href="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400">Jobs</Link>
            <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">Job Seeker</Link>
            <Link href="/hr/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">Recruiter</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
