"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SmartJobCard } from "@/components/SmartJobCard";
import { api } from "@/lib/api";
import {
  Search, SlidersHorizontal, MapPin, Briefcase,
  IndianRupee, Sparkles, Filter, X, ArrowUpDown
} from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter State
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("all");
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState("match"); // match, newest, salary

  useEffect(() => {
    fetchJobs();
  }, [workType, minScore, sortBy]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await api.getJobs({
        q: query,
        location: location || undefined,
        work_type: workType !== "all" ? workType : undefined,
        min_score: minScore > 0 ? minScore : undefined,
        sort_by: sortBy,
      });
      setJobs(data.jobs || []);
    } catch (e) {
      console.warn("Failed fetching jobs, fallback used");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClearFilters = () => {
    setQuery("");
    setLocation("");
    setWorkType("all");
    setMinScore(0);
    setSortBy("match");
  };

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
            AI Opportunity Engine
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find Your Perfect Job
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search roles ranked by compatibility score and transparent skill matching.
          </p>
        </div>

        {/* Search Bar & Multi-Filters Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search job title, company or skill (e.g. React, Full Stack, Python)..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500"
              />
            </div>

            <div className="relative sm:w-56">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (Bangalore, Remote)..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all shrink-0"
            >
              Search Jobs
            </button>
          </form>

          {/* Filter Bar */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Work Type Filter */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400">Mode:</span>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {["all", "Remote", "Hybrid", "On-site"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setWorkType(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                        workType === t ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Match Score Filter Slider */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-slate-600 dark:text-slate-300">Min Score:</span>
                <input
                  type="range"
                  min={0}
                  max={90}
                  step={5}
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-24 accent-indigo-600"
                />
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 min-w-[2.5rem]">{minScore}%+</span>
              </div>

            </div>

            {/* Sorting Controls */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500 dark:text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="match">Best Match Score</option>
                <option value="newest">Newest First</option>
                <option value="salary">Highest Experience / Salary</option>
              </select>

              {(query || location || workType !== "all" || minScore > 0) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Clear Filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Showing <strong className="text-slate-900 dark:text-white">{jobs.length}</strong> matching positions</span>
          <span className="text-slate-400 dark:text-slate-500">All results include 5-factor explainable breakdown</span>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Matching candidate skills against live job openings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No matching jobs found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try expanding your preferred locations, reducing the minimum match score, or search by a broader keyword.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <SmartJobCard key={job.id} job={job} onApplySuccess={fetchJobs} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
