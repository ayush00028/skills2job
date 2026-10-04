# PROJECT SYNOPSIS

## 1. PROJECT TITLE & TAGLINE
- **Project Title**: **Skills2Job**
- **Tagline**: *"Turn Your Skills Into Your Next Opportunity."*
- **Domain**: Artificial Intelligence / Natural Language Processing / Full-Stack Web Systems / Human Resources Tech (HRTech)

---

## 2. EXECUTIVE SUMMARY
In today’s recruitment landscape, job seekers face severe friction due to opaque Applicant Tracking Systems (ATS) and algorithmic resume screening. Candidates submit hundreds of applications blindly without understanding how well their technical competencies align with employer requirements or what specific skills disqualify them. 

**Skills2Job** is an intelligent, full-stack career matchmaking and talent acquisition platform designed to solve algorithmic rejection. The platform ingests candidate resumes, analyzes connected GitHub repositories, evaluates career preferences, and compares them against multi-tiered job requirements. It delivers an **Explainable 5-Factor Compatibility Score (0–100%)**, separates mandatory prerequisites from optional skills via an **Eligibility Engine**, diagnoses **Skill Gaps** with market demand metrics, generates **4-Week Project-Based Learning Roadmaps**, and provides reciprocal matchmaking for recruiters.

All user activities—authentication (JWT + 6-digit email OTP), onboarding profile details, custom GitHub profiles, uploaded resumes, and skill inventories—are dynamically persisted in a relational database with real-time recalculation of job compatibility and ATS scoring.

---

## 3. PROBLEM STATEMENT
1. **Blind Applications & Opaque Rejection**: Job seekers submit resumes into "black hole" ATS platforms with zero visibility into why they were rejected or how their resume was parsed.
2. **Conflation of Eligibility and Compatibility**: Traditional job boards disqualify candidates for lacking optional or nice-to-have technologies, even when they satisfy all core prerequisites.
3. **Lack of Actionable Feedback**: Current platforms provide static score numbers without actionable answers to *"What is missing?"* and *"What should I do to qualify?"*.
4. **Disconnection Between Code Proof and Resumes**: Written resumes often fail to reflect practical coding competencies verifiable in open-source code repositories (e.g., GitHub).
5. **Static/Mock Data Inconsistencies**: Many career platforms present pre-rendered dummy profiles rather than dynamically storing and matching the user's authentic skills and experience upon sign-in.
6. **Inefficient Candidate Screening for Employers**: Recruiters spend excessive hours sifting through non-tailored resumes rather than evaluating pre-ranked, competency-verified candidate profiles.

---

## 4. OBJECTIVES OF THE PROJECT
- Develop an NLP-driven resume parsing pipeline capable of extracting technical competencies, education, and tenure from multi-format files (`.pdf`, `.docx`, `.txt`) into structured schema.
- Implement an automated GitHub intelligence module that parses custom repository profiles or handles (`https://github.com/username`), extracts repositories, infers tech stacks, and formats impact-driven bullet points for resumes.
- Implement secure, persistent authentication utilizing JSON Web Tokens (JWT) and 6-digit email One-Time Passwords (OTP).
- Formulate a transparent, 5-factor explainable matching algorithm blending deterministic rules with semantic dense vector embeddings.
- Engineer an Eligibility vs Compatibility Engine that evaluates Required, Preferred, and Bonus skills independently.
- Provide dynamic profile management with an interactive Resume Viewer and Re-upload system that automatically re-evaluates candidate compatibility across all jobs upon resume updates.
- Formulate dynamic career progression tools: Skill Gap Analysis, 4-Week Actionable Roadmaps, AI Cover Letter Generator, AI Mock Interview Simulator, and a Kanban Application Tracker.
- Implement an accessible, high-contrast Dark and Light mode theme engine across the entire interface.
- Provide a dedicated Recruiter Portal for candidate discovery, multi-tiered job postings, and interview management.
- Provide an interactive Technical Viva Visualizer demonstrating the end-to-end vector pipeline for evaluation and academic review.

---

## 5. SYSTEM ARCHITECTURE & DATA FLOW

