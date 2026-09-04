# Skills2Job 🚀

> *"Turn Your Skills Into Your Next Opportunity."*

Skills2Job is an AI-powered career matchmaking and recruitment platform built to solve algorithmic rejection. Instead of candidates blindly applying to hundreds of jobs, Skills2Job analyzes resumes, verified GitHub repositories, skills, and preferences to provide **5-factor explainable compatibility scores**, **skill-gap diagnostics**, **personalized learning plans**, and **interactive recruitment pipelines**.

---

## 🌟 Key Capabilities

### 1. Explainable AI Matching Engine
- **5-Factor Compatibility Score (0–100%)**:
  - **Required Skill Match (40%)**: Explicit comparison against mandatory role requirements.
  - **Experience Match (20%)**: Tenure and seniority comparison.
  - **Education Match (15%)**: Degree and field of study alignment.
  - **Project & GitHub Relevance (15%)**: Practical repository evidence and tech stack detection.
  - **ATS / Keyword Semantics (10%)**: Token cosine similarity and industry taxonomy matching.
- **Explainable Answers on Every Job**:
  - **WHAT?**: Match tier (*e.g. Strong Match 87%*).
  - **WHY?**: *9/10 required skills matched, 3 relevant GitHub projects detected, experience requirement satisfied.*
  - **WHAT'S MISSING?**: *Docker, AWS.*
  - **WHAT SHOULD I DO?**: *Learn Docker fundamentals and build one containerized project.*
  - **WHAT HAPPENS IF I DO?**: *Estimated match improvement: +7%, unlocking 28 additional jobs.*

### 2. Eligibility Engine vs Compatibility
- Prevents candidates from being penalized for lacking non-mandatory preferred or bonus skills.
- Classifies positions into:
  - `ELIGIBLE ✓`
  - `PARTIALLY ELIGIBLE`
  - `LOW MATCH`
- Separates skills into **Required**, **Preferred**, and **Bonus**.

### 3. Job Seeker Experience
- **Landing Page**: Modern SaaS aesthetic with live dashboard preview, visual pipeline, and 5-step workflow.
- **6-Step Onboarding Wizard**: Animated multi-stage resume parsing (`Uploading -> Extracting -> Identifying Skills -> Analyzing Experience -> Complete`).
- **Career Dashboard**: Profile health score (94/100), 5-factor compatibility breakdown, upcoming interviews.
- **Job Search & Smart Filters**: Location, work mode (Remote/Hybrid/On-site), salary, and minimum match score slider.
- **Resume Compatibility Analyzer**: ATS diagnostics, missing keywords, and Before/After rewrite suggestions.
- **Skill Gap & 4-Week Career Learning Roadmap**: Converts missing skills into structured weekly project roadmaps.
- **GitHub Insights**: Open-source repository analysis, commit tech detection, and *"Add Project to Resume"* bullet generator.
- **Kanban Application Tracker**: Interactive stages (`Saved`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`) with conversion analytics.
- **AI Cover Letter Generator**: Generates customized letters based on actual skills and projects with Tone and Length controls.
- **AI Mock Interview Simulator**: Dynamic technical and behavioral questions with comprehensive score reports.
- **Career Insights**: Interactive Recharts telemetry (compatibility trends, market skill demand, application funnels).
- **Verification Center**: Checklist and verified candidate badges.

### 4. HR & Recruiter Portal
- **Recruiter Dashboard**: Active postings, applicant tracking, and hiring pipeline metrics.
- **Job Creator**: Post jobs with separated Required vs Preferred vs Bonus skills.
- **AI Candidate Matching & Ranking**: Rank candidates by compatibility, inspect profile drawers, and review code links.
- **Interview Management**: Schedule technical video interviews with Google Meet links.

### 5. Viva & Technical Presentation Visualizer (`/viva`)
- Interactive end-to-end architecture pipeline showing:
  `Resume -> PDF Parser -> NLP -> Embeddings` vs `Job Description -> Requirements Parser -> Embeddings -> Cosine Similarity + 5-Factor Rules -> Compatibility Score -> Skill Gap -> Ranking`.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Python 3.12, FastAPI, Pydantic, SQLAlchemy, Vector Cosine Similarity Engine.
- **Database**: SQLite (Production-ready for PostgreSQL + pgvector).

---

## 🚀 Quick Start Guide

### 1. Run Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Run Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Web Application: [http://localhost:3000](http://localhost:3000)

---

## ⚡ Instant Demo Access
The platform includes 1-click demo accounts built into the navigation bar and login page:
- **Job Seeker**: Alex Sharma (`alex.sharma@example.com` / `DemoAlex2026!`)
- **HR Recruiter**: Sarah Jenkins (`sarah.jenkins@techcorp.example.com` / `DemoRecruiter2026!`)
- **Superadmin**: Admin (`admin@skills2job.example.com` / `AdminSkills2026!`)

---

## 📄 License
MIT License
