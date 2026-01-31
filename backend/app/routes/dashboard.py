# Dashboard data routes for CrisisLink.cv

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, MedicalProfile, Doctor, EmergencyAccess
from app.schemas import DashboardStats, PatientListItem, PatientListResponse
from app.utils.encryption import decrypt_data

# =============================================================================
# CONFIGURATION
# =============================================================================

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def calculate_age(date_of_birth: str) -> int:
    """Calculate age from date of birth string (YYYY-MM-DD)"""
    if not date_of_birth:
        return None
    try:
        dob = datetime.strptime(date_of_birth, "%Y-%m-%d")
        today = datetime.today()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        return age
    except ValueError:
        return None

def format_last_accessed(accessed_at: datetime) -> str:
    """Format datetime to human-readable relative time"""
    if not accessed_at:
        return "Never"
    
    now = datetime.utcnow()
    diff = now - accessed_at
    
    if diff.days > 30:
        return f"{diff.days // 30} months ago"
    elif diff.days > 0:
        return f"{diff.days} days ago"
    elif diff.seconds > 3600:
        return f"{diff.seconds // 3600} hours ago"
    elif diff.seconds > 60:
        return f"{diff.seconds // 60} minutes ago"
    else:
        return "Just now"

# =============================================================================
# DASHBOARD STATISTICS ENDPOINT
# =============================================================================

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Get dashboard statistics for medical professionals.
    Returns total accesses, active profiles, and emergency alerts.
    """
    # Count total emergency accesses
    total_accesses = db.query(func.count(EmergencyAccess.id)).scalar() or 0
    
    # Count active profiles (users with medical profiles)
    active_profiles = db.query(func.count(MedicalProfile.id)).scalar() or 0
    
    # Emergency alerts set to 0 as per requirements
    emergency_alerts = 0
    
    return DashboardStats(
        total_accesses=total_accesses,
        active_profiles=active_profiles,
        emergency_alerts=emergency_alerts
    )

# =============================================================================
# PATIENT LIST ENDPOINT (For Doctors)
# =============================================================================

@router.get("/patients", response_model=PatientListResponse)
async def get_patients(
    search: str = "",
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Get list of patients with profiles for doctor's patient lookup.
    Supports search by name.
    """
    # Query patients with profiles
    query = db.query(User, MedicalProfile).join(
        MedicalProfile, User.id == MedicalProfile.user_id
    ).filter(User.user_type == "patient")
    
    # Apply search filter if provided
    if search:
        query = query.filter(MedicalProfile.full_name.ilike(f"%{search}%"))
    
    # Get results
    results = query.limit(limit).all()
    
    # Build patient list
    patients = []
    for user, profile in results:
        # Get last access time
        last_access = db.query(EmergencyAccess).filter(
            EmergencyAccess.user_id == user.id
        ).order_by(EmergencyAccess.accessed_at.desc()).first()
        
        last_accessed_str = format_last_accessed(last_access.accessed_at if last_access else None)
        
        patients.append(PatientListItem(
            id=user.id,
            name=profile.full_name,
            age=calculate_age(profile.date_of_birth),
            blood_type=profile.blood_type,
            last_accessed=last_accessed_str
        ))
    
    # Get total count
    total_count = db.query(func.count(MedicalProfile.id)).scalar() or 0
    
    return PatientListResponse(
        patients=patients,
        total_count=total_count
    )

# =============================================================================
# PATIENT PROFILE ENDPOINT (For Patient Dashboard)
# =============================================================================

@router.get("/profile/{user_id}")
async def get_patient_dashboard_profile(user_id: str, db: Session = Depends(get_db)):
    """
    Get patient's own profile data for their dashboard.
    """
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get profile
    profile = db.query(MedicalProfile).filter(MedicalProfile.user_id == user_id).first()
    
    # Calculate profile completion percentage
    completion = 0
    if profile:
        fields_to_check = [
            profile.full_name,
            profile.date_of_birth,
            profile.blood_type,
            profile.allergies,
            profile.medications,
            profile.medical_conditions,
            profile.languages,
            profile.qr_code_url
        ]
        filled_fields = sum(1 for f in fields_to_check if f)
        completion = int((filled_fields / len(fields_to_check)) * 100)
    
    # Get last access
    last_access = db.query(EmergencyAccess).filter(
        EmergencyAccess.user_id == user_id
    ).order_by(EmergencyAccess.accessed_at.desc()).first()
    
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "user_type": user.user_type
        },
        "profile": {
            "id": profile.id if profile else None,
            "full_name": profile.full_name if profile else None,
            "date_of_birth": profile.date_of_birth if profile else None,
            "blood_type": profile.blood_type if profile else None,
            "qr_generated": bool(profile.qr_code_url) if profile else False,
            "completion_percentage": completion
        } if profile else None,
        "last_accessed": format_last_accessed(last_access.accessed_at if last_access else None)
    }

# =============================================================================
# DOCTOR PROFILE ENDPOINT
# =============================================================================

@router.get("/doctor/{user_id}")
async def get_doctor_dashboard_profile(user_id: str, db: Session = Depends(get_db)):
    """
    Get doctor's profile data for their dashboard header.
    """
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.user_type != "doctor":
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Get doctor profile
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        },
        "doctor": {
            "hospital_name": doctor.hospital_name if doctor else None,
            "specialty": doctor.specialty if doctor else None,
            "is_verified": doctor.is_verified if doctor else False
        } if doctor else None
    }
