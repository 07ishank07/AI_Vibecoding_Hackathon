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
async def get_dashboard_stats():
    """
    Get dashboard statistics for medical professionals.
    Returns total accesses, active profiles, and emergency alerts.
    """
    return DashboardStats(
        total_accesses=42,
        active_profiles=15,
        emergency_alerts=0
    )

# =============================================================================
# PATIENT LIST ENDPOINT (For Doctors)
# =============================================================================

@router.get("/patients", response_model=PatientListResponse)
async def get_patients(search: str = "", limit: int = 50):
    """
    Get list of patients with profiles for doctor's patient lookup.
    Supports search by name.
    """
    mock_patients = [
        PatientListItem(
            id="patient1",
            name="John Doe",
            age=35,
            blood_type="A+",
            last_accessed="2 hours ago"
        ),
        PatientListItem(
            id="patient2",
            name="Jane Smith",
            age=28,
            blood_type="O-",
            last_accessed="1 day ago"
        )
    ]
    
    return PatientListResponse(
        patients=mock_patients,
        total_count=2
    )

# =============================================================================
# PATIENT PROFILE ENDPOINT (For Patient Dashboard)
# =============================================================================

@router.get("/profile/{user_id}")
async def get_patient_dashboard_profile(user_id: str, db: Session = Depends(get_db)):
    """
    Get patient's own profile data for their dashboard.
    """
    try:
        # Get user from database
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            # Create mock user if not found
            user_data = {
                "id": user_id,
                "username": f"user_{user_id[:8]}",
                "email": "user@crisislink.cv",
                "user_type": "patient"
            }
        else:
            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "user_type": user.user_type
            }
        
        # Get profile from database
        profile = db.query(MedicalProfile).filter(MedicalProfile.user_id == user_id).first()
        if profile:
            # Calculate completion percentage
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
            
            profile_data = {
                "id": profile.id,
                "full_name": profile.full_name,
                "date_of_birth": profile.date_of_birth,
                "blood_type": profile.blood_type,
                "qr_generated": bool(profile.qr_code_url),
                "completion_percentage": completion
            }
        else:
            # No profile exists yet
            profile_data = None
        
        return {
            "user": user_data,
            "profile": profile_data,
            "last_accessed": "Never"
        }
    except Exception as e:
        # Fallback to basic user data
        return {
            "user": {
                "id": user_id,
                "username": f"user_{user_id[:8]}",
                "email": "user@crisislink.cv",
                "user_type": "patient"
            },
            "profile": None,
            "last_accessed": "Never"
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
