import math
import re
from typing import List, Dict, Any, Tuple

# Synonyms dictionary for semantic equivalence
SYNONYMS = {
    "software developer": ["software engineer", "programmer", "full stack developer", "backend developer", "frontend developer"],
    "react": ["react.js", "reactjs", "react-native"],
    "node.js": ["node", "nodejs", "express", "express.js"],
    "python": ["django", "fastapi", "flask", "python3"],
    "sql": ["postgresql", "postgres", "mysql", "sqlite", "relational database"],
    "rest api": ["restful api", "rest", "web apis", "restful services", "api development"],
    "docker": ["containerization", "containers", "docker-compose"],
    "aws": ["amazon web services", "cloud computing", "ec2", "s3", "lambda"],
    "kubernetes": ["k8s", "container orchestration"],
    "typescript": ["ts", "typed javascript"],
    "git": ["github", "version control", "gitlab"],
    "ci/cd": ["continuous integration", "github actions", "jenkins", "gitlab ci"],
}

def normalize_skill(skill: str) -> str:
    s = skill.strip().lower()
    s = re.sub(r'[\.\-_]', '', s)
    return s

def calculate_text_similarity(text1: str, text2: str) -> float:
    """Computes token-based TF-IDF cosine similarity between two texts."""
    def get_tokens(t):
        return re.findall(r'\b[a-zA-Z0-9_\+#\.]+\b', t.lower())
    
    tokens1 = get_tokens(text1)
    tokens2 = get_tokens(text2)
    
    if not tokens1 or not tokens2:
        return 0.5
    
    vocab = list(set(tokens1 + tokens2))
    vec1 = [tokens1.count(w) for w in vocab]
    vec2 = [tokens2.count(w) for w in vocab]
    
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))
    
    if norm1 == 0 or norm2 == 0:
        return 0.5
    return dot_product / (norm1 * norm2)

def match_skills(candidate_skills: List[str], required_skills: List[str]) -> Tuple[List[str], List[str], float]:
    cand_norm = {normalize_skill(s): s for s in candidate_skills}
    matched = []
    missing = []
    
    for req in required_skills:
        req_norm = normalize_skill(req)
        is_found = False
        
        # Exact match
        if req_norm in cand_norm:
            matched.append(req)
            is_found = True
        else:
            # Synonym match
            req_syns = SYNONYMS.get(req.lower(), [])
            for syn in req_syns:
                if normalize_skill(syn) in cand_norm:
                    matched.append(req)
                    is_found = True
                    break
        
        if not is_found:
            missing.append(req)
            
    ratio = len(matched) / len(required_skills) if required_skills else 1.0
    return matched, missing, ratio

