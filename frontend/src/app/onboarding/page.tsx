"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Briefcase, FileText, Github, CheckCircle2,
  Sparkles, ArrowRight, ArrowLeft, Upload, Check,
  AlertCircle, Edit2, Plus, Trash2, ShieldCheck,
  TrendingUp, Code, Laptop
} from "lucide-react";
import { api } from "@/lib/api";

export default function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Personal
  const [fullName, setFullName] = useState("Alex Sharma");
  const [email, setEmail] = useState("alex.sharma@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [city, setCity] = useState("Bangalore");
  const [country, setCountry] = useState("India");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/alex-sharma-dev");
  const [portfolio, setPortfolio] = useState("https://alexsharma.dev");

  // Step 2: Career Preferences
  const [desiredRole, setDesiredRole] = useState("Full Stack Developer");
  const [jobTitles, setJobTitles] = useState("Software Engineer, Full Stack Developer, Backend Developer");
  const [locations, setLocations] = useState("Bangalore, Hyderabad, Remote");
  const [workType, setWorkType] = useState("Hybrid");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [experienceLevel, setExperienceLevel] = useState("Mid Level (2-4 yrs)");
  const [salaryExpectation, setSalaryExpectation] = useState("₹12L – ₹18L");
  const [industries, setIndustries] = useState("SaaS, FinTech, AI/ML");

  // Step 3: Resume Upload & Animated Progress
  const [uploadProgressState, setUploadProgressState] = useState<
    "idle" | "uploading" | "extracting" | "skills" | "experience" | "education" | "projects" | "done"
  >("idle");
  const [resumeParsed, setResumeParsed] = useState<any>(null);

  // Step 4: GitHub
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubData, setGithubData] = useState<any>(null);

  // Step 5: Skills
  const [skillsList, setSkillsList] = useState<Array<{ name: string; level: string; source: string }>>([
    { name: "React", level: "Advanced", source: "Resume" },
    { name: "JavaScript", level: "Advanced", source: "Resume" },
    { name: "Node.js", level: "Intermediate", source: "Resume" },
    { name: "Python", level: "Intermediate", source: "GitHub" },
    { name: "SQL", level: "Advanced", source: "Resume" },
    { name: "Git", level: "Advanced", source: "GitHub" },
    { name: "TypeScript", level: "Intermediate", source: "GitHub" },
    { name: "REST APIs", level: "Advanced", source: "Resume" }
  ]);
  const [newSkillName, setNewSkillName] = useState("");

  const steps = [
    { num: 1, label: "Personal", icon: User },
    { num: 2, label: "Career", icon: Briefcase },
    { num: 3, label: "Resume", icon: FileText },
    { num: 4, label: "GitHub", icon: Github },
    { num: 5, label: "Skills", icon: Code },
    { num: 6, label: "Review", icon: CheckCircle2 }
  ];

  // Resume Upload Simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startAnalysis();
    }
  };

  const startAnalysis = () => {
    setUploadProgressState("uploading");
    setTimeout(() => setUploadProgressState("extracting"), 700);
    setTimeout(() => setUploadProgressState("skills"), 1400);
    setTimeout(() => setUploadProgressState("experience"), 2100);
    setTimeout(() => setUploadProgressState("education"), 2800);
    setTimeout(() => setUploadProgressState("projects"), 3500);
    setTimeout(() => {
      setUploadProgressState("done");
      setResumeParsed({
        technical_skills: ["React", "JavaScript", "Node.js", "Python", "SQL", "Git", "REST APIs", "TypeScript"],
        experience_years: 3.0,
        education: [{ degree: "B.Tech in Computer Science", institution: "National Institute of Technology", year: "2020-2024" }],
        experience: [{ role: "Full Stack Software Engineer", company: "Cognizant / NextGen Labs", duration: "2024-Present" }],
        projects: [{ name: "E-Commerce Cloud Platform", tech: "React, Node.js, PostgreSQL" }],
        certifications: ["AWS Cloud Practitioner (In Progress)"],
        achievements: ["Hackathon 1st Place Winner 2023"]
      });
    }, 4200);
  };

  const connectGitHubFlow = async () => {
    try {
      const data = await api.getGitHubInsights();
      setGithubData(data);
      setGithubConnected(true);
    } catch (e) {
      setGithubConnected(true);
      setGithubData({
        username: "alexsharma-dev",
        avatar: "https://avatars.githubusercontent.com/u/583231?v=4",
        repositories_count: 18,
        followers: 142,
        contributions: 420,
        top_languages: [
          { name: "TypeScript", percentage: 42 },
          { name: "JavaScript", percentage: 28 },
          { name: "Python", percentage: 20 }
        ]
      });
    }
  };

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      setSkillsList([...skillsList, { name: newSkillName.trim(), level: "Intermediate", source: "Manual" }]);
      setNewSkillName("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkillsList(skillsList.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
      
      {/* Wizard Progress Stepper (Page 16) */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-300 z-0"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((s) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isDone
                      ? "bg-indigo-600 text-white shadow-xs"
                      : isCurrent
                      ? "bg-white border-2 border-indigo-600 text-indigo-600 ring-4 ring-indigo-50"
                      : "bg-white border-2 border-slate-200 text-slate-400"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-[11px] font-bold mt-1.5 hidden sm:block ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Content Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-elevated">
        
        {/* STEP 1: PERSONAL */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
                Step 1 of 6
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Provide your basic contact and portfolio references.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City & Country</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Portfolio Website</label>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CAREER PREFERENCES */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
                Step 2 of 6
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Career Preferences</h2>
              <p className="text-xs text-slate-500">Specify your ideal roles, locations, and compensation targets.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Desired Primary Role</label>
                <input
                  type="text"
                  value={desiredRole}
                  onChange={(e) => setDesiredRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Job Titles</label>
                <input
                  type="text"
                  value={jobTitles}
                  onChange={(e) => setJobTitles(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Remote", "Hybrid", "On-site"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWorkType(m)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                        workType === m
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expected Salary</label>
                <input
                  type="text"
                  value={salaryExpectation}
                  onChange={(e) => setSalaryExpectation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Industries</label>
                <input
                  type="text"
                  value={industries}
                  onChange={(e) => setIndustries(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RESUME UPLOAD & PARSING */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
                Step 3 of 6
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Upload Your Resume</h2>
              <p className="text-xs text-slate-500">
                Our parser extracts skills, education, and achievements into structured data you can review.
              </p>
            </div>

            {uploadProgressState === "idle" && (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Drag & drop your resume PDF here</h4>
                <p className="text-xs text-slate-400 mt-1">Supports PDF up to 10MB</p>
                
                <div className="mt-4 flex justify-center gap-3">
                  <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs">
                    Browse File
                    <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <button
                    onClick={startAnalysis}
                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Use Sample Resume (Alex Sharma)
                  </button>
                </div>
              </div>
            )}

            {/* Animated Progression Stages (Pages 18-19) */}
            {uploadProgressState !== "idle" && uploadProgressState !== "done" && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto"></div>
                <h3 className="text-base font-bold text-slate-800">
                  {uploadProgressState === "uploading" && "Uploading resume..."}
                  {uploadProgressState === "extracting" && "Extracting text from PDF..."}
                  {uploadProgressState === "skills" && "Identifying skills with NLP..."}
                  {uploadProgressState === "experience" && "Analyzing experience timeline..."}
                  {uploadProgressState === "education" && "Analyzing education credentials..."}
                  {uploadProgressState === "projects" && "Analyzing portfolio projects..."}
                </h3>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-500"
                    style={{
                      width:
                        uploadProgressState === "uploading" ? "15%" :
                        uploadProgressState === "extracting" ? "30%" :
                        uploadProgressState === "skills" ? "50%" :
                        uploadProgressState === "experience" ? "70%" :
                        uploadProgressState === "education" ? "85%" : "95%"
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Complete & Extracted Display (Page 19) */}
            {uploadProgressState === "done" && resumeParsed && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Resume analysis complete ✓ All sections extracted and ready for review.</span>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Technical Skills (Extracted)</span>
                    <span className="text-xs text-indigo-600 font-semibold cursor-pointer">Edit</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeParsed.technical_skills.map((s: string) => (
                      <span key={s} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Experience & Education</span>
                    <span className="text-xs text-indigo-600 font-semibold cursor-pointer">Edit</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>3.0 years</strong> • Full Stack Software Engineer at Cognizant / NextGen Labs
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Bachelor of Technology in CS</strong> • National Institute of Technology (2020-2024)
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* STEP 4: GITHUB */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
                Step 4 of 6
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Connect Your GitHub</h2>
              <p className="text-xs text-slate-500">
                Your GitHub projects provide verifiable evidence of your practical technical skills.
              </p>
            </div>

            {!githubConnected ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-4">
                  <Github className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Sync GitHub Repositories</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                  We analyze repository languages, dependencies, and commits to strengthen your skill-matching accuracy.
                </p>
                <button
                  onClick={connectGitHubFlow}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-all"
                >
                  <Github className="w-4 h-4" />
                  Connect GitHub with OAuth
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>✓ GitHub Connected: @alexsharma-dev</span>
                </div>

                <div className="grid sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-lg font-extrabold text-slate-900">18</span>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Repositories</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-lg font-extrabold text-slate-900">420</span>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Contributions</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-lg font-extrabold text-slate-900">142</span>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Followers</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-lg font-extrabold text-indigo-600">TypeScript</span>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Top Language</span>
                  </div>
                </div>

                {/* Example Project (Page 21) */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">ecommerce-cloud-platform</h4>
                      <p className="text-[11px] text-slate-500">Full stack microservices e-commerce application</p>
                    </div>
                    <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                      Use In Resume ✓
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {["React", "TypeScript", "Node.js", "REST API", "PostgreSQL"].map((t) => (
                      <span key={t} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* STEP 5: SKILLS PROFICIENCY */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
                Step 5 of 6
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Review & Set Skill Levels</h2>
              <p className="text-xs text-slate-500">
                Combined from your Resume, GitHub, and manual input. Set your proficiency for fair matching.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Add custom skill (e.g. Next.js, Docker)"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {skillsList.map((skill, index) => (
                <div key={index} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{skill.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-semibold uppercase">
                      {skill.source}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={skill.level}
                      onChange={(e) => {
                        const updated = [...skillsList];
                        updated[index].level = e.target.value;
                        setSkillsList(updated);
                      }}
                      className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>

                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW */}
        {currentStep === 6 && (
          <div className="space-y-6 text-center animate-in fade-in">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
                Step 6 of 6
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Profile Ready!</h2>
              <p className="text-xs text-slate-500">
                Your AI profile is fully prepared to match with opportunities.
              </p>
            </div>

            {/* Profile Completion 94% (Page 22) */}
            <div className="w-32 h-32 mx-auto rounded-full bg-indigo-50 border-4 border-indigo-600 flex flex-col items-center justify-center shadow-md">
              <span className="text-3xl font-extrabold text-indigo-900 leading-none">94%</span>
              <span className="text-[10px] uppercase font-bold text-indigo-600 mt-1">Complete</span>
            </div>

            <div className="max-w-md mx-auto space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2 text-emerald-700">
                <Check className="w-4 h-4" /> Account verified
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <Check className="w-4 h-4" /> Resume analyzed
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <Check className="w-4 h-4" /> GitHub connected
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <Check className="w-4 h-4" /> Career preferences set
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <Check className="w-4 h-4" /> Skills added ({skillsList.length} skills)
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Build My Career Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex justify-between items-center pt-8 mt-8 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 6 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
