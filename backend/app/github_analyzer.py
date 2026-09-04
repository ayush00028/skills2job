from typing import Dict, Any, List

def get_demo_github_data() -> Dict[str, Any]:
    return {
        "username": "alexsharma-dev",
        "avatar": "https://avatars.githubusercontent.com/u/583231?v=4",
        "bio": "Full Stack & Cloud Systems Engineer • Building scalable web platforms",
        "repositories_count": 18,
        "followers": 142,
        "following": 89,
        "contributions": 420,
        "top_languages": [
            {"name": "TypeScript", "percentage": 42},
            {"name": "JavaScript", "percentage": 28},
            {"name": "Python", "percentage": 20},
            {"name": "SQL / HTML", "percentage": 10}
        ],
        "repositories": [
            {
                "id": 1,
                "name": "ecommerce-cloud-platform",
                "description": "Full-stack cloud e-commerce platform with microservices architecture, JWT authentication, and transactional cart operations.",
                "languages": ["TypeScript", "React", "Node.js", "PostgreSQL"],
                "stars": 48,
                "forks": 14,
                "last_updated": "2 days ago",
                "detected_technologies": ["React", "TypeScript", "Node.js", "REST API", "PostgreSQL"],
                "resume_bullet": "Engineered an e-commerce microservices platform with React, TypeScript, and PostgreSQL handling concurrent inventory locking and cart persistence."
            },
            {
                "id": 2,
                "name": "ai-career-matcher",
                "description": "Intelligent career matchmaking engine utilizing semantic embeddings, TF-IDF vector similarity, and FastAPI endpoints.",
                "languages": ["Python", "FastAPI", "Next.js"],
                "stars": 86,
                "forks": 22,
                "last_updated": "1 week ago",
                "detected_technologies": ["Python", "FastAPI", "Cosine Similarity", "REST APIs", "Tailwind CSS"],
                "resume_bullet": "Developed an AI-driven career recommendation engine in Python/FastAPI using vector cosine similarity for automated skill gap detection."
            },
            {
                "id": 3,
                "name": "distributed-task-queue",
                "description": "Lightweight asynchronous task orchestration system with Redis queues and worker threads.",
                "languages": ["Python", "Redis", "Docker"],
                "stars": 34,
                "forks": 7,
                "last_updated": "3 weeks ago",
                "detected_technologies": ["Python", "Redis", "Docker", "AsyncIO"],
                "resume_bullet": "Implemented an asynchronous distributed job queue using Redis and Docker, reducing background job execution latency by 40%."
            },
            {
                "id": 4,
                "name": "react-recharts-dashboard",
                "description": "Interactive analytical dashboard featuring customizable financial widgets, real-time filters, and dark mode.",
                "languages": ["TypeScript", "React", "Tailwind CSS"],
                "stars": 19,
                "forks": 3,
                "last_updated": "1 month ago",
                "detected_technologies": ["React", "TypeScript", "Recharts", "Tailwind CSS"],
                "resume_bullet": "Created an interactive responsive SaaS analytics dashboard in React & TypeScript with dynamic chart visualizations and sub-second renders."
            }
        ],
        "detected_skills_summary": [
            {"skill": "React", "level": "Advanced", "repo_count": 3},
            {"skill": "TypeScript", "level": "Advanced", "repo_count": 3},
            {"skill": "Node.js", "level": "Intermediate", "repo_count": 2},
            {"skill": "Python", "level": "Intermediate", "repo_count": 2},
            {"skill": "PostgreSQL", "level": "Intermediate", "repo_count": 2},
            {"skill": "Docker", "level": "Beginner / Practical", "repo_count": 1}
        ]
    }
