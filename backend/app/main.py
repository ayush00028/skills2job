from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database
from app.routers import (
    auth_router, profile_router, jobs_router, match_router,
    resume_router, github_router, skill_gap_router,
    application_router, ai_tools_router, hr_router,
    analytics_router, admin_router
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Skills2Job API",
    description="AI-Powered Career Matchmaking and Recruitment Platform",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

# Mount all routers
app.include_router(auth_router.router)
app.include_router(profile_router.router)
app.include_router(jobs_router.router)
app.include_router(match_router.router)
app.include_router(resume_router.router)
app.include_router(github_router.router)
app.include_router(skill_gap_router.router)
app.include_router(application_router.router)
app.include_router(ai_tools_router.router)
app.include_router(hr_router.router)
app.include_router(analytics_router.router)
app.include_router(admin_router.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "Skills2Job API",
        "version": "1.0.0",
        "ai_engine": "Active (5-Factor Explainable Matcher + Vector Sim)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
