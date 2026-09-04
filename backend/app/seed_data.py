import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import (
    User, JobSeekerProfile, HRProfile, Resume, UserSkill,
    GitHubProfile, GitHubRepository, Job, JobSkill, JobMatch,
    Application, Interview, Notification, LearningPlan
)
from app.auth import hash_password

REALISTIC_JOBS = [
    {
        "title": "Full Stack Developer",
        "company_name": "Google / Alphabet",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        "location": "Bangalore • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 2.0,
        "experience_max": 5.0,
        "salary_range": "₹16L – ₹28L",
        "description": "We are seeking a versatile Full Stack Developer to build high-scale consumer web applications with React, Node.js, and cloud backends. You will architect modular client applications and collaborate across global infrastructure teams.",
        "responsibilities": "Architect high-performance web components; design REST & GraphQL services; ensure 99.9% uptime and low latency.",
        "education_req": "B.Tech or B.S. in Computer Science or equivalent experience",
        "required_skills": ["React", "JavaScript", "Node.js", "SQL", "REST APIs"],
        "preferred_skills": ["TypeScript", "Docker", "AWS"],
        "bonus_skills": ["Kubernetes", "GraphQL", "Redis"]
    },
    {
        "title": "Frontend Engineer - UI Platform",
        "company_name": "Microsoft",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        "location": "Hyderabad • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 2.0,
        "experience_max": 4.0,
        "salary_range": "₹15L – ₹26L",
        "description": "Join our core UI Systems team delivering next-generation design systems and high-accessibility web surfaces for Microsoft Cloud. Requires deep mastery of React, TypeScript, and state management.",
        "responsibilities": "Create accessible UI components; profile and optimize Core Web Vitals; collaborate with UX designers.",
        "education_req": "Bachelor's in Computer Science or related field",
        "required_skills": ["React", "TypeScript", "JavaScript", "HTML5", "CSS3"],
        "preferred_skills": ["Next.js", "Tailwind CSS", "Jest"],
        "bonus_skills": ["WebAssembly", "CI/CD", "Figma"]
    },
    {
        "title": "Backend Software Engineer",
        "company_name": "Amazon Web Services (AWS)",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
        "location": "Bangalore • On-site",
        "work_type": "On-site",
        "employment_type": "Full-time",
        "experience_min": 3.0,
        "experience_max": 6.0,
        "salary_range": "₹18L – ₹32L",
        "description": "Build high-throughput distributed microservices powering AWS developer tooling. Focus on high concurrency, distributed caching, and transactional database integrity.",
        "responsibilities": "Develop scalable Python and Node.js microservices; deploy to AWS infrastructure; write automated integration tests.",
        "education_req": "B.Tech / M.Tech in Computer Science",
        "required_skills": ["Python", "Node.js", "PostgreSQL", "REST APIs", "Git"],
        "preferred_skills": ["AWS", "Docker", "Redis"],
        "bonus_skills": ["Kubernetes", "Kafka", "Terraform"]
    },
    {
        "title": "Junior to Mid Software Engineer",
        "company_name": "Atlassian",
        "company_logo": "https://cdn.worldvectorlogo.com/logos/atlassian-1.svg",
        "location": "Remote • India",
        "work_type": "Remote",
        "employment_type": "Full-time",
        "experience_min": 1.5,
        "experience_max": 4.0,
        "salary_range": "₹14L – ₹22L",
        "description": "Help evolve collaborative developer workflows at Atlassian. You will build user-centric features across Jira and Confluence ecosystems using modern web standards.",
        "responsibilities": "Write clean, tested JavaScript & Python code; participate in peer code reviews; contribute to design documentation.",
        "education_req": "B.S. or B.Tech in Engineering",
        "required_skills": ["JavaScript", "React", "Python", "Git", "SQL"],
        "preferred_skills": ["TypeScript", "REST APIs"],
        "bonus_skills": ["Docker", "Agile", "Jira API"]
    },
    {
        "title": "DevOps / Platform Engineer",
        "company_name": "Uber",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
        "location": "Bangalore • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 3.0,
        "experience_max": 7.0,
        "salary_range": "₹20L – ₹35L",
        "description": "Lead automated container deployments, Kubernetes cluster scaling, and CI/CD pipelines for real-time ride and dispatch microservices.",
        "responsibilities": "Manage Kubernetes clusters; build multi-region AWS cloud infrastructure; implement monitoring and incident alerting.",
        "education_req": "B.E. / B.Tech in Computer Science or IT",
        "required_skills": ["Docker", "Kubernetes", "AWS", "Linux", "CI/CD"],
        "preferred_skills": ["Python", "Terraform", "Git"],
        "bonus_skills": ["Prometheus", "Golang", "Ansible"]
    },
    {
        "title": "Machine Learning Engineer",
        "company_name": "Flipkart",
        "company_logo": "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg",
        "location": "Bangalore • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 2.0,
        "experience_max": 5.0,
        "salary_range": "₹18L – ₹30L",
        "description": "Develop and deploy recommendation algorithms and semantic product search models serving hundreds of millions of shoppers.",
        "responsibilities": "Train sentence transformers & embedding models; optimize vector search latency; collaborate with backend engineers.",
        "education_req": "B.Tech / M.Tech in CS / Data Science",
        "required_skills": ["Python", "Machine Learning", "SQL", "Pandas", "Git"],
        "preferred_skills": ["FastAPI", "Docker", "PyTorch"],
        "bonus_skills": ["pgvector", "MLOps", "AWS"]
    },
    {
        "title": "Data Analyst / BI Specialist",
        "company_name": "Swiggy",
        "company_logo": "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg",
        "location": "Bangalore • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 1.0,
        "experience_max": 3.5,
        "salary_range": "₹9L – ₹16L",
        "description": "Translate complex transactional data into actionable customer growth insights, KPI dashboards, and pricing strategies.",
        "responsibilities": "Write advanced SQL queries; build interactive dashboards; conduct statistical A/B test evaluations.",
        "education_req": "Bachelor's in Engineering, Mathematics, or Economics",
        "required_skills": ["SQL", "Python", "Data Analysis", "Pandas"],
        "preferred_skills": ["Tableau", "Git", "Excel"],
        "bonus_skills": ["Machine Learning", "R", "BigQuery"]
    },
    {
        "title": "Data Scientist - Personalization",
        "company_name": "Zomato",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
        "location": "Gurgaon • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 2.5,
        "experience_max": 5.0,
        "salary_range": "₹16L – ₹27L",
        "description": "Build predictive models for dish recommendation, customer churn prediction, and dynamic delivery estimates.",
        "responsibilities": "Formulate hypotheses; extract data with SQL; train predictive algorithms; validate in production A/B trials.",
        "education_req": "Master's or Bachelor's in CS / Statistics",
        "required_skills": ["Python", "Machine Learning", "SQL", "Statistics"],
        "preferred_skills": ["Docker", "FastAPI", "Pandas"],
        "bonus_skills": ["Deep Learning", "AWS", "Airflow"]
    },
    {
        "title": "React Frontend Developer",
        "company_name": "Razorpay",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
        "location": "Bangalore • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 2.0,
        "experience_max": 4.0,
        "salary_range": "₹14L – ₹24L",
        "description": "Craft frictionless payment checkout flows and financial merchant dashboards viewed by millions of customers across India.",
        "responsibilities": "Build responsive web widgets; integrate secure payment APIs; maintain 60fps animations and micro-interactions.",
        "education_req": "B.Tech in Computer Science / IT",
        "required_skills": ["React", "JavaScript", "TypeScript", "HTML5", "CSS3"],
        "preferred_skills": ["REST APIs", "Tailwind CSS", "Git"],
        "bonus_skills": ["Next.js", "Docker", "WebSockets"]
    },
    {
        "title": "Python Backend API Developer",
        "company_name": "Postman",
        "company_logo": "https://assets.getpostman.com/common-share/postman-logo-stacked.svg",
        "location": "Bangalore • Remote",
        "work_type": "Remote",
        "employment_type": "Full-time",
        "experience_min": 2.0,
        "experience_max": 5.0,
        "salary_range": "₹16L – ₹26L",
        "description": "Design and maintain high-speed developer REST and GraphQL APIs powering the Postman collaborative platform.",
        "responsibilities": "Build resilient API endpoints; write comprehensive unit & integration tests; optimize database schema.",
        "education_req": "Bachelor's in Computer Science or Software Engineering",
        "required_skills": ["Python", "FastAPI", "SQL", "REST APIs", "Git"],
        "preferred_skills": ["PostgreSQL", "Docker", "Redis"],
        "bonus_skills": ["Node.js", "CI/CD", "AWS"]
    },
    {
        "title": "Cloud Solutions & Infrastructure Architect",
        "company_name": "Oracle",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
        "location": "Mumbai • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 4.0,
        "experience_max": 8.0,
        "salary_range": "₹22L – ₹38L",
        "description": "Architect enterprise cloud migration pipelines, container strategies, and disaster recovery architectures.",
        "responsibilities": "Advise enterprise clients on microservices architectures; configure Kubernetes and multi-cloud resilience.",
        "education_req": "B.Tech / M.Tech in CS or Information Systems",
        "required_skills": ["AWS", "Docker", "Kubernetes", "Linux", "SQL"],
        "preferred_skills": ["Python", "CI/CD", "Terraform"],
        "bonus_skills": ["Java", "Oracle Cloud", "Security"]
    },
    {
        "title": "Full Stack Engineer - Growth",
        "company_name": "CRED",
        "company_logo": "https://upload.wikimedia.org/wikipedia/en/e/eb/CRED_logo.png",
        "location": "Bangalore • On-site",
        "work_type": "On-site",
        "employment_type": "Full-time",
        "experience_min": 2.0,
        "experience_max": 4.5,
        "salary_range": "₹18L – ₹30L",
        "description": "Build rewarding member experiences, interactive gamified reward feeds, and financial checkout integration.",
        "responsibilities": "Implement fluid interactive animations in React; build rock-solid backend services with Node.js and SQL.",
        "education_req": "Bachelor's in CS / Engineering",
        "required_skills": ["React", "JavaScript", "Node.js", "PostgreSQL", "Git"],
        "preferred_skills": ["TypeScript", "REST APIs", "Redis"],
        "bonus_skills": ["Docker", "GraphQL", "AWS"]
    },
    {
        "title": "AI Application Developer",
        "company_name": "TechCorp Global",
        "company_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
        "location": "Bangalore • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 2.0,
        "experience_max": 5.0,
        "salary_range": "₹16L – ₹28L",
        "description": "Integrate GenAI LLM models and vector search similarity engines into modern SaaS enterprise workflows.",
        "responsibilities": "Develop RAG pipelines, FastAPI orchestration layers, and interactive Next.js dashboards.",
        "education_req": "Bachelor's degree in Computer Science",
        "required_skills": ["Python", "FastAPI", "React", "TypeScript", "SQL"],
        "preferred_skills": ["Docker", "Machine Learning", "REST APIs"],
        "bonus_skills": ["pgvector", "LangChain", "AWS"]
    },
    {
        "title": "Senior Frontend Developer",
        "company_name": "TechCorp Global",
        "company_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
        "location": "Bangalore • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 3.0,
        "experience_max": 6.0,
        "salary_range": "₹18L – ₹28L",
        "description": "Lead design system refactoring, TypeScript adoption, and responsive UI architecture for enterprise SaaS customers.",
        "responsibilities": "Mentor junior engineers; establish component testing standards; partner with product management.",
        "education_req": "B.Tech in CS or equivalent",
        "required_skills": ["React", "TypeScript", "JavaScript", "HTML5", "CSS3"],
        "preferred_skills": ["Next.js", "Tailwind CSS", "REST APIs"],
        "bonus_skills": ["Docker", "GraphQL", "Jest"]
    },
    {
        "title": "Backend Microservices Architect",
        "company_name": "TechCorp Global",
        "company_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
        "location": "Bangalore • Remote",
        "work_type": "Remote",
        "employment_type": "Full-time",
        "experience_min": 3.5,
        "experience_max": 7.0,
        "salary_range": "₹20L – ₹34L",
        "description": "Architect mission-critical distributed data pipelines and high-throughput APIs serving 50M requests monthly.",
        "responsibilities": "Optimize database schemas; implement event-driven architectures; uphold strict security and authentication.",
        "education_req": "Bachelor's in Computer Science",
        "required_skills": ["Node.js", "Python", "SQL", "PostgreSQL", "REST APIs"],
        "preferred_skills": ["Docker", "AWS", "Redis"],
        "bonus_skills": ["Kubernetes", "Kafka", "CI/CD"]
    },
    {
        "title": "Junior Web Developer",
        "company_name": "Infosys",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
        "location": "Pune • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 0.5,
        "experience_max": 2.5,
        "salary_range": "₹6L – ₹10L",
        "description": "Entry-level web developer role assisting with frontend maintenance, bug resolution, and API consumption.",
        "responsibilities": "Write responsive HTML/CSS/JavaScript; perform bug fixes; participate in code reviews.",
        "education_req": "B.E. / B.Tech / BCA in Computer Science",
        "required_skills": ["JavaScript", "HTML5", "CSS3", "Git"],
        "preferred_skills": ["React", "SQL"],
        "bonus_skills": ["Node.js", "Bootstrap"]
    },
    {
        "title": "Lead Software Engineer",
        "company_name": "Salesforce",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
        "location": "Hyderabad • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 5.0,
        "experience_max": 9.0,
        "salary_range": "₹28L – ₹45L",
        "description": "Guide architectural vision and engineering standards for enterprise CRM workflows and cloud integrations.",
        "responsibilities": "Define technical roadmaps; lead engineering guilds; design fault-tolerant multi-tenant microservices.",
        "education_req": "Bachelor's or Master's in CS",
        "required_skills": ["JavaScript", "React", "Node.js", "SQL", "AWS"],
        "preferred_skills": ["Docker", "Kubernetes", "TypeScript"],
        "bonus_skills": ["GraphQL", "CI/CD", "Redis"]
    },
    {
        "title": "Site Reliability Engineer (SRE)",
        "company_name": "Cisco",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
        "location": "Bangalore • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 3.0,
        "experience_max": 6.0,
        "salary_range": "₹17L – ₹28L",
        "description": "Ensure ultra-reliable uptime and latency for worldwide network routing and cloud telecommunications.",
        "responsibilities": "Automate infrastructure with Python & shell scripts; monitor SLIs/SLOs; diagnose distributed bottlenecks.",
        "education_req": "B.Tech in Computer Science or Telecom",
        "required_skills": ["Linux", "Python", "Docker", "AWS", "Git"],
        "preferred_skills": ["Kubernetes", "CI/CD", "SQL"],
        "bonus_skills": ["Go", "Terraform", "Prometheus"]
    },
    {
        "title": "UI/UX & Frontend Engineer",
        "company_name": "Canva",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
        "location": "Remote • India",
        "work_type": "Remote",
        "employment_type": "Full-time",
        "experience_min": 2.0,
        "experience_max": 4.5,
        "salary_range": "₹16L – ₹26L",
        "description": "Bridge the gap between design vision and high-performance canvas/DOM rendering for collaborative design tools.",
        "responsibilities": "Implement pixel-perfect responsive interactions; optimize SVG and Canvas rendering performance.",
        "education_req": "Bachelor's in Design or Computer Science",
        "required_skills": ["React", "TypeScript", "JavaScript", "CSS3", "HTML5"],
        "preferred_skills": ["Tailwind CSS", "Git", "Figma"],
        "bonus_skills": ["WebGL", "Next.js", "Node.js"]
    },
    {
        "title": "Cloud Security Engineer",
        "company_name": "Palo Alto Networks",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Palo_Alto_Networks_2020_Logo.svg",
        "location": "Bangalore • Hybrid",
        "work_type": "Hybrid",
        "employment_type": "Full-time",
        "experience_min": 3.0,
        "experience_max": 6.0,
        "salary_range": "₹19L – ₹32L",
        "description": "Fortify cloud perimeter defenses, IAM policies, and container image vulnerability scanners.",
        "responsibilities": "Audit cloud environments; configure automated static analysis in CI/CD; remediate CVEs.",
        "education_req": "B.Tech in Information Security / Computer Science",
        "required_skills": ["AWS", "Docker", "Linux", "Python", "Git"],
        "preferred_skills": ["Kubernetes", "CI/CD", "SQL"],
        "bonus_skills": ["Terraform", "Penetration Testing"]
    }
]

