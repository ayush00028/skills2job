from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db, Job, User
from app.auth import get_current_user
from app.routers.jobs_router import build_job_dict, get_candidate_context
from app.ai_engine import compute_compatibility_score

router = APIRouter(prefix="/api/matches", tags=["matches"])

@router.get("")
def get_my_matches(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user or db.query(User).filter(User.email == "alex.sharma@example.com").first()
    cand_ctx = get_candidate_context(user)
    
    all_jobs = db.query(Job).filter(Job.is_active == True).all()
    
    excellent = []
    strong = []
    potential = []
    low = []
    
    for job in all_jobs:
        job_dict = build_job_dict(job)
        m = compute_compatibility_score(cand_ctx, job_dict)
        item = {
            "id": job.id,
            "title": job.title,
            "company_name": job.company_name,
            "company_logo": job_dict["company_logo"],
            "location": job.location,
            "salary": job.salary_range,
            "score": m["overall_score"],
            "match_tier": m["match_tier"],
            "eligibility_status": m["eligibility_status"],
            "matched_skills": m["matched_skills"],
            "missing_skills": m["missing_skills"],
            "why_explanation": m["why_explanation"],
            "actionable_recommendation": m["actionable_recommendation"]
        }
        
        if m["overall_score"] >= 90:
            excellent.append(item)
        elif m["overall_score"] >= 75:
            strong.append(item)
        elif m["overall_score"] >= 60:
            potential.append(item)
        else:
            low.append(item)
            
    # Sort each tier descending
    for group in [excellent, strong, potential, low]:
        group.sort(key=lambda x: x["score"], reverse=True)
        
    all_sorted = excellent + strong + potential + low
    
    return {
        "counts": {
            "all": len(all_sorted),
            "excellent": len(excellent),
            "strong": len(strong),
            "potential": len(potential),
            "low": len(low)
        },
        "all": all_sorted,
        "excellent": excellent,
        "strong": strong,
        "potential": potential,
        "low": low
    }
