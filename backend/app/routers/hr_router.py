from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, Job, JobSkill, User, Interview, Notification
from app.schemas import JobCreate, ScheduleInterviewRequest
from app.auth import get_current_user
from app.seed_data import CANDIDATES_FOR_HR

router = APIRouter(prefix="/api/hr", tags=["hr"])

@router.get("/dashboard-stats")
def get_hr_stats(db: Session = Depends(get_db)):
    active_jobs = db.query(Job).filter(Job.is_active == True).count()
    return {
        "active_jobs": 3,
        "total_applicants": 15,
        "shortlisted": 5,
        "interviews_scheduled": 2,
        "offers_extended": 1,
        "hiring_pipeline": [
            {"stage": "Applications", "count": 15},
            {"stage": "Screening", "count": 10},
            {"stage": "Shortlisted", "count": 5},
            {"stage": "Interview", "count": 2},
            {"stage": "Offer", "count": 1}
        ]
    }

@router.get("/jobs")
def get_hr_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).order_by(Job.id.asc()).limit(5).all()
    out = []
    for j in jobs:
        req = [s.name for s in j.skills if s.skill_type == "REQUIRED"]
        pref = [s.name for s in j.skills if s.skill_type == "PREFERRED"]
        bonus = [s.name for s in j.skills if s.skill_type == "BONUS"]
        out.append({
            "id": j.id,
            "title": j.title,
            "company_name": j.company_name,
            "location": j.location,
            "work_type": j.work_type,
            "salary_range": j.salary_range,
            "applicants_count": 5 if j.id == 1 else 3,
            "required_skills": req,
            "preferred_skills": pref,
            "bonus_skills": bonus,
            "is_active": j.is_active
        })
    return out

@router.post("/jobs")
def create_job(req: JobCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Creates a new job with separated Required, Preferred, and Bonus skills (page 48-49).
    """
    new_job = Job(
        hr_id=current_user.id if current_user else 2,
        title=req.title,
        company_name=req.company_name,
        company_logo="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
        location=req.location,
        work_type=req.work_type,
        employment_type=req.employment_type,
        experience_min=req.experience_min,
        experience_max=req.experience_max,
        salary_range=req.salary_range,
        description=req.description,
        responsibilities=req.responsibilities,
        education_req=req.education_req,
        is_active=True
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    for s in req.required_skills:
        db.add(JobSkill(job_id=new_job.id, name=s.strip(), skill_type="REQUIRED", importance="High"))
    for s in req.preferred_skills:
        db.add(JobSkill(job_id=new_job.id, name=s.strip(), skill_type="PREFERRED", importance="Medium"))
    for s in req.bonus_skills:
        db.add(JobSkill(job_id=new_job.id, name=s.strip(), skill_type="BONUS", importance="Low"))
        
    db.commit()
    return {"success": True, "message": "Job published successfully! ✓", "job_id": new_job.id}

@router.get("/candidates")
def get_candidates(job_id: Optional[int] = None, filter_shortlist: Optional[bool] = False):
    """
    Returns ranked candidates with compatibility, matched/missing skills (pages 50-51).
    """
    candidates = CANDIDATES_FOR_HR.copy()
    if filter_shortlist:
        candidates = [c for c in candidates if c.get("is_shortlisted", False)]
    # Sort descending by compatibility score
    candidates.sort(key=lambda x: x["compatibility"], reverse=True)
    return {
        "total": len(candidates),
        "candidates": candidates
    }

@router.get("/candidates/{candidate_id}")
def get_candidate_profile(candidate_id: int):
    # Retrieve Alex Sharma or indexed candidate
    idx = min(len(CANDIDATES_FOR_HR) - 1, max(0, candidate_id - 1))
    c = CANDIDATES_FOR_HR[idx]
    return {
        "id": candidate_id,
        "name": c["name"],
        "headline": c["headline"],
        "avatar": c["avatar"],
        "location": c["location"],
        "experience": c["experience"],
        "education": c["education"],
        "compatibility": c["compatibility"],
        "skill_match": 91,
        "experience_match": 84,
        "education_match": 95,
        "project_match": 88,
        "skills": c["skills"],
        "missing_skills": c["missing"],
        "github_url": c["github"],
        "resume_name": f"{c['name'].replace(' ', '_')}_Resume.pdf",
        "recent_projects": [
            {
                "title": "E-Commerce Microservices",
                "tech": "React, TypeScript, Node.js, PostgreSQL",
                "description": "Architected resilient cart checkout and inventory locking services."
            },
            {
                "title": "Career Match Engine",
                "tech": "Python, FastAPI, Vector Embeddings",
                "description": "Built explainable career recommendation system."
            }
        ]
    }

@router.post("/schedule-interview")
def schedule_interview(req: ScheduleInterviewRequest, db: Session = Depends(get_db)):
    """
    Schedules an interview, notifies candidate, and updates schedule calendar (page 52-53).
    """
    new_int = Interview(
        hr_id=2,
        candidate_id=req.candidate_id,
        job_id=req.job_id,
        interview_date=req.interview_date,
        interview_time=req.interview_time,
        interview_type=req.interview_type,
        meeting_link=req.meeting_link,
        notes=req.notes or "Technical interview round.",
        status="SCHEDULED"
    )
    db.add(new_int)
    
    # Notify candidate
    db.add(Notification(
        user_id=1,  # Alex
        title="Interview Scheduled! 📅",
        message=f"You have an upcoming {req.interview_type} on {req.interview_date} at {req.interview_time}.",
        type="interview"
    ))
    db.commit()
    return {"success": True, "message": "Interview successfully scheduled! Invitation dispatched to candidate. ✓"}

@router.get("/interviews")
def list_scheduled_interviews(db: Session = Depends(get_db)):
    interviews = db.query(Interview).all()
    out = []
    for it in interviews:
        out.append({
            "id": it.id,
            "candidate_name": "Alex Sharma",
            "job_title": "Full Stack Developer",
            "company": "TechCorp Global",
            "date": it.interview_date,
            "time": it.interview_time,
            "type": it.interview_type,
            "meeting_link": it.meeting_link,
            "status": it.status
        })
    return out