CANDIDATES_FOR_HR = [
    {
        "name": "Alex Sharma",
        "email": "alex.sharma@example.com",
        "headline": "Full Stack Developer",
        "experience": "3.0 years",
        "location": "Bangalore, India",
        "education": "B.Tech in Computer Science",
        "compatibility": 94,
        "skills": ["React", "Node.js", "JavaScript", "SQL", "Git", "TypeScript", "REST APIs"],
        "missing": ["AWS"],
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/alexsharma-dev",
        "is_shortlisted": True
    },
    {
        "name": "Priya Patel",
        "email": "priya.patel@example.com",
        "headline": "Senior Frontend Engineer",
        "experience": "4.5 years",
        "location": "Bangalore, India",
        "education": "M.Tech in Software Engineering",
        "compatibility": 92,
        "skills": ["React", "TypeScript", "Next.js", "JavaScript", "Tailwind CSS", "Git"],
        "missing": ["Node.js"],
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/priyapatel-code",
        "is_shortlisted": True
    },
    {
        "name": "Rohan Deshmukh",
        "email": "rohan.deshmukh@example.com",
        "headline": "Backend & Cloud Engineer",
        "experience": "3.5 years",
        "location": "Hyderabad, India",
        "education": "B.Tech in IT",
        "compatibility": 88,
        "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS", "Git"],
        "missing": ["React"],
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/rohandesh",
        "is_shortlisted": True
    },
    {
        "name": "Ananya Roy",
        "email": "ananya.roy@example.com",
        "headline": "Full Stack Web Engineer",
        "experience": "2.8 years",
        "location": "Bangalore, India",
        "education": "B.E. Computer Science",
        "compatibility": 86,
        "skills": ["React", "JavaScript", "Node.js", "SQL", "HTML5", "CSS3"],
        "missing": ["Docker", "AWS"],
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/ananyaroy-dev",
        "is_shortlisted": False
    },
    {
        "name": "Vikram Malhotra",
        "email": "vikram.m@example.com",
        "headline": "DevOps & Cloud Specialist",
        "experience": "5.0 years",
        "location": "Mumbai, India",
        "education": "B.Tech in CS",
        "compatibility": 85,
        "skills": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Python"],
        "missing": ["React", "JavaScript"],
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/vimalhotra",
        "is_shortlisted": True
    },
    {
        "name": "Sneha Kulkarni",
        "email": "sneha.k@example.com",
        "headline": "Data Analyst / Python Dev",
        "experience": "2.0 years",
        "location": "Pune, India",
        "education": "B.Sc in Statistics & CS",
        "compatibility": 81,
        "skills": ["Python", "SQL", "Pandas", "Data Analysis", "Git"],
        "missing": ["Node.js", "Docker"],
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/snehakulkarni",
        "is_shortlisted": False
    },
    {
        "name": "Kabir Mehta",
        "email": "kabir.mehta@example.com",
        "headline": "Full Stack JavaScript Engineer",
        "experience": "3.2 years",
        "location": "Bangalore, India",
        "education": "B.Tech in CS",
        "compatibility": 89,
        "skills": ["JavaScript", "TypeScript", "React", "Node.js", "REST APIs", "SQL"],
        "missing": ["AWS"],
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/kabirmehta",
        "is_shortlisted": True
    },
    {
        "name": "Divya Nambiar",
        "email": "divya.n@example.com",
        "headline": "Frontend UI/UX Specialist",
        "experience": "3.0 years",
        "location": "Chennai, India",
        "education": "B.Des & B.Tech",
        "compatibility": 83,
        "skills": ["React", "TypeScript", "Tailwind CSS", "Figma", "Git"],
        "missing": ["Node.js", "SQL"],
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/divyanambiar",
        "is_shortlisted": False
    },
    {
        "name": "Aditya Verma",
        "email": "aditya.v@example.com",
        "headline": "Machine Learning Engineer",
        "experience": "2.5 years",
        "location": "Bangalore, India",
        "education": "M.S. in Artificial Intelligence",
        "compatibility": 80,
        "skills": ["Python", "Machine Learning", "FastAPI", "SQL", "Pandas", "Git"],
        "missing": ["React", "TypeScript"],
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/adityav-ml",
        "is_shortlisted": False
    },
    {
        "name": "Tara Sen",
        "email": "tara.sen@example.com",
        "headline": "Backend Engineer",
        "experience": "2.2 years",
        "location": "Kolkata, India",
        "education": "B.Tech in Information Technology",
        "compatibility": 78,
        "skills": ["Node.js", "SQL", "PostgreSQL", "REST APIs", "Git"],
        "missing": ["React", "Docker", "AWS"],
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/tarasen-dev",
        "is_shortlisted": False
    },
    {
        "name": "Manish Gupta",
        "email": "manish.g@example.com",
        "headline": "Software Engineer",
        "experience": "1.8 years",
        "location": "Noida, India",
        "education": "B.Tech in CS",
        "compatibility": 76,
        "skills": ["JavaScript", "React", "Python", "Git", "SQL"],
        "missing": ["TypeScript", "Node.js", "Docker"],
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/manishgupta-code",
        "is_shortlisted": False
    },
    {
        "name": "Meera Joshi",
        "email": "meera.j@example.com",
        "headline": "Full Stack Cloud Developer",
        "experience": "3.8 years",
        "location": "Bangalore, India",
        "education": "B.E. in Computer Engineering",
        "compatibility": 91,
        "skills": ["React", "TypeScript", "Node.js", "AWS", "SQL", "Git"],
        "missing": ["Docker"],
        "avatar": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/meerajoshi-cloud",
        "is_shortlisted": False
    },
    {
        "name": "Karthik Raja",
        "email": "karthik.r@example.com",
        "headline": "API & Database Engineer",
        "experience": "3.0 years",
        "location": "Chennai, India",
        "education": "B.Tech in CS",
        "compatibility": 84,
        "skills": ["Python", "FastAPI", "SQL", "PostgreSQL", "Redis", "Git"],
        "missing": ["React", "AWS"],
        "avatar": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/karthikraja-dev",
        "is_shortlisted": False
    },
    {
        "name": "Nisha Agarwal",
        "email": "nisha.a@example.com",
        "headline": "Junior Full Stack Developer",
        "experience": "1.5 years",
        "location": "Jaipur, India",
        "education": "BCA / MCA",
        "compatibility": 74,
        "skills": ["JavaScript", "React", "Node.js", "HTML5", "CSS3", "Git"],
        "missing": ["TypeScript", "SQL", "AWS"],
        "avatar": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/nisha-agarwal",
        "is_shortlisted": False
    },
    {
        "name": "Sameer Rao",
        "email": "sameer.rao@example.com",
        "headline": "Cloud DevOps Engineer",
        "experience": "4.0 years",
        "location": "Bangalore, India",
        "education": "B.Tech in CS",
        "compatibility": 87,
        "skills": ["Docker", "Kubernetes", "AWS", "Python", "Linux", "CI/CD"],
        "missing": ["React", "Node.js"],
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        "github": "https://github.com/sameerrao",
        "is_shortlisted": False
    }
]

