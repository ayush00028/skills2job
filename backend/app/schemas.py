from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr

# Auth Schemas
class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: Optional[bool] = False

class OTPVerify(BaseModel):
    email: EmailStr
    code: str

class RoleSelect(BaseModel):
    email: EmailStr
    role: str  # JOB_SEEKER or HR

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# Profile Schemas
class JobSeekerProfileUpdate(BaseModel):
    headline: Optional[str] = None
    bio: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None
    desired_role: Optional[str] = None
    preferred_job_titles: Optional[str] = None
    preferred_locations: Optional[str] = None
    work_type: Optional[str] = None
    employment_type: Optional[str] = None
    experience_level: Optional[str] = None
    expected_salary: Optional[str] = None
    preferred_industries: Optional[str] = None
    education_degree: Optional[str] = None

class HRProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    company_logo: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    recruiter_name: Optional[str] = None
    designation: Optional[str] = None

# Skill Schemas
class SkillItem(BaseModel):
    name: str
    proficiency: str = "Intermediate"  # Beginner, Intermediate, Advanced, Expert
    source: str = "manual"

# Job Schemas
class JobSkillInput(BaseModel):
    name: str
    skill_type: str = "REQUIRED"  # REQUIRED, PREFERRED, BONUS
    importance: str = "High"

class JobCreate(BaseModel):
    title: str
    company_name: str
    location: str
    work_type: str = "Hybrid"
    employment_type: str = "Full-time"
    experience_min: float = 2.0
    experience_max: float = 5.0
    salary_range: str = "₹12L – ₹20L"
    description: str
    responsibilities: Optional[str] = None
    education_req: str = "Bachelor's degree or equivalent"
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    bonus_skills: List[str] = []

# AI Matching & Resume Schemas
class ResumeAnalyzeRequest(BaseModel):
    raw_text: Optional[str] = None
    target_job_id: Optional[int] = None
    target_job_description: Optional[str] = None

class CoverLetterRequest(BaseModel):
    job_id: Optional[int] = None
    job_title: Optional[str] = "Full Stack Developer"
    company_name: Optional[str] = "TechCorp"
    tone: str = "Professional"  # Professional, Confident, Concise
    length: str = "Medium"     # Short, Medium, Detailed

class MockInterviewRequest(BaseModel):
    job_id: Optional[int] = None
    job_title: Optional[str] = "Full Stack Developer"
    difficulty: str = "Intermediate"  # Beginner, Intermediate, Advanced
    interview_type: str = "Mixed"     # Technical, Behavioral, Mixed

class MockInterviewAnswerSubmit(BaseModel):
    question_id: int
    question: str
    user_answer: str

class ApplicationStatusUpdate(BaseModel):
    status: str  # Saved, Applied, Assessment, Interview, Offer, Rejected

class ScheduleInterviewRequest(BaseModel):
    candidate_id: int
    job_id: int
    interview_date: str
    interview_time: str
    interview_type: str = "Technical Video Interview"
    meeting_link: str = "https://meet.google.com/skills2job-room"
    notes: Optional[str] = None
