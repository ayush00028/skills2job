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
        
    profile = db.query(JobSeekerProfile).filter(JobSeekerProfile.user_id == user.id).first()
    skills = [{"id": s.id, "name": s.name, "skill_name": s.name, "proficiency": s.proficiency, "source": s.source} for s in user.skills]
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

    headline = profile.headline if profile else "Full Stack Developer"
    bio = profile.bio if profile else ""
    city = profile.city if profile else "Bangalore"
    country = profile.country if profile else "India"
    desired_role = profile.desired_role if profile else "Full Stack Developer"
    exp_years = profile.experience_years if profile else 3.0
    edu_deg = profile.education_degree if profile else "B.Tech in Computer Science"

    return {
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "avatar_url": user.avatar_url,
        "headline": headline,
        "bio": bio,
        "city": city,
        "desired_role": desired_role,
        "experience_years": exp_years,
        "education_degree": edu_deg,
        "profile": {
            "headline": headline,
            "bio": bio,
            "city": city,
            "country": country,
            "linkedin": profile.linkedin if profile else "",
            "portfolio": profile.portfolio if profile else "",
            "desired_role": desired_role,
            "preferred_job_titles": profile.preferred_job_titles if profile else "Full Stack Developer",
            "preferred_locations": profile.preferred_locations if profile else "Bangalore, Remote",
            "work_type": profile.work_type if profile else "Hybrid",
            "employment_type": profile.employment_type if profile else "Full-time",
            "experience_level": profile.experience_level if profile else "Mid Level (2-4 yrs)",
            "experience_years": exp_years,
            "expected_salary": profile.expected_salary if profile else "₹12L – ₹18L",
            "preferred_industries": profile.preferred_industries if profile else "SaaS, AI/ML",
            "education_degree": edu_deg
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
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    p = db.query(JobSeekerProfile).filter(JobSeekerProfile.user_id == user.id).first()
    if not p:
        p = JobSeekerProfile(user_id=user.id)
        db.add(p)
        db.commit()
        db.refresh(p)

    # Update User model fields
    if req.full_name is not None and req.full_name.strip():
        user.full_name = req.full_name.strip()
    if req.phone is not None:
        user.phone = req.phone.strip()

    # Update JobSeekerProfile fields
    profile_fields = [
        "headline", "bio", "city", "country", "linkedin", "portfolio",
        "desired_role", "preferred_job_titles", "preferred_locations",
        "work_type", "employment_type", "experience_level", "experience_years",
        "expected_salary", "preferred_industries", "education_degree"
    ]
    for field in profile_fields:
        val = getattr(req, field, None)
        if val is not None:
            setattr(p, field, val)

    # Update skills if provided
    if req.skills is not None:
        db.query(UserSkill).filter(UserSkill.user_id == user.id).delete()
        for s in req.skills:
            if isinstance(s, str):
                name = s.strip()
                prof = "Intermediate"
                src = "manual"
            elif isinstance(s, dict):
                name = (s.get("name") or s.get("skill_name") or "").strip()
                prof = s.get("proficiency", s.get("level", "Intermediate"))
                src = s.get("source", "manual")
            else:
                continue
            if name:
                db.add(UserSkill(user_id=user.id, name=name, proficiency=prof, source=src, verified=True))

    db.commit()
    db.refresh(user)
    return {
        "success": True,
        "message": "Profile and skills saved dynamically in database!",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone
        }
    }

@router.post("/skills")
def add_user_skill(skill: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user or db.query(User).filter(User.email == "alex.sharma@example.com").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    name = skill.get("name", "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Skill name is required")
    existing = db.query(UserSkill).filter(UserSkill.user_id == user.id, UserSkill.name.ilike(name)).first()
    if existing:
        existing.proficiency = skill.get("proficiency", existing.proficiency)
    else:
        new_s = UserSkill(
            user_id=user.id,
            name=name,
            proficiency=skill.get("proficiency", "Intermediate"),
            source="manual",
            verified=True
        )
        db.add(new_s)
    db.commit()
    return {"success": True, "message": f"Skill '{name}' added successfully"}

@router.delete("/skills/{skill_name}")
def delete_user_skill(skill_name: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user or db.query(User).filter(User.email == "alex.sharma@example.com").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.query(UserSkill).filter(UserSkill.user_id == user.id, UserSkill.name.ilike(skill_name)).delete(synchronize_session=False)
    db.commit()
    return {"success": True, "message": f"Skill '{skill_name}' removed"}

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
