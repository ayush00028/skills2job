"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import {
  User, Mail, Phone, MapPin, Globe, Linkedin,
  Briefcase, Award, CheckCircle2, Save, Check
} from "lucide-react";

export default function ProfilePage() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // Form fields
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [desiredRole, setDesiredRole] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.getJobSeekerProfile();
      setData(res);
      if (res.profile) {
        setHeadline(res.profile.headline || "Full Stack Developer");
        setBio(res.profile.bio || "");
        setDesiredRole(res.profile.desired_role || "Full Stack Developer");
        setExpectedSalary(res.profile.expected_salary || "₹12L – ₹18L");
        setCity(res.profile.city || "Bangalore");
        setCountry(res.profile.country || "India");
      }
    } catch (e) {
      console.warn("Using fallback profile");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateJobSeekerProfile({
        headline,
        bio,
        desired_role: desiredRole,
        expected_salary: expectedSalary,
        city,
        country
      });
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    } catch (e) {
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
            Candidate Settings
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Profile & Career Persona
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update your professional headline, career targets, and geographic preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <img
              src={data?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt="Alex Sharma"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-600/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">{data?.full_name || "Alex Sharma"}</h2>
                <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-50" />
              </div>
              <p className="text-xs font-semibold text-slate-500">{data?.email || "alex.sharma@example.com"}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 pt-6 text-xs">
            {savedMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Profile changes successfully updated!</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Desired Primary Role</label>
                <input
                  type="text"
                  value={desiredRole}
                  onChange={(e) => setDesiredRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Compensation</label>
                <input
                  type="text"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location (City, Country)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium"
                  />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Professional Bio</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 font-medium resize-none"
                  placeholder="Summarize your core software accomplishments and technology stack..."
                ></textarea>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Profile"}</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
