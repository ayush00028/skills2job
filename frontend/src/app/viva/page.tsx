"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText, Cpu, Sparkles, ArrowRight, ArrowDown,
  Layers, Database, CheckCircle2, Target, Award,
  Terminal, ShieldCheck, Zap, Code2, Search
} from "lucide-react";

export default function VivaPresentationPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const resumePipeline = [
    { title: "USER RESUME", desc: "PDF / Word upload containing unstructured candidate credentials.", tech: "pdfplumber / PyMuPDF" },
    { title: "TEXT EXTRACTION", desc: "Normalized raw character stream sanitized from layout artifacts.", tech: "Regex & Text Heuristics" },
    { title: "SPACY / NLP PARSING", desc: "Named entity recognition (NER) mapping tokens to tech taxonomies.", tech: "spaCy NLP & Pattern Matchers" },
    { title: "SKILL EXTRACTION", desc: "Parsed skills + experience years + project highlights mapped to JSON.", tech: "JSON Schema Structuring" },
    { title: "CANDIDATE EMBEDDING", desc: "Dense vector representations generated from normalized skill profile.", tech: "Sentence Transformers (384-dim)" }
  ];

  const jobPipeline = [
    { title: "JOB DESCRIPTION", desc: "Unstructured employer posting from HR portal or scraper.", tech: "HR Input / REST API" },
    { title: "JOB PARSER", desc: "HTML parsing and section segmentation into responsibilities & requirements.", tech: "BeautifulSoup / Pydantic" },
    { title: "REQUIREMENT EXTRACTION", desc: "Separates Required skills (40%), Preferred skills, and Bonus skills.", tech: "3-Tier Skill Separation Engine" },
    { title: "JOB PROFILE", desc: "Structured job entity stored in relational schema with metadata.", tech: "PostgreSQL / SQLAlchemy" },
    { title: "JOB EMBEDDING", desc: "Dense vector generated from required competencies and role context.", tech: "Sentence Transformers (384-dim)" }
  ];

  const matchingPipeline = [
    {
      title: "COSINE SIMILARITY CALCULATION",
      formula: "sim(A, B) = (A · B) / (||A|| ||B||)",
      desc: "Calculates semantic closeness between candidate vector and job vector in high-dimensional embedding space."
    },
    {
      title: "STRUCTURED 5-FACTOR WEIGHTED MATCHING",
      formula: "Overall = (Skill × 0.40) + (Exp × 0.20) + (Edu × 0.15) + (Projects × 0.15) + (ATS × 0.10)",
      desc: "Blends deterministic criteria (skills, years, degree) with semantic cosine similarity."
    },
    {
      title: "COMPATIBILITY & ELIGIBILITY ENGINE",
      formula: "Eligible if Required Skills ≥ 80% and Experience ≥ (Min - 0.5)",
      desc: "Distinguishes Eligibility (hard gates) from Compatibility (ranking), preventing unfair bonus-skill rejections."
    },
    {
      title: "SKILL GAP ANALYSIS & LEARNING ROADMAP",
      formula: "Missing = Required_Skills ∖ Candidate_Skills",
      desc: "Ranks missing skills by employer market demand and generates a 4-week project roadmap."
    },
    {
      title: "JOB RANKING & RECOMMENDATIONS",
      formula: "Ranked list sorted descending by Compatibility Score",
      desc: "Surfaces top opportunities to candidate and ranks best candidates for recruiters."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8 lg:p-12 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Navigation & Viva Header (Page 80-82) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold mb-2">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Viva & Technical Presentation Mode</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Skills2Job Architecture & ML Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Interactive end-to-end flow from raw text extraction to explainable 5-factor career matchmaking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Open Live Dashboard →
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-colors"
            >
              Exit to Home
            </Link>
          </div>
        </div>

        {/* Parallel Ingestion Channels (Candidate vs Job) */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Candidate Channel */}
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
              <FileText className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-extrabold text-indigo-200 uppercase tracking-wider">
                Candidate Pipeline
              </h3>
            </div>

            <div className="space-y-3">
              {resumePipeline.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-400 font-mono">
                      {idx + 1}. {step.title}
                    </span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">
                      {step.tech}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Job Requirement Channel */}
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
              <Database className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-extrabold text-blue-200 uppercase tracking-wider">
                Job Requirement Pipeline
              </h3>
            </div>

            <div className="space-y-3">
              {jobPipeline.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-400 font-mono">
                      {idx + 1}. {step.title}
                    </span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">
                      {step.tech}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Center Convergence Arrow */}
        <div className="flex flex-col items-center justify-center py-2 text-indigo-400">
          <div className="text-xs font-extrabold uppercase tracking-widest bg-indigo-500/20 border border-indigo-500/40 px-4 py-1 rounded-full mb-2">
            Vector Convergence & Match Formulation
          </div>
          <ArrowDown className="w-8 h-8 animate-bounce" />
        </div>

        {/* Convergence & 5-Factor Math (Pages 81-82) */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl border border-indigo-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
                Mathematical Convergence
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Candidate Vector + Job Vector Matching Engine
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
              pgvector & Cosine Similarity
            </span>
          </div>

          <div className="space-y-4">
            {matchingPipeline.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-indigo-500/60 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-sm font-extrabold text-indigo-300 font-mono">
                    Step {idx + 1}: {item.title}
                  </h4>
                  <code className="text-xs bg-black/50 text-amber-300 px-3 py-1 rounded-lg font-mono border border-slate-800">
                    {item.formula}
                  </code>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5 Core Ideas Summary (Pages 86-87) */}
        <div className="bg-slate-800/40 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">
            5 Core Product Axioms Communicated to Examiners:
          </h3>
          <div className="grid sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700">
              <span className="font-extrabold text-indigo-400 block mb-1">1. Ingestion</span>
              "I upload my resume."
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700">
              <span className="font-extrabold text-indigo-400 block mb-1">2. Comprehension</span>
              "Skills2Job understands my skills and experience."
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700">
              <span className="font-extrabold text-indigo-400 block mb-1">3. Alignment</span>
              "It understands what jobs require."
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700">
              <span className="font-extrabold text-indigo-400 block mb-1">4. Explainability</span>
              "It tells me how good my match is (and WHY)."
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700">
              <span className="font-extrabold text-indigo-400 block mb-1">5. Actionability</span>
              "It tells me exactly what I should improve."
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
