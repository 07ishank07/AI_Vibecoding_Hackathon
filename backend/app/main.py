# FastAPI entry point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import profiles, emergency
from app.database import engine
from app.models import Base

# OLA_API_KEY is now accessible via settings.OLA_API_KEY

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CrisisLink.cv API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(profiles.router)
app.include_router(emergency.router)

@app.get("/")
async def root():
    return {"message": "CrisisLink.cv API", "status": "operational"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}