### Ingestion to Recommendation Pipeline
```
[Candidate Resume (PDF/DOCX/TXT)] ──> [Text Extraction & Sanitization] ──> [NLP / Keyword Parser] ──> [Dynamic SQLite DB]
                                                                                                               │
[User GitHub URL / Handle]        ──> [GitHub Public API Integration]  ──> [Code Intelligence Engine] ────────┤
                                                                                                               ▼
[Candidate Authenticated Profile] ─────────────────────────────────────────────────────────────> [Candidate Feature Vector] ──┐
                                                                                                                                ├──> [5-Factor Matching & Cosine Engine]
[Job Description (Structured)]    ──> [3-Tier Skill Segmentation: Req/Pref/Bonus] ─────────────> [Job Feature Vector]        ──┘         │
                                                                                                                                           ▼
                                                                                                                               [Explainable Compatibility Score]
                                                                                                                                           │
                                                                                                                                           ├─> [Eligibility Status: Eligible / Partial / Low]
                                                                                                                                           ├─> [Skill Gap Analysis & 4-Week Roadmap]
                                                                                                                                           ├─> [AI Mock Interview & Cover Letter]
                                                                                                                                           └─> [Recruiter Ranked Candidate Pool]
```

---

## 6. MATHEMATICAL & ALGORITHMIC FORMULATION

### A. Semantic Vector Similarity (Cosine Metric)
Given a Candidate dense vector $\vec{C}$ and a Job requirement vector $\vec{J}$ in $n$-dimensional embedding space:
$$\text{Cosine Similarity}(\vec{C}, \vec{J}) = \frac{\vec{C} \cdot \vec{J}}{\|\vec{C}\| \|\vec{J}\|} = \frac{\sum_{i=1}^{n} C_i J_i}{\sqrt{\sum_{i=1}^{n} C_i^2} \sqrt{\sum_{i=1}^{n} J_i^2}}$$

### B. 5-Factor Weighted Compatibility Model
To eliminate arbitrary scores, the system calculates explainable compatibility using calibrated weights:
$$\text{Score}_{\text{Overall}} = (0.40 \times S_{\text{Skills}}) + (0.20 \times S_{\text{Experience}}) + (0.15 \times S_{\text{Education}}) + (0.15 \times S_{\text{Projects}}) + (0.10 \times S_{\text{ATS}})$$

Where:
- **$S_{\text{Skills}}$ (40% Weight)**: Evaluation of mandatory required skills with synonym clustering ($\text{React} \equiv \text{React.js}$, $\text{Node} \equiv \text{Node.js}$).
- **$S_{\text{Experience}}$ (20% Weight)**: Candidate tenure vs position minimums.
- **$S_{\text{Education}}$ (15% Weight)**: Degree level and academic discipline alignment.
- **$S_{\text{Projects}}$ (15% Weight)**: Verified GitHub repository projects matching job tech stacks.
- **$S_{\text{ATS}}$ (10% Weight)**: Exact keyword and token distribution.

### C. Eligibility Engine Decision Rule
$$\text{Status} = \begin{cases} 
\text{ELIGIBLE} & \text{if } \frac{|\text{Matched Required}|}{|\text{Total Required}|} \ge 0.80 \text{ and } \text{Tenure} \ge (\text{Min} - 0.5) \\
\text{PARTIALLY ELIGIBLE} & \text{if } \frac{|\text{Matched Required}|}{|\text{Total Required}|} \ge 0.60 \\
\text{LOW MATCH} & \text{otherwise}
\end{cases}$$

---

## 7. MODULE DESCRIPTION

### Module 1: Authentication, OTP Verification & Session Persistence
- Secure user registration and login supporting multi-persona roles: `JOB_SEEKER`, `HR` (Recruiter), and `ADMIN`.
- **6-Digit Email OTP Verification**: Cryptographically secure one-time password workflow verifying email ownership with resend throttles and expiration timers.
- **JWT Session Persistence**: Stateless authentication with bearer token authorization, persisting authenticated candidate data across sessions.
- **1-Click Demo Portals**: Seamless evaluation mode with pre-configured personas (Alex Sharma, Sarah Jenkins, Admin) accessible via quick-access controls.

### Module 2: Dynamic Candidate Profile & Resume Re-Evaluation
- Comprehensive candidate schema stored in SQLite: personal information, headline, experience years, location, education, target salary, and skill badges.
- **Multi-Format Resume Parser**: Supports `.pdf`, `.docx`, and `.txt` uploads with automated extraction of skills, education, and ATS score.
- **Resume Viewer & Re-upload System**: Candidates can view active resume metadata and re-upload new iterations directly from `/profile`, immediately triggering automated compatibility re-evaluation across all active listings.

