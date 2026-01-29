# Multi-language translation

import httpx
from app.config import settings

async def translate_text(text: str, target_language: str) -> str:
    """Translate text using AI/ML API"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.aimlapi.com/translate",  # Replace with actual
            headers={"Authorization": f"Bearer {settings.AIML_API_KEY}"},
            json={
                "text": text,
                "target_language": target_language,
                "source_language": "auto"
            }
        )
        result = response.json()
        return result.get("translated_text", text)