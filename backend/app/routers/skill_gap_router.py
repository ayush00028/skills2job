import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db, User, LearningPlan
from app.auth import get_current_user

router = APIRouter(prefix="/api/skill-gap", tags=["skill-gap"])

@router.get("")
def get_skill_gap_analysis(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user or db.query(User).filter(User.email == "alex.sharma@example.com").first()
    
    you_have = [
        {"name": "React", "level": "Advanced", "source": "Resume & GitHub"},
        {"name": "JavaScript", "level": "Advanced", "source": "Resume"},
        {"name": "Node.js", "level": "Intermediate", "source": "Resume & GitHub"},
        {"name": "Python", "level": "Intermediate", "source": "GitHub"},
        {"name": "SQL", "level": "Advanced", "source": "Resume"},
        {"name": "Git", "level": "Advanced", "source": "GitHub"},
        {"name": "TypeScript", "level": "Intermediate", "source": "GitHub"},
        {"name": "REST APIs", "level": "Advanced", "source": "Resume"}
    ]
    
    missing_skills = [
        {
            "skill": "Docker",
            "priority": "HIGH",
            "demand": "High",
            "importance": "Critical",
            "current_level": "Not Detected",
            "recommended_level": "Intermediate",
            "matching_jobs_affected": 64,
            "potential_match_improvement": "+7%",
            "why_it_matters": "Standard for containerized application microservices and reproducible dev/prod parity."
        },
        {
            "skill": "AWS",
            "priority": "HIGH",
            "demand": "High",
            "importance": "Critical",
            "current_level": "Beginner / Conceptual",
            "recommended_level": "Intermediate",
            "matching_jobs_affected": 58,
            "potential_match_improvement": "+6%",
            "why_it_matters": "Required cloud platform for 65%+ of modern enterprise SaaS deployments."
        },
        {
            "skill": "Kubernetes",
            "priority": "MEDIUM",
            "demand": "Medium",
            "importance": "Important",
            "current_level": "Not Detected",
            "recommended_level": "Beginner / Core",
            "matching_jobs_affected": 32,
            "potential_match_improvement": "+4%",
            "why_it_matters": "Orchestrates microservices for large-scale enterprise high-availability."
        },
        {
            "skill": "CI/CD",
            "priority": "MEDIUM",
            "demand": "Medium",
            "importance": "Important",
            "current_level": "Beginner",
            "recommended_level": "Intermediate",
            "matching_jobs_affected": 41,
            "potential_match_improvement": "+4%",
            "why_it_matters": "Automates testing, security linting, and zero-downtime deployment pipelines."
        },
        {
            "skill": "Terraform",
            "priority": "LOW",
            "demand": "Moderate",
            "importance": "Bonus",
            "current_level": "Not Detected",
            "recommended_level": "Beginner",
            "matching_jobs_affected": 18,
            "potential_match_improvement": "+2%",
            "why_it_matters": "Infrastructure-as-Code for multi-cloud declarative resource management."
        }
    ]
    
    learning_plan = [
        {
            "week": 1,
            "title": "Docker Fundamentals",
            "skill": "Docker",
            "priority": "HIGH",
            "estimated_effort": "6 hours",
            "recommended_project": "Containerize a Node.js & React app with multi-stage build optimization.",
            "completed": True
        },
        {
            "week": 2,
            "title": "Docker Compose",
            "skill": "Docker Compose",
            "priority": "HIGH",
            "estimated_effort": "8 hours",
            "recommended_project": "Build a multi-container stack with PostgreSQL, Redis cache, and Node backend.",
            "completed": False
        },
        {
            "week": 3,
            "title": "AWS Basics",
            "skill": "AWS (S3, ECS, IAM)",
            "priority": "HIGH",
            "estimated_effort": "8 hours",
            "recommended_project": "Provision S3 for static assets and deploy a Docker container onto AWS ECS.",
            "completed": False
        },
        {
            "week": 4,
            "title": "Deploy a Full Stack Application",
            "skill": "Full Stack Cloud Deployment",
            "priority": "HIGH",
            "estimated_effort": "10 hours",
            "recommended_project": "Deploy an end-to-end full stack SaaS with automated GitHub Actions CI/CD.",
            "completed": False
        }
    ]
    
    return {
        "you_have": you_have,
        "you_are_missing": missing_skills,
        "total_jobs_unlocked_potential": 28,
        "overall_potential_improvement": "+13%",
        "learning_plan": learning_plan
    }
