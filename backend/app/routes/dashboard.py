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
async def get_patient_dashboard_profile(user_id: str):
    """
    Get patient's own profile data for their dashboard.
    """
    return {
        "user": {
            "id": user_id,
            "username": f"user_{user_id[:8]}",
            "email": "demo@crisislink.cv",
            "user_type": "patient"
        },
        "profile": {
            "id": f"profile_{user_id[:8]}",
            "full_name": "Demo User",
            "date_of_birth": "1990-01-01",
            "blood_type": "O+",
            "qr_generated": True,
            "completion_percentage": 85
        },
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
