from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, event
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = "sqlite:///./skills2job.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Enable SQLite Write-Ahead Logging (WAL), busy timeout, and synchronous=NORMAL for concurrent speed & durability
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL;")
    cursor.execute("PRAGMA synchronous=NORMAL;")
    cursor.execute("PRAGMA busy_timeout=5000;")
    cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="JOB_SEEKER")  # JOB_SEEKER, HR, ADMIN
    phone = Column(String(50), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    is_email_verified = Column(Boolean, default=False)
    is_phone_verified = Column(Boolean, default=False)
    verification_code = Column(String(10), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    job_seeker_profile = relationship("JobSeekerProfile", back_populates="user", uselist=False)
    hr_profile = relationship("HRProfile", back_populates="user", uselist=False)
    resumes = relationship("Resume", back_populates="user")
    skills = relationship("UserSkill", back_populates="user")
    github_profile = relationship("GitHubProfile", back_populates="user", uselist=False)
    applications = relationship("Application", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class JobSeekerProfile(Base):
    __tablename__ = "job_seeker_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    headline = Column(String(255), default="Full Stack Developer")
    bio = Column(Text, nullable=True)
    city = Column(String(100), default="Bangalore")
    country = Column(String(100), default="India")
    linkedin = Column(String(255), nullable=True)
    portfolio = Column(String(255), nullable=True)
    
    # Career preferences
    desired_role = Column(String(255), default="Full Stack Developer")
    preferred_job_titles = Column(Text, default="Software Engineer, Full Stack Developer, Backend Developer")
    preferred_locations = Column(Text, default="Bangalore, Hyderabad, Remote")
    work_type = Column(String(50), default="Hybrid")  # Remote, Hybrid, On-site
    employment_type = Column(String(50), default="Full-time")
    experience_level = Column(String(50), default="Mid Level (2-4 yrs)")
    experience_years = Column(Float, default=3.0)
    expected_salary = Column(String(100), default="₹12L – ₹18L")
    preferred_industries = Column(Text, default="SaaS, FinTech, AI/ML")
    education_degree = Column(String(255), default="B.Tech in Computer Science")
    
    # Scores
    profile_score = Column(Integer, default=94)
    profile_health = Column(Integer, default=94)
    career_readiness = Column(Integer, default=87)
    
    user = relationship("User", back_populates="job_seeker_profile")

class HRProfile(Base):
    __tablename__ = "hr_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    company_name = Column(String(255), default="TechCorp Global")
    company_logo = Column(String(500), default="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60")
    industry = Column(String(255), default="Enterprise Cloud & AI Software")
    company_size = Column(String(100), default="500-1000 employees")
    location = Column(String(255), default="Bangalore, India")
    website = Column(String(255), default="https://techcorpglobal.example.com")
    recruiter_name = Column(String(255), default="Sarah Jenkins")
    designation = Column(String(255), default="Lead Technical Talent Partner")
    is_verified_recruiter = Column(Boolean, default=True)
    is_website_verified = Column(Boolean, default=True)

    user = relationship("User", back_populates="hr_profile")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String(255), default="Alex_Sharma_Resume.pdf")
    file_path = Column(String(500), nullable=True)
    raw_text = Column(Text, nullable=True)
    parsed_json = Column(Text, nullable=True)  # JSON with skills, education, experience, projects, etc.
    ats_score = Column(Integer, default=89)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resumes")

class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100), nullable=False)
    proficiency = Column(String(50), default="Advanced")  # Beginner, Intermediate, Advanced, Expert
    source = Column(String(50), default="resume")  # resume, github, manual
    verified = Column(Boolean, default=True)

    user = relationship("User", back_populates="skills")

