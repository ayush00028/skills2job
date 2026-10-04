# Skills2Job 🚀

> *"Turn Your Skills Into Your Next Opportunity."*

Skills2Job is an intelligent, full-stack career matchmaking and talent acquisition platform built to solve algorithmic rejection. The platform ingests candidate resumes, analyzes connected GitHub repositories, evaluates career preferences, and compares them against multi-tiered job requirements to provide **5-factor explainable compatibility scores**, **eligibility evaluation**, **skill-gap diagnostics**, **personalized 4-week learning roadmaps**, and **interactive recruitment pipelines**.

All user profiles, resumes, skills, GitHub connections, and applications are dynamically persisted in an SQLite relational database with real-time recalculation of compatibility and ATS scores.

---

## 🌟 Key Capabilities

### 1. Explainable AI Matching Engine
- **5-Factor Compatibility Score (0–100%)**:
  - **Required Skill Match (40%)**: Explicit comparison against mandatory role requirements with synonym clustering.
  - **Experience Match (20%)**: Tenure and seniority comparison.
  - **Education Match (15%)**: Degree and field of study alignment.
  - **Project & GitHub Relevance (15%)**: Practical repository evidence and tech stack detection.
  - **ATS / Keyword Semantics (10%)**: Token cosine similarity and industry taxonomy matching.
- **Explainable Answers on Every Job**:
  - **WHAT?**: Match tier (*e.g. Strong Match 87%*).
  - **WHY?**: *9/10 required skills matched, 3 relevant GitHub projects detected, experience requirement satisfied.*
  - **WHAT'S MISSING?**: *Docker, AWS.*
  - **WHAT SHOULD I DO?**: *Learn Docker fundamentals and build one containerized project.*
  - **WHAT HAPPENS IF I DO?**: *Estimated match improvement: +7%, unlocking additional jobs.*

### 2. Eligibility Engine vs Compatibility
- Prevents candidates from being penalized for lacking non-mandatory preferred or bonus skills.
- Classifies positions into:
  - `ELIGIBLE ✓`
  - `PARTIALLY ELIGIBLE`
  - `LOW MATCH`
- Separates skills into **Required**, **Preferred**, and **Bonus**.

### 3. Dynamic User Persistence & Session Management
- **Stateless JWT Authentication**: Secure password hashing with persistent sessions.
- **6-Digit Email OTP Verification**: Real email verification flow with countdown timers and resend throttling.
- **Persistent SQLite Database**: Dynamic storage of user profiles, skills, resumes, and applications without dummy-data fallbacks.
- **Dynamic Compatibility Recalculation**: Authenticated job seekers see personalized compatibility scores dynamically computed against their own profile.

### 4. Interactive Resume Management & Re-Evaluation
- **Multi-Format Ingestion**: Upload resumes in `.pdf`, `.docx`, `.doc`, or `.txt`.
- **Automated Text & Skill Extraction**: Extracts technical competencies, tenure, and ATS score.
- **Resume Viewer & Re-upload in `/profile`**: Inspect current uploaded resume metadata and re-upload new iterations to immediately re-evaluate candidate compatibility across all active listings.

### 5. Real GitHub Profile Intelligence
- **Custom Profile Input**: Connect any public GitHub profile via URL (`https://github.com/username`) or handle (`@username`).
- **Public API Integration**: Fetches real repository counts, language distribution, and profile avatars.
- **Resume Project Synthesizer**: Converts open-source projects into impact-driven resume bullet points.

### 6. Career Accelerator Tools
- **Skill Gap & 4-Week Roadmap**: Converts missing competencies into structured project milestones.
- **AI Cover Letter Generator**: Generates customized cover letters referencing real projects with Tone and Length controls.
- **AI Mock Interview Simulator**: Dynamic technical and behavioral questions with comprehensive score reports.
- **Kanban Application Tracker**: Interactive stages (`Saved`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`) with conversion analytics.
- **Career Insights**: Interactive Recharts telemetry (compatibility trends, market skill demand, application funnels).

### 7. Unified Global Dark Mode
- Full system-wide Dark and Light mode support with persistent state across all 15+ pages.
- Accessible via Navbar and centralized Settings modal.

### 8. Recruiter & Admin Portals
- **Recruiter Dashboard**: Manage job postings with 3-tier skill requirements (Required, Preferred, Bonus).
- **Candidate Ranking**: Rank applicants by compatibility score with candidate detail drawers and interview scheduling.
- **Superadmin Telemetry & Viva Visualizer**: System health telemetry and interactive vector pipeline visualizer (`/viva`).

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Python 3.12, FastAPI, Pydantic v2, SQLAlchemy, Uvicorn.
- **Database**: SQLite (Production-ready for PostgreSQL + pgvector).
- **NLP / Matching**: Scikit-Learn (TF-IDF & Cosine Similarity), PDF/DOCX parsing, Regex tokenizers.

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
The platform includes 1-click demo accounts built into the Settings modal and login page:
- **Job Seeker**: Alex Sharma (`alex.sharma@example.com` / `DemoAlex2026!`)
- **HR Recruiter**: Sarah Jenkins (`sarah.jenkins@techcorp.example.com` / `DemoRecruiter2026!`)
- **Superadmin**: Admin (`admin@skills2job.example.com` / `AdminSkills2026!`)

---
