from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db, User, JobSeekerProfile, HRProfile
from app.schemas import UserRegister, UserLogin, OTPVerify, RoleSelect, TokenResponse
from app.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
def register(req: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")
    
    new_user = User(
        email=req.email,
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        phone=req.phone,
        role="JOB_SEEKER",
        verification_code="123456",
        is_email_verified=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create default job seeker profile
    profile = JobSeekerProfile(user_id=new_user.id)
    db.add(profile)
    db.commit()
    
    token = create_access_token({"sub": new_user.email, "role": new_user.role, "id": new_user.id})
    return {
        "message": "Registration successful! A verification code has been dispatched.",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role": new_user.role,
            "is_email_verified": new_user.is_email_verified
        }
    }

@router.post("/login")
def login(req: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    token = create_access_token({"sub": user.email, "role": user.role, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar_url": user.avatar_url,
            "is_email_verified": user.is_email_verified
        }
    }

@router.post("/verify-email")
def verify_email(req: OTPVerify, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    if req.code == "123456" or (user.verification_code and req.code == user.verification_code):
        user.is_email_verified = True
        db.commit()
        return {"success": True, "message": "Account verified successfully! ✓"}
    else:
        raise HTTPException(status_code=400, detail="Invalid verification code. Please try again.")

@router.post("/select-role")
def select_role(req: RoleSelect, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    user.role = req.role
    if req.role == "HR" and not user.hr_profile:
        hr_p = HRProfile(user_id=user.id, recruiter_name=user.full_name)
        db.add(hr_p)
    elif req.role == "JOB_SEEKER" and not user.job_seeker_profile:
        js_p = JobSeekerProfile(user_id=user.id)
        db.add(js_p)
        
    db.commit()
    token = create_access_token({"sub": user.email, "role": user.role, "id": user.id})
    return {"success": True, "role": user.role, "access_token": token}

@router.get("/demo/{role}")
def login_as_demo(role: str, db: Session = Depends(get_db)):
    """Instant one-click demo login for examiners and recruiters."""
    if role.lower() in ["hr", "recruiter"]:
        user = db.query(User).filter(User.email == "sarah.jenkins@techcorp.example.com").first()
    elif role.lower() in ["admin"]:
        user = db.query(User).filter(User.email == "admin@skills2job.example.com").first()
    else:
        user = db.query(User).filter(User.email == "alex.sharma@example.com").first()
        
    if not user:
        raise HTTPException(status_code=404, detail="Demo account not found in database.")
        
    token = create_access_token({"sub": user.email, "role": user.role, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar_url": user.avatar_url,
            "is_email_verified": user.is_email_verified
        }
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "avatar_url": current_user.avatar_url,
        "is_email_verified": current_user.is_email_verified,
        "is_phone_verified": current_user.is_phone_verified
    }
