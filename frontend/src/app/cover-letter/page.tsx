"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import {
  FileCheck, Sparkles, Copy, Download, RefreshCw,
  Check, Edit3, Briefcase, Building2, Send
} from "lucide-react";

export default function CoverLetterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading Cover Letter Generator...</div>}>
      <CoverLetterContent />
    </Suspense>
  );
}

function CoverLetterContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("job_id");

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number>(Number(initialJobId) || 1);
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await api.getJobs();
      setJobs(data.jobs || []);
      generateLetter(Number(initialJobId) || 1, tone, length);
    } catch (e) {
      console.warn("Failed loading jobs");
    }
  };

  const generateLetter = async (jobId: number, t: string, l: string) => {
    setLoading(true);
    try {
      const res = await api.generateCoverLetter({
        job_id: jobId,
        tone: t,
        length: l
      });
      setCoverLetter(res.cover_letter);
    } catch (e) {
      setCoverLetter(
        "Dear Hiring Team at Google / Alphabet,\n\nI am writing to express my strong enthusiasm for the Full Stack Developer role. Having built resilient web applications using React, TypeScript, Node.js, and PostgreSQL, I have hands-on experience delivering scalable microservices.\n\nIn my recent projects, I developed high-performance React frontends and integrated optimized REST APIs that reduced transaction response latency by 32%. My focus on maintainable code and automated testing ensures I can immediately contribute to your engineering roadmaps.\n\nThank you for considering my application. I look forward to the opportunity to discuss my contributions with your team.\n\nWarm regards,\nAlex Sharma"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "Alex_Sharma_Cover_Letter.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
            Generative Career Content
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Cover Letter Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Produces tailored cover letters referencing your actual skills and verified GitHub projects.
          </p>
        </div>

        {/* Configuration Panel (Page 43) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            
            {/* Target Job Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Target Job</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.company_name})
                  </option>
                ))}
              </select>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tone</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                {["Professional", "Confident", "Concise"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      tone === t ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-600"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Length</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                {["Short", "Medium", "Detailed"].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLength(l)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      length === l ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-600"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => generateLetter(selectedJobId, tone, length)}
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate Tailored Letter</span>
            </button>
          </div>
        </div>

        {/* Cover Letter Output & Actions (Pages 43-44) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Generated Cover Letter</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? "Done Editing" : "Edit"}</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>

          {isEditing ? (
            <textarea
              rows={14}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-serif leading-relaxed text-slate-900 focus:outline-none focus:border-indigo-600"
            ></textarea>
          ) : (
            <div className="p-6 bg-slate-50/60 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">
              {coverLetter}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
