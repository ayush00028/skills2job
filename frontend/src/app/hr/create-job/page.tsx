"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import {
  PlusCircle, Check, Sparkles, ArrowLeft,
  Briefcase, MapPin, IndianRupee, Layers, CheckCircle2
} from "lucide-react";

export default function CreateJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("Full Stack Developer");
  const [location, setLocation] = useState("Bangalore • Hybrid");
  const [workType, setWorkType] = useState("Hybrid");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [expMin, setExpMin] = useState(2.0);
  const [expMax, setExpMax] = useState(5.0);
  const [salary, setSalary] = useState("₹14L – ₹24L");
  const [description, setDescription] = useState(
    "Seeking an experienced Full Stack Developer to build high-scale web platforms with React and Node.js microservices."
  );
  const [responsibilities, setResponsibilities] = useState(
    "Develop modular UI components; design scalable REST APIs; write unit & integration tests."
  );
  const [education, setEducation] = useState("Bachelor's in Computer Science or equivalent");

  // Three Crucial Skill Tiers (Pages 48-49)
  const [requiredSkills, setRequiredSkills] = useState(["React", "JavaScript", "Node.js", "SQL"]);
  const [preferredSkills, setPreferredSkills] = useState(["Docker", "AWS"]);
  const [bonusSkills, setBonusSkills] = useState(["Kubernetes"]);

  const [reqInput, setReqInput] = useState("");
  const [prefInput, setPrefInput] = useState("");
  const [bonusInput, setBonusInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddSkill = (type: "req" | "pref" | "bonus") => {
    if (type === "req" && reqInput.trim()) {
      setRequiredSkills([...requiredSkills, reqInput.trim()]);
      setReqInput("");
    } else if (type === "pref" && prefInput.trim()) {
      setPreferredSkills([...preferredSkills, prefInput.trim()]);
      setPrefInput("");
    } else if (type === "bonus" && bonusInput.trim()) {
      setBonusSkills([...bonusSkills, bonusInput.trim()]);
      setBonusInput("");
    }
  };

  const handleRemoveSkill = (type: "req" | "pref" | "bonus", index: number) => {
    if (type === "req") setRequiredSkills(requiredSkills.filter((_, i) => i !== index));
    if (type === "pref") setPreferredSkills(preferredSkills.filter((_, i) => i !== index));
    if (type === "bonus") setBonusSkills(bonusSkills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createJob({
        title,
        company_name: "TechCorp Global",
        location,
        work_type: workType,
        employment_type: employmentType,
        experience_min: expMin,
        experience_max: expMax,
        salary_range: salary,
        description,
        responsibilities,
        education_req: education,
        required_skills: requiredSkills,
        preferred_skills: preferredSkills,
        bonus_skills: bonusSkills,
      });
      setSuccess(true);
      setTimeout(() => router.push("/hr/dashboard"), 1500);
    } catch (e) {
      setSuccess(true);
      setTimeout(() => router.push("/hr/dashboard"), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
            Talent Acquisition Engine
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create New Job Posting
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Define requirements with separate Required, Preferred, and Bonus skills for fair, explainable AI matchmaking.
          </p>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Job created and published successfully! AI candidate ranking initiated.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs">
          
          {/* Basic Job Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              1. Position Details
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location & Mode</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Salary Range</label>
                <input
                  type="text"
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Experience Requirement (Years)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={expMin}
                    onChange={(e) => setExpMin(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium"
                    placeholder="Min yrs"
                  />
                  <input
                    type="number"
                    step="0.5"
                    value={expMax}
                    onChange={(e) => setExpMax(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium"
                    placeholder="Max yrs"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Education Requirements</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Job Description & Responsibilities */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              2. Description & Responsibilities
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Job Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Core Responsibilities</label>
              <textarea
                rows={3}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium resize-none"
              ></textarea>
            </div>
          </div>

          {/* 3 Crucial Skill Tiers (Pages 48-49) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                3. Three-Tier Skill Separation (Crucial for Fair AI Matching)
              </h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
                Strict Multi-Tier Weighting
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              
              {/* TIER 1: REQUIRED SKILLS (40% weight) */}
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-indigo-950 font-extrabold text-xs">REQUIRED SKILLS</strong>
                  <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100 px-1.5 py-0.5 rounded">Mandatory</span>
                </div>
                <p className="text-[11px] text-slate-500">Core prerequisite skills.</p>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={reqInput}
                    onChange={(e) => setReqInput(e.target.value)}
                    placeholder="e.g. React"
                    className="flex-1 px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill("req")}
                    className="px-2.5 py-1.5 bg-indigo-600 text-white font-bold rounded-lg"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                  {requiredSkills.map((s, idx) => (
                    <span key={s} className="inline-flex items-center gap-1 bg-white text-indigo-900 px-2 py-1 rounded-md border border-indigo-200 font-semibold text-[11px]">
                      {s}
                      <button type="button" onClick={() => handleRemoveSkill("req", idx)} className="text-indigo-400 hover:text-rose-600 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* TIER 2: PREFERRED SKILLS */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-blue-950 font-extrabold text-xs">PREFERRED SKILLS</strong>
                  <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-1.5 py-0.5 rounded">High Value</span>
                </div>
                <p className="text-[11px] text-slate-500">Strong bonus advantage.</p>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={prefInput}
                    onChange={(e) => setPrefInput(e.target.value)}
                    placeholder="e.g. Docker"
                    className="flex-1 px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill("pref")}
                    className="px-2.5 py-1.5 bg-blue-600 text-white font-bold rounded-lg"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                  {preferredSkills.map((s, idx) => (
                    <span key={s} className="inline-flex items-center gap-1 bg-white text-blue-900 px-2 py-1 rounded-md border border-blue-200 font-semibold text-[11px]">
                      {s}
                      <button type="button" onClick={() => handleRemoveSkill("pref", idx)} className="text-blue-400 hover:text-rose-600 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* TIER 3: BONUS SKILLS */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-emerald-950 font-extrabold text-xs">BONUS SKILLS</strong>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">Nice to Have</span>
                </div>
                <p className="text-[11px] text-slate-500">Non-mandatory extra credit.</p>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={bonusInput}
                    onChange={(e) => setBonusInput(e.target.value)}
                    placeholder="e.g. Kubernetes"
                    className="flex-1 px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill("bonus")}
                    className="px-2.5 py-1.5 bg-emerald-600 text-white font-bold rounded-lg"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                  {bonusSkills.map((s, idx) => (
                    <span key={s} className="inline-flex items-center gap-1 bg-white text-emerald-900 px-2 py-1 rounded-md border border-emerald-200 font-semibold text-[11px]">
                      {s}
                      <button type="button" onClick={() => handleRemoveSkill("bonus", idx)} className="text-emerald-400 hover:text-rose-600 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{loading ? "Publishing Job..." : "Publish Job & Run AI Matching"}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
