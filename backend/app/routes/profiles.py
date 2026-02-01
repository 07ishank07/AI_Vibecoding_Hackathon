# User profile CRUD

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, MedicalProfile, EmergencyContact
from app.schemas import MedicalProfileCreate, MedicalProfileResponse, MedicalProfileFull, EmergencyContactCreate
from typing import List
from app.utils.encryption import encrypt_data, decrypt_data
from app.utils.qr_generator import generate_qr_code
from app.config import settings

router = APIRouter(prefix="/api/profiles", tags=["profiles"])

@router.post("/", response_model=MedicalProfileResponse)
async def create_profile(
    profile: MedicalProfileCreate,
    user_id: str,  # In real app, get from JWT token
):
    # For demo, always return success
    import uuid
    profile_id = str(uuid.uuid4())
    
    return {
        "id": profile_id,
        "full_name": profile.full_name,
        "date_of_birth": profile.date_of_birth,
        "blood_type": profile.blood_type,
        "emergency_url": f"https://crisislink.cv/emergency/{user_id}",
        "qr_code_url": "data:image/png;base64,mock_qr_code",
        "updated_at": "2024-01-01T00:00:00Z"
    }

@router.get("/{user_id}", response_model=MedicalProfileFull)
async def get_profile(user_id: str, db: Session = Depends(get_db)):
    profile = db.query(MedicalProfile).filter_by(user_id=user_id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    
    try:
        return MedicalProfileFull(
            id=profile.id,
            full_name=profile.full_name,
            date_of_birth=profile.date_of_birth,
            blood_type=profile.blood_type,
            allergies=decrypt_data(profile.allergies) if profile.allergies else [],
            medications=decrypt_data(profile.medications) if profile.medications else [],
            medical_conditions=decrypt_data(profile.medical_conditions) if profile.medical_conditions else [],
            dnr_status=profile.dnr_status,
            organ_donor=profile.organ_donor,
            special_instructions=profile.special_instructions,
            languages=profile.languages or ["English"],
            emergency_url=profile.emergency_url,
            qr_code_url=profile.qr_code_url
        )
    except Exception as e:
        raise HTTPException(500, f"Failed to decrypt profile data: {str(e)}")

@router.get("/debug/{user_id}")
async def debug_profile(user_id: str, db: Session = Depends(get_db)):
    profile = db.query(MedicalProfile).filter_by(user_id=user_id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    
    return {
        "id": profile.id,
        "full_name": profile.full_name,
        "blood_type": profile.blood_type,
        "allergies_encrypted": profile.allergies,
        "medications_encrypted": profile.medications,
        "conditions_encrypted": profile.medical_conditions,
        "allergies_decrypted": decrypt_data(profile.allergies) if profile.allergies else [],
        "medications_decrypted": decrypt_data(profile.medications) if profile.medications else [],
        "conditions_decrypted": decrypt_data(profile.medical_conditions) if profile.medical_conditions else []
    }
@router.put("/{user_id}", response_model=MedicalProfileResponse)
async def update_profile(
    user_id: str,
    profile: MedicalProfileCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(MedicalProfile).filter_by(user_id=user_id).first()
    if not existing:
        raise HTTPException(404, "Profile not found")
    
    # Get user for QR code generation
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    
    # Generate QR code if not exists
    if not existing.qr_code_url:
        existing.qr_code_url = generate_qr_code(user.username)
        existing.emergency_url = f"https://crisislink.cv/emergency/{user.username}"
    
    existing.full_name = profile.full_name
    existing.date_of_birth = profile.date_of_birth
    existing.blood_type = profile.blood_type
    existing.allergies = encrypt_data(profile.allergies)
    existing.medications = encrypt_data(profile.medications)
    existing.medical_conditions = encrypt_data(profile.medical_conditions)
    existing.dnr_status = profile.dnr_status
    existing.organ_donor = profile.organ_donor
    existing.special_instructions = profile.special_instructions
    existing.languages = profile.languages
    
    db.commit()
    db.refresh(existing)
    return existing