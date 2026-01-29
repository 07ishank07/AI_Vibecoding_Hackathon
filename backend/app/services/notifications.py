# SMS/Email alerts

from twilio.rest import Client
from app.config import settings
import httpx

twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

async def send_emergency_sms(phone: str, message: str):
    """Send SMS to emergency contact"""
    try:
        message = twilio_client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone
        )
        return message.sid
    except Exception as e:
        print(f"SMS failed: {e}")
        return None

async def notify_emergency_contacts(contacts: list, patient_name: str, location: dict = None):
    """Notify all emergency contacts"""
    location_str = f"Location: {location.get('lat')}, {location.get('lng')}" if location else "Location: Unknown"
    
    for contact in contacts:
        message = f"""
🚨 EMERGENCY ALERT 🚨

{patient_name} has activated their emergency profile.

{location_str}

First responders have been notified.
You are listed as emergency contact #{contact['priority']}.

Reply CONFIRM when you receive this message.
        """.strip()
        
        await send_emergency_sms(contact['phone'], message)