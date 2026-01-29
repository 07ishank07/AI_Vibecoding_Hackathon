# Text-to-speech via API

import httpx
from app.config import settings

async def text_to_speech(text: str, language: str = "en") -> bytes:
    """Convert text to speech using AI/ML API"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.aimlapi.com/tts",  # Replace with actual endpoint
            headers={"Authorization": f"Bearer {settings.AIML_API_KEY}"},
            json={
                "text": text,
                "language": language,
                "voice": "emergency_clear"  # Hypothetical voice
            }
        )
        return response.content

def generate_emergency_speech(profile_data: dict, language: str = "en") -> str:
    """Generate emergency speech text"""
    text = f"""
    EMERGENCY MEDICAL INFORMATION:
    
    Patient name: {profile_data['full_name']}
    Blood type: {profile_data.get('blood_type', 'Unknown')}
    
    CRITICAL ALLERGIES: {', '.join(profile_data.get('allergies', ['None reported']))}
    
    Current medications: {', '.join(profile_data.get('medications', ['None reported']))}
    
    Medical conditions: {', '.join(profile_data.get('medical_conditions', ['None reported']))}
    
    DNR Status: {'YES - DO NOT RESUSCITATE' if profile_data.get('dnr_status') else 'No'}
    
    Special instructions: {profile_data.get('special_instructions', 'None')}
    
    Emergency contacts have been notified automatically.
    """
    return text.strip()