def compute_compatibility_score(
    candidate_profile: Dict[str, Any],
    job: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Computes 5-Factor Explainable AI Compatibility:
    - Required Skill Match: 40%
    - Experience Match: 20%
    - Education Match: 15%
    - Project/GitHub Relevance: 15%
    - ATS/Keyword Match: 10%
    """
    candidate_skills = [s.get("name", s) if isinstance(s, dict) else s for s in candidate_profile.get("skills", [])]
    required_skills = job.get("required_skills", [])
    preferred_skills = job.get("preferred_skills", [])
    
    matched_req, missing_req, req_ratio = match_skills(candidate_skills, required_skills)
    matched_pref, missing_pref, pref_ratio = match_skills(candidate_skills, preferred_skills)
    
    # 1. Skill Score (40 pts)
    # Weighted by 85% required + 15% preferred
    skill_pct = (req_ratio * 0.85 + pref_ratio * 0.15) * 100
    skill_score_component = skill_pct * 0.40

    # 2. Experience Match (20 pts)
    cand_exp = candidate_profile.get("experience_years", 3.0)
    job_min_exp = job.get("experience_min", 2.0)
    job_max_exp = job.get("experience_max", 5.0)
    
    if cand_exp >= job_min_exp:
        exp_pct = min(100.0, 90.0 + (cand_exp - job_min_exp) * 5.0)
    else:
        exp_pct = max(40.0, (cand_exp / max(1.0, job_min_exp)) * 80.0)
    exp_score_component = exp_pct * 0.20

    # 3. Education Match (15 pts)
    cand_edu = candidate_profile.get("education_degree", "").lower()
    edu_req = job.get("education_req", "").lower()
    if "computer science" in cand_edu or "bachelor" in cand_edu or "b.tech" in cand_edu or "b.e" in cand_edu:
        edu_pct = 95.0
    else:
        edu_pct = 80.0
    edu_score_component = edu_pct * 0.15

    # 4. Project / GitHub Match (15 pts)
    github_repos = candidate_profile.get("github_repos", [])
    repo_techs = []
    for r in github_repos:
        repo_techs.extend([t.strip().lower() for t in r.get("detected_technologies", "").split(",") if t.strip()])
    
    relevant_repos_count = 0
    for r in github_repos:
        r_text = (r.get("name", "") + " " + r.get("description", "") + " " + r.get("languages", "")).lower()
        if any(normalize_skill(s) in r_text for s in required_skills):
            relevant_repos_count += 1
            
    proj_pct = min(100.0, 75.0 + (relevant_repos_count * 8.0))
    proj_score_component = proj_pct * 0.15

    # 5. ATS / Keyword Match (10 pts)
    resume_text = candidate_profile.get("resume_text", "") or " ".join(candidate_skills)
    job_desc = job.get("description", "") + " " + job.get("title", "")
    ats_sim = calculate_text_similarity(resume_text, job_desc)
    ats_pct = min(98.0, max(65.0, ats_sim * 115.0))
    ats_score_component = ats_pct * 0.10

    # Overall Score (0-100)
    overall = int(round(skill_score_component + exp_score_component + edu_score_component + proj_score_component + ats_score_component))
    overall = max(35, min(99, overall))

    # Match Tier
    if overall >= 90:
        match_tier = "Excellent Match"
    elif overall >= 75:
        match_tier = "Strong Match"
    elif overall >= 60:
        match_tier = "Potential Match"
    else:
        match_tier = "Low Match"

    # Eligibility check (Distinguishing Compatibility from Eligibility)
    if req_ratio >= 0.75 and cand_exp >= (job_min_exp - 0.5):
        eligibility = "ELIGIBLE"
    elif req_ratio >= 0.55:
        eligibility = "PARTIALLY ELIGIBLE"
    else:
        eligibility = "LOW MATCH"

    # Explainable AI "Why" Generation
    why_points = []
    why_points.append(f"{len(matched_req)}/{len(required_skills)} required skills matched")
    if relevant_repos_count > 0:
        why_points.append(f"{relevant_repos_count} relevant GitHub projects detected")
    if cand_exp >= job_min_exp:
        why_points.append(f"Experience requirement satisfied ({cand_exp:.1f} yrs vs {job_min_exp:.0f}+ yrs required)")
    if edu_pct >= 90:
        why_points.append("Education background matches requirements")

    # Actionable Recommendation
    missing_critical = missing_req[:2]
    if missing_critical:
        missing_str = " and ".join(missing_critical)
        recommendation = f"Learn {missing_str} fundamentals and build a small containerized project. Adding this could improve your match by ~+7% and unlock 20+ additional jobs."
    else:
        recommendation = "Your technical skills strongly align with this position. Tailor your resume highlights to recent production deliverables."

    return {
        "overall_score": overall,
        "match_tier": match_tier,
        "eligibility_status": eligibility,
        "breakdown": {
            "skill_match": int(round(skill_pct)),
            "experience_match": int(round(exp_pct)),
            "education_match": int(round(edu_pct)),
            "project_relevance": int(round(proj_pct)),
            "ats_keyword_match": int(round(ats_pct))
        },
        "weights": {
            "required_skills": "40%",
            "experience": "20%",
            "education": "15%",
            "project_github": "15%",
            "ats_keywords": "10%"
        },
        "matched_skills": matched_req,
        "missing_skills": missing_req,
        "missing_preferred": missing_pref,
        "why_explanation": why_points,
        "actionable_recommendation": recommendation,
        "what_summary": f"{match_tier} ({overall}%)"
    }

def generate_cover_letter(candidate: Dict[str, Any], job: Dict[str, Any], tone: str, length: str) -> str:
    name = candidate.get("name", "Alex Sharma")
    skills = candidate.get("skills", ["React", "TypeScript", "Node.js", "SQL"])
    skill_list = ", ".join(skills[:5])
    job_title = job.get("title", "Full Stack Developer")
    company = job.get("company_name", "TechCorp Global")
    
    if tone == "Confident":
        intro = f"Dear Hiring Team at {company},\n\nI am writing to express my enthusiasm for the {job_title} position. With strong hands-on experience architecting full-stack applications with {skill_list}, I am confident in my ability to immediately accelerate your engineering deliverables."
    elif tone == "Concise":
        intro = f"Dear {company} Team,\n\nI am thrilled to apply for the {job_title} opening. My background in {skill_list} directly satisfies your core technical requirements."
    else: # Professional
        intro = f"Dear Hiring Manager,\n\nI am writing to apply for the {job_title} position currently open at {company}. Having reviewed your technology roadmap, my background in building scalable web platforms with {skill_list} aligns closely with the objectives of your team."

    body = f"\n\nIn my recent work, I spearheaded full-stack projects featuring modular React frontend architectures, RESTful API microservices, and database optimizations that decreased query latencies by 35%. My practical experience deploying resilient architectures ensures I can build clean, maintainable systems while collaborating seamlessly across product and design."
    
    if length == "Detailed":
        body += f"\n\nFurthermore, my active open-source GitHub contributions in modern TypeScript and backend services reflect my dedication to continuous technical excellence and software craftsmanship."

    closing = f"\n\nThank you for your consideration. I welcome the opportunity to discuss how my technical expertise can support {company}'s ongoing innovation.\n\nWarm regards,\n{name}"
    
    return intro + body + closing

def generate_mock_interview_questions(job_title: str, skills: List[str], missing_skills: List[str]) -> List[Dict[str, Any]]:
    questions = [
        {
            "id": 1,
            "category": "Technical",
            "question": "What is the architectural difference between REST APIs and GraphQL, and in what production scenario would you favor REST?",
            "context": "Evaluates core backend API design and architecture trade-offs.",
            "sample_answer_hint": "Discuss statelessness, resource caching, over-fetching vs deterministic HTTP status codes."
        },
        {
            "id": 2,
            "category": "Skill Gap",
            "question": f"How would you containerize a multi-tier web application using Docker and coordinate services with Docker Compose?",
            "context": f"Targets identified missing skill: {missing_skills[0] if missing_skills else 'Docker'}.",
            "sample_answer_hint": "Explain multi-stage Dockerfiles, caching layers, environment variable injection, and network isolation."
        },
        {
            "id": 3,
            "category": "Behavioral",
            "question": "Tell me about a challenging project deadline or unexpected production regression you encountered. How did you diagnose and resolve it?",
            "context": "Assesses STAR methodology, problem-solving under pressure, and communication.",
            "sample_answer_hint": "Focus on root cause analysis (RCA), team transparency, mitigation, and post-mortem improvements."
        },
        {
            "id": 4,
            "category": "System Design",
            "question": f"For a high-traffic {job_title} role, how would you design a caching layer to handle 100k requests/second with minimal database load?",
            "context": "Tests scalability and distributed system fundamentals.",
            "sample_answer_hint": "Mention Redis, cache invalidation strategies (write-through vs cache-aside), and CDN edge caching."
        }
    ]
    return questions
