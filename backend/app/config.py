# Environment variables, settings

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/crisislink"
    SECRET_KEY: str = "your-secret-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # API Keys
    AIML_API_KEY: str = ""
    COMET_API_KEY: str = ""
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""
    
    # LeanMCP
    LEANMCP_API_KEY: str = ""
    
    # Domain
    CV_DOMAIN_BASE: str = "emergency.crisislink.cv"
    
    class Config:
        env_file = ".env"

settings = Settings()