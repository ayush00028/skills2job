from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, Job, JobSkill, User
from app.auth import get_current_user
from app.ai_engine import compute_compatibility_score

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

def build_job_dict(job: Job) -> dict:
    req_skills = [s.name for s in job.skills if s.skill_type == "REQUIRED"]
    pref_skills = [s.name for s in job.skills if s.skill_type == "PREFERRED"]
    bonus_skills = [s.name for s in job.skills if s.skill_type == "BONUS"]
    
    return {
        "id": job.id,
        "title": job.title,
        "company_name": job.company_name,
        "company_logo": job.company_logo or "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
        "location": job.location,
        "work_type": job.work_type,
        "employment_type": job.employment_type,
        "experience_min": job.experience_min,
        "experience_max": job.experience_max,
        "salary_range": job.salary_range,
        "description": job.description,
        "responsibilities": job.responsibilities,
        "education_req": job.education_req,
        "required_skills": req_skills,
        "preferred_skills": pref_skills,
        "bonus_skills": bonus_skills,
        "created_at": job.created_at.strftime("%Y-%m-%d") if job.created_at else "Recently"
    }

def get_candidate_context(user: User) -> dict:
    skills = [s.name for s in user.skills] if user and user.skills else ["React", "JavaScript", "Node.js", "Python", "SQL", "Git"]
    exp = user.job_seeker_profile.experience_years if (user and user.job_seeker_profile) else 3.0
    edu = user.job_seeker_profile.education_degree if (user and user.job_seeker_profile) else "B.Tech in Computer Science"
    repos = []
    if user:
        from app.database import GitHubRepository
        db_session = Session.object_session(user)
        if db_session:
            repos = db_session.query(GitHubRepository).filter(GitHubRepository.user_id == user.id).all()
            repos = [{"name": r.name, "description": r.description, "languages": r.languages, "detected_technologies": r.detected_technologies} for r in repos]
            
    return {
        "name": user.full_name if user else "Alex Sharma",
        "skills": skills,
        "experience_years": exp,
        "education_degree": edu,
        "github_repos": repos
    }

@router.get("")
def list_jobs(
    q: Optional[str] = None,
    location: Optional[str] = None,
    work_type: Optional[str] = None,
    experience: Optional[float] = None,
    min_score: Optional[int] = 0,
    sort_by: Optional[str] = "match",  # match, newest, salary
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = current_user or db.query(User).filter(User.email == "alex.sharma@example.com").first()
    cand_ctx = get_candidate_context(user)
    
    jobs_query = db.query(Job).filter(Job.is_active == True)
    all_jobs = jobs_query.all()
    
    results = []
    for job in all_jobs:
        job_dict = build_job_dict(job)
        
        # Apply text search filter
        if q:
            term = q.lower()
            in_title = term in job_dict["title"].lower()
            in_comp = term in job_dict["company_name"].lower()
            in_skills = any(term in s.lower() for s in job_dict["required_skills"] + job_dict["preferred_skills"])
            if not (in_title or in_comp or in_skills):
                continue
                
        # Apply location / work_type filter
        if work_type and work_type.lower() != "all" and work_type.lower() not in job_dict["work_type"].lower():
            continue
        if location and location.lower() != "all" and location.lower() not in job_dict["location"].lower():
            continue
            
        # AI Match calculation
        match_info = compute_compatibility_score(cand_ctx, job_dict)
        
        if min_score and match_info["overall_score"] < min_score:
            continue
            
        item = {
            **job_dict,
            "compatibility": match_info["overall_score"],
            "match_tier": match_info["match_tier"],
            "eligibility_status": match_info["eligibility_status"],
            "matched_skills": match_info["matched_skills"],
            "missing_skills": match_info["missing_skills"],
            "why_explanation": match_info["why_explanation"],
            "actionable_recommendation": match_info["actionable_recommendation"],
            "breakdown": match_info["breakdown"]
        }
        results.append(item)
        
    # Sort
    if sort_by == "salary":
        results.sort(key=lambda x: x["experience_min"], reverse=True)
    elif sort_by == "newest":
        results.sort(key=lambda x: x["id"], reverse=True)
    else:  # match
        results.sort(key=lambda x: x["compatibility"], reverse=True)
        
    return {
        "total": len(results),
        "jobs": results
    }

@router.get("/{job_id}")
def get_job_detail(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
        
    user = current_user or db.query(User).filter(User.email == "alex.sharma@example.com").first()
    cand_ctx = get_candidate_context(user)
    job_dict = build_job_dict(job)
    match_info = compute_compatibility_score(cand_ctx, job_dict)
    
    # Missing skill enrichment with market demand
    missing_enriched = []
    for skill in match_info["missing_skills"]:
        missing_enriched.append({
            "skill": skill,
            "importance": "High",
            "required_by_pct": "78% of similar roles",
            "why_it_matters": f"Essential for modern scalable infrastructure and {job_dict['title']} duties.",
            "recommendation": f"Learn {skill} fundamentals and add one practical containerized or cloud project."
        })
        
    return {
        **job_dict,
        "compatibility": match_info["overall_score"],
        "match_tier": match_info["match_tier"],
        "eligibility_status": match_info["eligibility_status"],
        "matched_skills": match_info["matched_skills"],
        "missing_skills": match_info["missing_skills"],
        "missing_skills_details": missing_enriched,
        "why_explanation": match_info["why_explanation"],
        "actionable_recommendation": match_info["actionable_recommendation"],
        "breakdown": match_info["breakdown"],
        "weights": match_info["weights"]
    }