### Module 3: Real GitHub Code Intelligence
- Replaces static placeholders with custom GitHub input (`https://github.com/username` or `@username`).
- Connects to GitHub's public API to dynamically fetch public repositories, primary languages, avatar URLs, and activity stats.
- Translates repository data into quantified, impact-oriented resume achievement bullets (*"Add Project to Resume"*).

### Module 4: Explainable Career Matchmaker & Search
- Live multi-filter search engine (Job title, Location, Remote/Hybrid mode, Minimum Match Score slider, Experience).
- Smart Job Cards displaying company branding, salary range, compatibility badge, checked matched skills, and alerted missing skills.
- Transparent drill-down answering: **WHAT?**, **WHY?**, **WHAT'S MISSING?**, **WHAT SHOULD I DO?**, and **WHAT HAPPENS IF I DO?**.
- Evaluates dynamically against the authenticated user's actual stored skills, ensuring genuine match scores.

### Module 5: Skill Gap Diagnostics & 4-Week Learning Roadmap
- Categorizes skills into **You Have** vs **You're Missing**.
- Missing skills classified into HIGH, MEDIUM, and LOW priority based on market hiring volume and projected match boost.
- 4-week structured project roadmap converting missing competencies into actionable deliverables.

### Module 6: Career Accelerator Tools
- **AI Cover Letter Generator**: Creates targeted, non-generic cover letters referencing actual projects with Tone (Professional, Confident, Concise) and Length controls.
- **AI Mock Interview Simulator**: Generates technical, behavioral, and skill-gap questions with structured evaluation reports across Technical Rigor, Communication, and Problem Solving.
- **Kanban Application Tracker**: Visual board managing stages (`Saved`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`) with conversion analytics.

### Module 7: HR & Recruiter Management Portal
- Three-tier skill definition on job creation: **REQUIRED** (strict weight), **PREFERRED** (bonus), and **BONUS** (nice to have).
- AI candidate ranking sorting applicants by compatibility score with candidate profile drawers.
- Interview management module allowing recruiters to schedule video screens with Google Meet links.

### Module 8: Unified Dark Mode & Settings Hub
- High-contrast, theme-aware user interface supporting dynamic toggle between Light and Dark modes across all 15+ pages.
- Integrated Settings Hub accessible from any page to configure appearance, manage session, and switch role portals.

### Module 9: Superadmin Telemetry & Viva Visualizer
- System monitoring tracking API uptime, vector search latency, active jobs, and moderation logs.
- Dedicated interactive Technical Architecture Visualizer (`/viva`) designed for academic defense.

---

## 8. HARDWARE & SOFTWARE REQUIREMENTS

### Software Requirements
- **Operating System**: Windows 10/11, macOS, or Linux.
- **Frontend Framework**: Next.js 14+ (React 18+, TypeScript, App Router).
- **Styling & UI**: Tailwind CSS (dark mode enabled), Lucide Icons, Recharts.
- **Backend Framework**: Python 3.12, FastAPI, Uvicorn, Pydantic v2.
- **ORM & Database**: SQLAlchemy with SQLite (production-ready for PostgreSQL + pgvector).
- **Natural Language Processing**: Scikit-Learn (TF-IDF & Cosine Similarity), PDF/DOCX text parsers, regex tokenizers.
- **Version Control**: Git, GitHub.

### Hardware Requirements
- **Processor**: Intel Core i3 / AMD Ryzen 3 or higher.
- **RAM**: Minimum 4 GB (8 GB recommended).
- **Storage**: Minimum 1 GB available disk space.
- **Network**: Localhost environment (Internet connection required for remote package assets and GitHub API lookup).

---

## 9. FUTURE ENHANCEMENTS & ROADMAP
1. **Browser Extension (Chrome/Edge)**: One-click candidate matching while browsing external job sites (LinkedIn, Indeed).
2. **External Job Board Connectors**: Ingestion scrapers for live employer postings via Greenhouse and Lever APIs.
3. **Automated Application Dispatch**: One-click application submission via official company career APIs.
4. **Audio AI Mock Interview**: Voice-based bidirectional evaluation utilizing speech-to-text and tone modulation analysis.

---

## 10. CONCLUSION
Skills2Job transforms job searching from a frustrating guessing game into a structured, transparent, and actionable career acceleration process. By providing explainable AI compatibility scores, safeguarding candidates from unfair disqualifications through the Eligibility Engine, providing dynamic data persistence, and supplying structured 4-week learning roadmaps, the platform delivers significant value to both aspiring technical professionals and corporate hiring teams.
