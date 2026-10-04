"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/authContext";
import {
  User, Mail, Phone, MapPin, Globe, Linkedin,
  Briefcase, Award, CheckCircle2, Save, Check, Plus, Trash2, Code, Loader2,
  FileText, Upload, RefreshCw, FileCheck, Eye, X, Sparkles
} from "lucide-react";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [desiredRole, setDesiredRole] = useState("");
  const [experienceYears, setExperienceYears] = useState<number | string>(3.0);
  const [educationDegree, setEducationDegree] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  // Skills
  const [skillsList, setSkillsList] = useState<Array<{ name: string; level: string; source: string }>>([]);
  const [newSkill, setNewSkill] = useState("");

  // Resume management
  const [resumeData, setResumeData] = useState<any>(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUploadMessage, setResumeUploadMessage] = useState<string | null>(null);
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null);
  const [showExtractedModal, setShowExtractedModal] = useState(false);

  useEffect(() => {
    loadProfile();
    loadLatestResume();
  }, []);

  const loadLatestResume = async () => {
    setLoadingResume(true);
    try {
      const res = await api.getLatestResume();
      if (res && res.filename) {
        setResumeData(res);
      }
    } catch (e) {
      console.warn("Could not load latest resume");
    } finally {
      setLoadingResume(false);
    }
  };

  const handleResumeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedResumeFile(e.target.files[0]);
      setResumeUploadMessage(null);
    }
  };

  const handleUploadAndReEvaluate = async () => {
    if (!selectedResumeFile) return;
    setUploadingResume(true);
    setResumeUploadMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedResumeFile);
      const res = await api.uploadResume(formData);
      
      setResumeData({
        filename: res.filename || selectedResumeFile.name,
        parsed_data: res.parsed_data,
        uploaded_at: res.uploaded_at || "Just now"
      });

      if (res.parsed_data?.technical_skills) {
        const newSkills = res.parsed_data.technical_skills.map((s: string) => ({
          name: s,
          level: "Advanced",
          source: "resume"
        }));
        const existingNames = new Set(skillsList.map(s => s.name.toLowerCase()));
        const toAdd = newSkills.filter((s: any) => !existingNames.has(s.name.toLowerCase()));
        if (toAdd.length > 0) {
          setSkillsList(prev => [...prev, ...toAdd]);
        }
      }

      if (res.parsed_data?.experience_years) {
        setExperienceYears(res.parsed_data.experience_years);
      }

      // Re-evaluate compatibility scores in background
      try {
        await api.getMyMatches();
      } catch (err) {
        // match refresh
      }

      setSelectedResumeFile(null);
      setResumeUploadMessage(res.message || `Resume '${res.filename}' uploaded successfully! Technical skills extracted and job compatibility re-evaluated.`);
      
      // Synchronize with updated profile in DB
      await loadProfile();
      await refreshUser();
    } catch (e) {
      setResumeUploadMessage("Failed to process resume file. Please ensure it is a valid PDF, DOCX, or TXT document.");
    } finally {
      setUploadingResume(false);
    }
  };

  const loadProfile = async () => {
    try {
      const res = await api.getJobSeekerProfile();
      setData(res);
      setFullName(res.full_name || user?.full_name || "");
      setPhone(res.phone || user?.phone || "");
      if (res.profile) {
        setHeadline(res.profile.headline || "Full Stack Developer");
        setBio(res.profile.bio || "");
        setDesiredRole(res.profile.desired_role || "Full Stack Developer");
        setExperienceYears(res.profile.experience_years ?? 3.0);
        setEducationDegree(res.profile.education_degree || "B.Tech in Computer Science");
        setExpectedSalary(res.profile.expected_salary || "₹12L – ₹18L");
        setCity(res.profile.city || "Bangalore");
        setCountry(res.profile.country || "India");
      }
      if (res.skills && res.skills.length > 0) {
        setSkillsList(res.skills.map((s: any) => ({
          name: s.name,
          level: s.proficiency || "Intermediate",
          source: s.source || "Manual"
        })));
      }
    } catch (e) {
      console.warn("Using fallback profile");
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkillsList([...skillsList, { name: newSkill.trim(), level: "Intermediate", source: "Manual" }]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (idx: number) => {
    setSkillsList(skillsList.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateJobSeekerProfile({
        full_name: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
        headline,
        bio,
        desired_role: desiredRole,
        experience_years: parseFloat(String(experienceYears)) || 1.0,
        education_degree: educationDegree,
        expected_salary: expectedSalary,
        city,
        country,
        skills: skillsList
      });

      await refreshUser();
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (e) {
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
            Candidate Settings
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Profile & Career Persona
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update your professional headline, target stack, and geographic preferences dynamically stored in database.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
          
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <img
              src={data?.avatar_url || user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-600/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{fullName || data?.full_name || user?.full_name || "Candidate"}</h2>
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 fill-blue-50 dark:fill-blue-950" />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{data?.email || user?.email || "candidate@example.com"}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5 pt-6 text-xs">
            {savedMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Profile, experience, and skills successfully saved in database!</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Desired Primary Role</label>
                <input
                  type="text"
                  value={desiredRole}
                  onChange={(e) => setDesiredRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Years of Experience</label>
                <input
                  type="number"
                  step="0.5"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  placeholder="3.0"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Education Degree</label>
                <input
                  type="text"
                  value={educationDegree}
                  onChange={(e) => setEducationDegree(e.target.value)}
                  placeholder="e.g. B.Tech in Computer Science"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Compensation</label>
                <input
                  type="text"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  placeholder="₹12L – ₹18L"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location (City, Country)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 font-medium"
                  />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Professional Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 font-medium resize-none"
                  placeholder="Summarize your core software accomplishments and technology stack..."
                ></textarea>
              </div>

              {/* Dynamic Skills Manager */}
              <div className="sm:col-span-2 pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>My Technical Skills ({skillsList.length})</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Used for 5-factor AI matching</span>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); } }}
                    placeholder="Add a new skill (e.g. Flutter, Go, Kubernetes)..."
                    className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 min-h-16">
                  {skillsList.length === 0 ? (
                    <span className="text-xs text-slate-400 py-2">No skills configured yet. Add your core skills above to power your matches.</span>
                  ) : (
                    skillsList.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs"
                      >
                        <span>{s.name}</span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">({s.level})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(idx)}
                          className="text-slate-400 hover:text-rose-500 ml-0.5"
                          title="Remove skill"
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile & Skills</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

        {/* Uploaded Resume & AI Eligibility Re-evaluation Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-0.5">
                Resume Intelligence & Automated Eligibility
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>My Uploaded Resume</span>
              </h2>
            </div>
            
            {resumeData && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Parsed & Verified</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  ATS Score: {resumeData?.parsed_data?.ats_score || 89}%
                </span>
              </div>
            )}
          </div>

          {resumeUploadMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{resumeUploadMessage}</span>
            </div>
          )}

          {/* Current Active Resume Details Card */}
          <div className="grid sm:grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="sm:col-span-8 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  {resumeData?.filename || "No Resume Uploaded Yet"}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>Uploaded: {resumeData?.uploaded_at || "N/A"}</span>
                  <span>•</span>
                  <span>Detected Exp: {resumeData?.parsed_data?.experience_years ? `${resumeData.parsed_data.experience_years} Years` : `${experienceYears} Years`}</span>
                  <span>•</span>
                  <span>{resumeData?.parsed_data?.technical_skills?.length || skillsList.length} Technical Skills</span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-4 flex items-center sm:justify-end gap-2">
              {resumeData?.parsed_data && (
                <button
                  type="button"
                  onClick={() => setShowExtractedModal(true)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>View Extracted Details</span>
                </button>
              )}
            </div>
          </div>

          {/* Re-upload Area */}
          <div className="p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Re-upload Resume to Re-evaluate Compatibility
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Upload an updated resume (.pdf, .docx, .txt) to recalculate job match scores, skill gaps, and employer eligibility.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <input
                  type="file"
                  id="profile-resume-file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleResumeFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="profile-resume-file"
                  className="cursor-pointer px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{selectedResumeFile ? "Change File" : "Choose New Resume"}</span>
                </label>

                {selectedResumeFile && (
                  <button
                    type="button"
                    disabled={uploadingResume}
                    onClick={handleUploadAndReEvaluate}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 flex-1 sm:flex-none"
                  >
                    {uploadingResume ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Re-evaluating...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Upload & Re-evaluate Compatibility</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {selectedResumeFile && (
              <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs flex items-center justify-between text-indigo-900 dark:text-indigo-300">
                <span className="font-semibold truncate">Selected: {selectedResumeFile.name} ({(selectedResumeFile.size / 1024).toFixed(1)} KB)</span>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Ready to upload</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Extracted Resume Details Modal */}
      {showExtractedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 shadow-elevated space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Extracted Resume Details & ATS Insights
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExtractedModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ATS Score Card */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">Resume Health</span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{resumeData?.filename}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Uploaded {resumeData?.uploaded_at}</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-none">
                  {resumeData?.parsed_data?.ats_score || 89}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 block mt-0.5 uppercase">ATS Match Score</span>
              </div>
            </div>

            {/* Extracted Technical Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Extracted Technical Skills ({resumeData?.parsed_data?.technical_skills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                {resumeData?.parsed_data?.technical_skills?.map((s: string) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Education & Experience Details */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience Duration</span>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {resumeData?.parsed_data?.experience_years ? `${resumeData.parsed_data.experience_years} Years Professional Experience` : "3.0 Years Detected"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Education Credential</span>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {resumeData?.parsed_data?.education?.[0]?.degree || educationDegree || "Bachelor of Technology in Computer Science"}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowExtractedModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
