# Emergency access endpoint

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, MedicalProfile, EmergencyContact, EmergencyAccess
from app.schemas import EmergencyView
from app.utils.encryption import decrypt_data
from app.services.notifications import notify_emergency_contacts
from app.services.ai_voice import generate_emergency_speech
from datetime import datetime

router = APIRouter(prefix="/api/emergency", tags=["emergency"])

@router.get("/{username}", response_model=EmergencyView)
async def get_emergency_profile(
    username: str,
    request: Request,
    language: str = "en",
    db: Session = Depends(get_db)
):
    # Find user
    user = db.query(User).filter_by(username=username).first()
    if not user:
        raise HTTPException(404, "User not found")
    
    # Get profile
    profile = db.query(MedicalProfile).filter_by(user_id=user.id).first()
    if not profile:
        raise HTTPException(404, "Emergency profile not found")
    
    # Log access
    access_log = EmergencyAccess(
        user_id=user.id,
        responder_info=str(request.client.host),
        access_type="url_access"
    )
    db.add(access_log)
    
    # Get emergency contacts
    contacts = db.query(EmergencyContact).filter_by(user_id=user.id).order_by(EmergencyContact.priority).all()
    
    # Notify contacts (async in background in real app)
    contact_list = [{"name": c.name, "phone": c.phone, "priority": c.priority} for c in contacts]
    # await notify_emergency_contacts(contact_list, profile.full_name)
    
    db.commit()
    
    # Return decrypted data
    return EmergencyView(
        full_name=profile.full_name,
        blood_type=profile.blood_type,
        allergies=decrypt_data(profile.allergies),
        medications=decrypt_data(profile.medications),
        medical_conditions=decrypt_data(profile.medical_conditions),
        dnr_status=profile.dnr_status,
        special_instructions=profile.special_instructions,
        emergency_contacts=contact_list,
        languages=profile.languages
    )

@router.get("/{username}/voice")
async def get_voice_emergency(
    username: str,
    language: str = "en",
    db: Session = Depends(get_db)
):
    """Generate voice reading of emergency info"""
    user = db.query(User).filter_by(username=username).first()
    if not user:
        raise HTTPException(404, "User not found")
    
    profile = db.query(MedicalProfile).filter_by(user_id=user.id).first()
    
    profile_data = {
        "full_name": profile.full_name,
        "blood_type": profile.blood_type,
        "allergies": decrypt_data(profile.allergies),
        "medications": decrypt_data(profile.medications),
        "medical_conditions": decrypt_data(profile.medical_conditions),
        "dnr_status": profile.dnr_status,
        "special_instructions": profile.special_instructions
    }
    
    speech_text = generate_emergency_speech(profile_data, language)
    
    return {"text": speech_text, "audio_url": "generated_audio_url"}