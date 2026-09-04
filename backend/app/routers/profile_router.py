from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, User, JobSeekerProfile, HRProfile, UserSkill, Resume, GitHubProfile
from app.schemas import JobSeekerProfileUpdate, HRProfileUpdate
from app.auth import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.get("/job-seeker")
def get_job_seeker_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user or db.query(User).filter(User.email == "alex.sharma@example.com").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    profile = user.job_seeker_profile
    skills = [{"id": s.id, "name": s.name, "proficiency": s.proficiency, "source": s.source} for s in user.skills]
    resume = user.resumes[-1] if user.resumes else None
    gh = user.github_profile

    # Verification checklist
    verification_checklist = [
        {"item": "Email verified", "status": user.is_email_verified},
        {"item": "Phone verified", "status": user.is_phone_verified},
        {"item": "Profile completed", "status": bool(profile and profile.desired_role)},
        {"item": "Resume uploaded", "status": bool(resume)},
        {"item": "GitHub connected", "status": bool(gh)}
    ]
    verified_count = sum(1 for v in verification_checklist if v["status"])
    is_fully_verified = verified_count >= 4

    # Profile health calculation
    health_breakdown = {
        "resume": 95 if resume else 20,
        "skills": min(100, len(skills) * 10),
        "github": 90 if gh else 0,
        "career_preferences": 100 if profile and profile.desired_role else 40,
        "verification": int((verified_count / 5) * 100)
    }
    overall_health = int(sum(health_breakdown.values()) / 5)

    return {
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "avatar_url": user.avatar_url,
        "profile": {
            "headline": profile.headline if profile else "Full Stack Developer",
            "bio": profile.bio if profile else "",
            "city": profile.city if profile else "Bangalore",
            "country": profile.country if profile else "India",
            "linkedin": profile.linkedin if profile else "",
            "portfolio": profile.portfolio if profile else "",
            "desired_role": profile.desired_role if profile else "Full Stack Developer",
            "preferred_job_titles": profile.preferred_job_titles if profile else "Full Stack Developer",
            "preferred_locations": profile.preferred_locations if profile else "Bangalore, Remote",
            "work_type": profile.work_type if profile else "Hybrid",
            "employment_type": profile.employment_type if profile else "Full-time",
            "experience_level": profile.experience_level if profile else "Mid Level (2-4 yrs)",
            "experience_years": profile.experience_years if profile else 3.0,
            "expected_salary": profile.expected_salary if profile else "₹12L – ₹18L",
            "preferred_industries": profile.preferred_industries if profile else "SaaS, AI/ML",
            "education_degree": profile.education_degree if profile else "B.Tech in Computer Science"
        },
        "skills": skills,
        "health_score": overall_health,
        "health_breakdown": health_breakdown,
        "recommendations": [
            "Add 2 more projects to strengthen your profile.",
            "Add Docker to your skills if you have practical experience."
        ],
        "verification_checklist": verification_checklist,
        "is_profile_verified": is_fully_verified
    }

@router.put("/job-seeker")
def update_job_seeker_profile(req: JobSeekerProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user or db.query(User).filter(User.email == "alex.sharma@example.com").first()
    if not user or not user.job_seeker_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    p = user.job_seeker_profile
    for k, v in req.dict(exclude_unset=True).items():
        setattr(p, k, v)
        
    db.commit()
    return {"success": True, "message": "Profile updated successfully!"}

@router.get("/hr")
def get_hr_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user or db.query(User).filter(User.email == "sarah.jenkins@techcorp.example.com").first()
    hr = user.hr_profile if user else None
    if not hr:
        return {
            "company_name": "TechCorp Global",
            "company_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
            "industry": "Enterprise Cloud & AI Software",
            "company_size": "500-1000 employees",
            "location": "Bangalore, India",
            "website": "https://techcorpglobal.example.com",
            "recruiter_name": "Sarah Jenkins",
            "designation": "Lead Technical Talent Partner",
            "is_verified_recruiter": True
        }
    return {
        "company_name": hr.company_name,
        "company_logo": hr.company_logo,
        "industry": hr.industry,
        "company_size": hr.company_size,
        "location": hr.location,
        "website": hr.website,
        "recruiter_name": hr.recruiter_name,
        "designation": hr.designation,
        "is_verified_recruiter": hr.is_verified_recruiter,
        "is_website_verified": hr.is_website_verified
    }
