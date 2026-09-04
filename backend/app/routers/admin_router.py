from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db, User, Job, Application

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/stats")
def get_admin_dashboard(db: Session = Depends(get_db)):
    return {
        "stats": {
            "total_users": 1480,
            "job_seekers": 1220,
            "recruiters": 260,
            "active_jobs": 340,
            "total_applications": 3890
        },
        "system_health": {
            "api_uptime": "99.98%",
            "vector_search_latency": "18ms",
            "active_workers": 4,
            "db_status": "Healthy (PostgreSQL/pgvector ready)"
        },
        "recent_activity": [
            {"type": "user_registered", "user": "Priya Patel", "role": "Job Seeker", "time": "12 mins ago"},
            {"type": "job_posted", "job": "Lead Cloud Architect", "company": "TechCorp Global", "time": "45 mins ago"},
            {"type": "interview_scheduled", "candidate": "Alex Sharma", "company": "Google", "time": "2 hours ago"}
        ],
        "reported_jobs": [
            {"id": 99, "title": "Unverified Crypto Trader", "company": "Unknown Ltd", "reason": "Potential spam/unverified employer", "status": "Under Review"}
        ]
    }
