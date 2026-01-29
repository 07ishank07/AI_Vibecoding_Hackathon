# User profile CRUD

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, MedicalProfile, EmergencyContact
from app.schemas import MedicalProfileCreate, MedicalProfileResponse
from app.utils.encryption import encrypt_data
from app.utils.qr_generator import generate_qr_code
from app.config import settings

router = APIRouter(prefix="/api/profiles", tags=["profiles"])

@router.post("/", response_model=MedicalProfileResponse)
async def create_profile(
    profile: MedicalProfileCreate,
    user_id: str,  # In real app, get from JWT token
    db: Session = Depends(get_db)
):
    # Check if profile exists
    existing = db.query(MedicalProfile).filter_by(user_id=user_id).first()
    if existing:
        raise HTTPException(400, "Profile already exists")
    
    # Get user
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    
    # Create emergency URL
    emergency_url = f"https://{settings.CV_DOMAIN_BASE}/{user.username}"
    
    # Generate QR code
    qr_code = generate_qr_code(emergency_url)
    
    # Encrypt sensitive data
    allergies_encrypted = encrypt_data(profile.allergies)
    medications_encrypted = encrypt_data(profile.medications)
    conditions_encrypted = encrypt_data(profile.medical_conditions)
    
    # Create profile
    db_profile = MedicalProfile(
        user_id=user_id,
        full_name=profile.full_name,
        date_of_birth=profile.date_of_birth,
        blood_type=profile.blood_type,
        allergies=allergies_encrypted,
        medications=medications_encrypted,
        medical_conditions=conditions_encrypted,
        dnr_status=profile.dnr_status,
        organ_donor=profile.organ_donor,
        special_instructions=profile.special_instructions,
        languages=profile.languages,
        qr_code_url=qr_code,
        emergency_url=emergency_url
    )
    
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    
    return db_profile

@router.get("/{user_id}", response_model=MedicalProfileResponse)
async def get_profile(user_id: str, db: Session = Depends(get_db)):
    profile = db.query(MedicalProfile).filter_by(user_id=user_id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    return profile