class GitHubProfile(Base):
    __tablename__ = "github_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    username = Column(String(100), default="alexsharma-dev")
    avatar_url = Column(String(500), default="https://avatars.githubusercontent.com/u/583231?v=4")
    repos_count = Column(Integer, default=18)
    followers = Column(Integer, default=142)
    following = Column(Integer, default=89)
    contributions = Column(Integer, default=420)
    top_languages = Column(Text, default="TypeScript, Python, JavaScript, HTML/CSS")
    connected_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="github_profile")

class GitHubRepository(Base):
    __tablename__ = "github_repositories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    languages = Column(String(255), default="TypeScript, React, Node.js")
    stars = Column(Integer, default=0)
    forks = Column(Integer, default=0)
    detected_technologies = Column(Text, default="")
    last_updated = Column(String(100), default="2 days ago")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    hr_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    company_logo = Column(String(500), nullable=True)
    location = Column(String(255), default="Bangalore • Hybrid")
    work_type = Column(String(50), default="Hybrid")
    employment_type = Column(String(50), default="Full-time")
    experience_min = Column(Float, default=2.0)
    experience_max = Column(Float, default=5.0)
    salary_range = Column(String(100), default="₹10L – ₹18L")
    description = Column(Text, nullable=False)
    responsibilities = Column(Text, nullable=True)
    education_req = Column(String(255), default="Bachelor's in Computer Science or equivalent")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")
    matches = relationship("JobMatch", back_populates="job")
    applications = relationship("Application", back_populates="job")

class JobSkill(Base):
    __tablename__ = "job_skills"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    name = Column(String(100), nullable=False)
    skill_type = Column(String(50), default="REQUIRED")  # REQUIRED, PREFERRED, BONUS
    importance = Column(String(50), default="High")

    job = relationship("Job", back_populates="skills")

class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    
    # 5 Explainable Matching Components
    overall_score = Column(Integer, default=85)
    skill_score = Column(Integer, default=90)
    experience_score = Column(Integer, default=85)
    education_score = Column(Integer, default=95)
    project_score = Column(Integer, default=88)
    ats_score = Column(Integer, default=82)
    
    match_tier = Column(String(50), default="Strong Match")  # Excellent Match (90-100), Strong Match (75-89), Potential Match (60-74), Low Match (<60)
    eligibility_status = Column(String(50), default="ELIGIBLE")  # ELIGIBLE, PARTIALLY ELIGIBLE, LOW MATCH
    
    matched_skills = Column(Text, default="[]")  # JSON array
    missing_skills = Column(Text, default="[]")  # JSON array
    why_explanation = Column(Text, default="")
    actionable_recommendation = Column(Text, default="")
    
    job = relationship("Job", back_populates="matches")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    status = Column(String(50), default="Saved")  # Saved, Applied, Assessment, Interview, Offer, Rejected
    applied_date = Column(String(50), default="Today")
    notes = Column(Text, nullable=True)
    external_apply_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    hr_id = Column(Integer, ForeignKey("users.id"))
    candidate_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    interview_date = Column(String(100), default="2026-09-12")
    interview_time = Column(String(100), default="02:30 PM IST")
    interview_type = Column(String(100), default="Technical Video Interview")
    meeting_link = Column(String(500), default="https://meet.google.com/xyz-skills-job")
    notes = Column(Text, default="Focus on full-stack architecture, React optimization, and REST API design.")
    status = Column(String(50), default="SCHEDULED")  # SCHEDULED, COMPLETED, CANCELLED

class LearningPlan(Base):
    __tablename__ = "learning_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255), default="Full Stack Modernization & Cloud Readiness")
    weeks_json = Column(Text, default="[]")
    potential_boost = Column(String(50), default="+7% Match Boost")
    jobs_unlocked = Column(Integer, default=28)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info")  # match, interview, resume, alert
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class OTPRecord(Base):
    __tablename__ = "otp_records"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), index=True, nullable=False)
    code = Column(String(10), nullable=False)
    purpose = Column(String(50), default="LOGIN")  # LOGIN, REGISTER, VERIFY
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
