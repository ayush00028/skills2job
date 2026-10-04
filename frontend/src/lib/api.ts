const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("skills2job_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || "Request failed");
    }

    return await res.json();
  } catch (error: any) {
    console.warn(`API call failed to ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth
  register: (data: any) => fetchApi("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: any) => fetchApi("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  requestOtp: (data: { email: string; purpose?: string }) => fetchApi("/auth/otp/request", { method: "POST", body: JSON.stringify(data) }),
  verifyOtpLogin: (data: { email: string; code: string }) => fetchApi("/auth/otp/verify", { method: "POST", body: JSON.stringify(data) }),
  verifyEmail: (data: any) => fetchApi("/auth/verify-email", { method: "POST", body: JSON.stringify(data) }),
  selectRole: (data: any) => fetchApi("/auth/select-role", { method: "POST", body: JSON.stringify(data) }),
  demoLogin: (role: string) => fetchApi(`/auth/demo/${role}`),
  getMe: () => fetchApi("/auth/me"),

  // Profile
  getJobSeekerProfile: () => fetchApi("/profile/job-seeker"),
  updateJobSeekerProfile: (data: any) => fetchApi("/profile/job-seeker", { method: "PUT", body: JSON.stringify(data) }),
  getHRProfile: () => fetchApi("/profile/hr"),

  // Jobs
  getJobs: (params: Record<string, any> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
    });
    return fetchApi(`/jobs?${q.toString()}`);
  },
  getJobDetail: (id: number | string) => fetchApi(`/jobs/${id}`),

  // Matches
  getMyMatches: () => fetchApi("/matches"),

  // Resume
  uploadResume: async (formData: FormData) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("skills2job_token") : null;
    const res = await fetch(`${API_BASE}/resume/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return await res.json();
  },
  getLatestResume: () => fetchApi("/resume/latest"),
  analyzeResumeCompatibility: (data: any) => fetchApi("/resume/analyze-compatibility", { method: "POST", body: JSON.stringify(data) }),

  // GitHub
  getGitHubInsights: () => fetchApi("/github/insights"),
  connectGitHub: (data?: any) => fetchApi("/github/connect", { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  generateProjectBullet: (data: any) => fetchApi(`/github/generate-bullet?project_name=${encodeURIComponent(data.project_name)}&tech_stack=${encodeURIComponent(data.tech_stack)}`, { method: "POST" }),

  // Skill Gap & Learning Plan
  getSkillGap: () => fetchApi("/skill-gap"),

  // Applications (Kanban)
  getApplications: () => fetchApi("/applications"),
  applyToJob: (jobId: number, status = "Applied") => fetchApi(`/applications/apply/${jobId}?status_name=${status}`, { method: "POST" }),
  updateApplicationStatus: (appId: number, status: string) => fetchApi(`/applications/${appId}/status`, { method: "PUT", body: JSON.stringify({ status }) }),

  // AI Tools
  generateCoverLetter: (data: any) => fetchApi("/ai-tools/cover-letter", { method: "POST", body: JSON.stringify(data) }),
  getMockInterviewQuestions: (data: any) => fetchApi("/ai-tools/mock-interview/questions", { method: "POST", body: JSON.stringify(data) }),
  evaluateInterviewAnswers: (answers: any[]) => fetchApi("/ai-tools/mock-interview/evaluate", { method: "POST", body: JSON.stringify(answers) }),

  // HR Portal
  getHRStats: () => fetchApi("/hr/dashboard-stats"),
  getHRJobs: () => fetchApi("/hr/jobs"),
  createJob: (data: any) => fetchApi("/hr/jobs", { method: "POST", body: JSON.stringify(data) }),
  getCandidates: (params: Record<string, any> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
    });
    return fetchApi(`/hr/candidates?${q.toString()}`);
  },
  getCandidateProfile: (id: number) => fetchApi(`/hr/candidates/${id}`),
  scheduleInterview: (data: any) => fetchApi("/hr/schedule-interview", { method: "POST", body: JSON.stringify(data) }),
  getScheduledInterviews: () => fetchApi("/hr/interviews"),

  // Analytics & Notifications
  getCareerInsights: () => fetchApi("/analytics/career-insights"),
  getNotifications: () => fetchApi("/analytics/notifications"),
  markAllNotificationsRead: () => fetchApi("/analytics/notifications/read-all", { method: "PUT" }),

  // Admin
  getAdminStats: () => fetchApi("/admin/stats"),
};
