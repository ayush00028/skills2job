from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db, Notification, User
from app.auth import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/career-insights")
def get_career_insights(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {
        "overview": {
            "profile_strength": 94,
            "career_readiness": 87,
            "average_job_match": 82,
            "total_applications": 12,
            "interviews_secured": 3,
            "offers_received": 1
        },
        "strongest_skills": ["React", "JavaScript", "Node.js", "SQL", "Git"],
        "skills_to_improve": ["Docker", "AWS", "Kubernetes", "CI/CD"],
        "best_matching_roles": [
            {"role": "Full Stack Developer", "score": 94, "openings": 48},
            {"role": "Backend Developer", "score": 91, "openings": 36},
            {"role": "Software Engineer", "score": 88, "openings": 54},
            {"role": "Frontend Engineer", "score": 85, "openings": 29}
        ],
        "compatibility_trend": [
            {"month": "Nov", "score": 68},
            {"month": "Dec", "score": 74},
            {"month": "Jan", "score": 79},
            {"month": "Feb", "score": 83},
            {"month": "Mar", "score": 87}
        ],
        "skill_demand_market": [
            {"skill": "React", "demand_pct": 92, "in_profile": True},
            {"skill": "Node.js", "demand_pct": 86, "in_profile": True},
            {"skill": "Docker", "demand_pct": 82, "in_profile": False},
            {"skill": "AWS", "demand_pct": 78, "in_profile": False},
            {"skill": "Python", "demand_pct": 75, "in_profile": True},
            {"skill": "Kubernetes", "demand_pct": 65, "in_profile": False}
        ],
        "application_funnel": [
            {"stage": "Saved", "count": 22},
            {"stage": "Applied", "count": 12},
            {"stage": "Assessment", "count": 6},
            {"stage": "Interview", "count": 3},
            {"stage": "Offer", "count": 1}
        ],
        "impact_callout": "Adding Docker and AWS could increase your eligibility for 28 additional jobs."
    }

@router.get("/notifications")
def get_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user or db.query(User).filter(User.email == "alex.sharma@example.com").first()
    notes = db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.id.desc()).all() if user else []
    
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "is_read": n.is_read,
            "time": n.created_at.strftime("%I:%M %p") if n.created_at else "Just now"
        }
        for n in notes
    ]

@router.put("/notifications/read-all")
def mark_all_read(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user or db.query(User).filter(User.email == "alex.sharma@example.com").first()
    if user:
        db.query(Notification).filter(Notification.user_id == user.id).update({"is_read": True})
        db.commit()
    return {"success": True}
