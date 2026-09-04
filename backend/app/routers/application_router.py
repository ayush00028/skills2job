from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, Application, Job, User
from app.schemas import ApplicationStatusUpdate
from app.auth import get_current_user
from app.routers.jobs_router import build_job_dict, get_candidate_context
from app.ai_engine import compute_compatibility_score

router = APIRouter(prefix="/api/applications", tags=["applications"])

@router.get("")
def get_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user or db.query(User).filter(User.email == "alex.sharma@example.com").first()
    cand_ctx = get_candidate_context(user)
    
    apps = db.query(Application).filter(Application.user_id == user.id).all() if user else []
    
    columns = {
        "Saved": [],
        "Applied": [],
        "Assessment": [],
        "Interview": [],
        "Offer": [],
        "Rejected": []
    }
    
    for app in apps:
        job = app.job
        if not job:
            continue
        job_dict = build_job_dict(job)
        m = compute_compatibility_score(cand_ctx, job_dict)
        card = {
            "id": app.id,
            "job_id": job.id,
            "title": job.title,
            "company_name": job.company_name,
            "company_logo": job_dict["company_logo"],
            "location": job.location,
            "salary": job.salary_range,
            "compatibility": m["overall_score"],
            "status": app.status,
            "applied_date": app.applied_date or "Recently",
            "notes": app.notes,
            "external_url": app.external_apply_url or f"https://careers.example.com/apply/{job.id}"
        }
        if app.status in columns:
            columns[app.status].append(card)
        else:
            columns["Saved"].append(card)
            
    total_apps = len(apps)
    interviews = len(columns["Interview"]) + len(columns["Offer"])
    offers = len(columns["Offer"])
    response_rate = int((interviews / max(1, total_apps)) * 100) if total_apps > 0 else 0
    
    return {
        "columns": columns,
        "analytics": {
            "total_applications": total_apps,
            "interviews": interviews,
            "offers": offers,
            "response_rate": f"{response_rate}%"
        }
    }

@router.post("/apply/{job_id}")
def apply_to_job(job_id: int, status_name: str = "Applied", db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user or db.query(User).filter(User.email == "alex.sharma@example.com").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    existing = db.query(Application).filter(Application.user_id == user.id, Application.job_id == job_id).first()
    if existing:
        existing.status = status_name
    else:
        app = Application(
            user_id=user.id,
            job_id=job_id,
            status=status_name,
            applied_date="Just now",
            notes="Application initiated from Skills2Job."
        )
        db.add(app)
        
    db.commit()
    return {"success": True, "message": f"Application status updated to '{status_name}'! ✓"}

@router.put("/{app_id}/status")
def update_application_status(app_id: int, req: ApplicationStatusUpdate, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application record not found")
        
    app.status = req.status
    db.commit()
    return {"success": True, "new_status": app.status}