def seed_database(db: Session):
    # Check if already seeded
    existing_user = db.query(User).filter(User.email == "alex.sharma@example.com").first()
    if existing_user:
        return

    # 1. Create Demo Job Seeker: Alex Sharma
    alex = User(
        email="alex.sharma@example.com",
        hashed_password=hash_password("DemoAlex2026!"),
        full_name="Alex Sharma",
        role="JOB_SEEKER",
        phone="+91 98765 43210",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        is_email_verified=True,
        is_phone_verified=True,
        verification_code="123456"
    )
    db.add(alex)
    db.commit()
    db.refresh(alex)

    alex_profile = JobSeekerProfile(
        user_id=alex.id,
        headline="Full Stack Developer",
        bio="Passionate Full Stack Developer with 3 years of production experience building high-performance web applications with React, TypeScript, Node.js, and SQL.",
        city="Bangalore",
        country="India",
        linkedin="https://linkedin.com/in/alex-sharma-dev",
        portfolio="https://alexsharma.dev",
        desired_role="Full Stack Developer",
        preferred_job_titles="Full Stack Developer, Software Engineer, Frontend Engineer",
        preferred_locations="Bangalore, Hyderabad, Remote",
        work_type="Hybrid",
        employment_type="Full-time",
        experience_level="Mid Level (2-4 yrs)",
        experience_years=3.0,
        expected_salary="₹12L – ₹18L",
        preferred_industries="SaaS, FinTech, AI/ML",
        education_degree="Bachelor of Technology in Computer Science",
        profile_score=94,
        profile_health=94,
        career_readiness=87
    )
    db.add(alex_profile)

    # Alex Resume
    alex_resume = Resume(
        user_id=alex.id,
        filename="Alex_Sharma_Resume.pdf",
        raw_text="Alex Sharma Full Stack Developer. Skills: JavaScript, React, Node.js, Python, SQL, Git, REST APIs, TypeScript. Experience: 3 years. Education: B.Tech Computer Science.",
        parsed_json=json.dumps({
            "skills": ["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "REST APIs", "TypeScript"],
            "experience_years": 3.0,
            "education": [{"degree": "B.Tech in Computer Science", "institution": "National Institute of Technology", "year": "2020 - 2024"}]
        }),
        ats_score=89
    )
    db.add(alex_resume)

    # Alex Skills
    demo_skills = [
        ("JavaScript", "Advanced", "resume"),
        ("React", "Advanced", "resume"),
        ("Node.js", "Intermediate", "resume"),
        ("Python", "Intermediate", "resume"),
        ("SQL", "Advanced", "resume"),
        ("Git", "Advanced", "github"),
        ("TypeScript", "Intermediate", "github"),
        ("REST APIs", "Advanced", "resume"),
        ("HTML5", "Advanced", "manual"),
        ("CSS3", "Advanced", "manual")
    ]
    for s_name, s_prof, s_source in demo_skills:
        db.add(UserSkill(user_id=alex.id, name=s_name, proficiency=s_prof, source=s_source, verified=True))

    # Alex GitHub Profile & Repos
    alex_gh = GitHubProfile(
        user_id=alex.id,
        username="alexsharma-dev",
        avatar_url="https://avatars.githubusercontent.com/u/583231?v=4",
        repos_count=18,
        followers=142,
        following=89,
        contributions=420,
        top_languages="TypeScript (42%), JavaScript (28%), Python (20%), SQL (10%)"
    )
    db.add(alex_gh)

    repos_seed = [
        ("ecommerce-cloud-platform", "Full-stack cloud e-commerce platform with microservices architecture and cart persistence.", "TypeScript, React, Node.js, PostgreSQL", 48, 14, "React, TypeScript, Node.js, REST API, PostgreSQL"),
        ("ai-career-matcher", "Intelligent career matchmaking engine utilizing semantic embeddings and FastAPI endpoints.", "Python, FastAPI, Next.js", 86, 22, "Python, FastAPI, Cosine Similarity, REST APIs"),
        ("distributed-task-queue", "Lightweight asynchronous task orchestration system with Redis queues and worker threads.", "Python, Redis, Docker", 34, 7, "Python, Redis, Docker, AsyncIO")
    ]
    for r_name, r_desc, r_langs, r_stars, r_forks, r_techs in repos_seed:
        db.add(GitHubRepository(
            user_id=alex.id,
            name=r_name,
            description=r_desc,
            languages=r_langs,
            stars=r_stars,
            forks=r_forks,
            detected_technologies=r_techs
        ))

    # Alex Learning Plan
    learning_weeks = [
        {
            "week": 1,
            "title": "Docker Fundamentals",
            "skill": "Docker",
            "priority": "HIGH",
            "effort": "6 hours",
            "project": "Build multi-stage Dockerfile for a React & Node.js application",
            "topics": ["Containerization concepts", "Images & Layers", "Dockerfile optimization", "Port mapping"]
        },
        {
            "week": 2,
            "title": "Docker Compose & Multi-Container Orch",
            "skill": "Docker Compose",
            "priority": "HIGH",
            "effort": "8 hours",
            "project": "Coordinate Frontend, Backend API, and PostgreSQL DB with a single compose.yaml",
            "topics": ["Volume persistence", "Bridged networking", "Environment variable secrets"]
        },
        {
            "week": 3,
            "title": "AWS Cloud Infrastructure Basics",
            "skill": "AWS",
            "priority": "HIGH",
            "effort": "8 hours",
            "project": "Provision S3 bucket and deploy container image to AWS ECS / App Runner",
            "topics": ["IAM roles & security groups", "S3 static hosting", "EC2 & ECS containers"]
        },
        {
            "week": 4,
            "title": "Deploy Full Stack Production System",
            "skill": "CI/CD & Cloud Deployment",
            "priority": "MEDIUM",
            "effort": "10 hours",
            "project": "Deploy end-to-end full stack application with automated GitHub Actions CI/CD",
            "topics": ["Automated test runs", "Docker build & push", "Zero-downtime rolling update"]
        }
    ]
    db.add(LearningPlan(
        user_id=alex.id,
        title="Full Stack & Cloud Deployment Roadmap",
        weeks_json=json.dumps(learning_weeks),
        potential_boost="+7% Match Boost",
        jobs_unlocked=28
    ))

    # Alex Notifications
    notifications_seed = [
        ("New 94% Match Found", "A new Full Stack Developer position at Google matches your profile with 94% compatibility.", "match"),
        ("Resume Analysis Complete", "Your uploaded resume has been parsed with 89% ATS compatibility.", "resume"),
        ("GitHub Connected Successfully", "Imported 18 repositories and detected 6 core technologies from your projects.", "info"),
        ("Skill Recommendation", "Adding Docker and AWS could increase your eligibility for 28 additional jobs.", "alert"),
        ("Application Moved to Interview", "TechCorp has invited you for a Technical Video Interview.", "interview")
    ]
    for n_title, n_msg, n_type in notifications_seed:
        db.add(Notification(user_id=alex.id, title=n_title, message=n_msg, type=n_type, is_read=False))

    # 2. Create Demo HR Recruiter: Sarah Jenkins
    sarah = User(
        email="sarah.jenkins@techcorp.example.com",
        hashed_password=hash_password("DemoRecruiter2026!"),
        full_name="Sarah Jenkins",
        role="HR",
        phone="+91 98111 22334",
        avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        is_email_verified=True,
        is_phone_verified=True
    )
    db.add(sarah)
    db.commit()
    db.refresh(sarah)

    sarah_hr = HRProfile(
        user_id=sarah.id,
        company_name="TechCorp Global",
        company_logo="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
        industry="Enterprise Cloud & AI Software",
        company_size="500-1000 employees",
        location="Bangalore, India",
        website="https://techcorpglobal.example.com",
        recruiter_name="Sarah Jenkins",
        designation="Lead Technical Talent Partner",
        is_verified_recruiter=True,
        is_website_verified=True
    )
    db.add(sarah_hr)

    # 3. Create Demo Admin
    admin_user = User(
        email="admin@skills2job.example.com",
        hashed_password=hash_password("AdminSkills2026!"),
        full_name="Skills2Job Administrator",
        role="ADMIN",
        is_email_verified=True
    )
    db.add(admin_user)

    # 4. Insert 20 Realistic Jobs
    created_jobs = []
    for idx, job_data in enumerate(REALISTIC_JOBS):
        hr_owner_id = sarah.id if idx in [0, 12, 13] else None
        job_obj = Job(
            hr_id=hr_owner_id,
            title=job_data["title"],
            company_name=job_data["company_name"],
            company_logo=job_data["company_logo"],
            location=job_data["location"],
            work_type=job_data["work_type"],
            employment_type=job_data["employment_type"],
            experience_min=job_data["experience_min"],
            experience_max=job_data["experience_max"],
            salary_range=job_data["salary_range"],
            description=job_data["description"],
            responsibilities=job_data["responsibilities"],
            education_req=job_data["education_req"],
            is_active=True
        )
        db.add(job_obj)
        db.commit()
        db.refresh(job_obj)
        created_jobs.append(job_obj)

        for s in job_data["required_skills"]:
            db.add(JobSkill(job_id=job_obj.id, name=s, skill_type="REQUIRED", importance="High"))
        for s in job_data["preferred_skills"]:
            db.add(JobSkill(job_id=job_obj.id, name=s, skill_type="PREFERRED", importance="Medium"))
        for s in job_data["bonus_skills"]:
            db.add(JobSkill(job_id=job_obj.id, name=s, skill_type="BONUS", importance="Low"))

    # 5. Seed Applications for Alex Sharma (Kanban stages: Saved, Applied, Assessment, Interview, Offer, Rejected)
    kanban_apps = [
        (created_jobs[0].id, "Interview", "Technical round scheduled for Saturday."),
        (created_jobs[1].id, "Applied", "Resume sent directly through platform."),
        (created_jobs[2].id, "Assessment", "Online coding test link received."),
        (created_jobs[3].id, "Offer", "Received initial compensation offer ₹17.5L!"),
        (created_jobs[8].id, "Saved", "Reviewing interview questions."),
        (created_jobs[4].id, "Rejected", "Lacked required 3+ yrs Kubernetes cluster leadership.")
    ]
    for j_id, st, notes in kanban_apps:
        db.add(Application(user_id=alex.id, job_id=j_id, status=st, applied_date="2 days ago", notes=notes))

    # 6. Seed Scheduled Interview for Alex & Sarah
    db.add(Interview(
        hr_id=sarah.id,
        candidate_id=alex.id,
        job_id=created_jobs[0].id,
        interview_date="2026-09-12",
        interview_time="02:30 PM IST",
        interview_type="Technical Video Interview",
        meeting_link="https://meet.google.com/skills2job-google-round",
        notes="Discussion on React server components, REST API caching, and microservices architecture.",
        status="SCHEDULED"
    ))

    db.commit()
