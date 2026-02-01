# FastAPI entry point for CrisisLink.cv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.config import settings
from app.routes import profiles, emergency, auth, dashboard, reference, qr

# =============================================================================
# APP CONFIGURATION
# =============================================================================

app = FastAPI(
    title="CrisisLink.cv API",
    description="Emergency medical information system API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# DATABASE INITIALIZATION (OPTIONAL)
# =============================================================================

# Only initialize database if DATABASE_URL is available
if os.getenv("DATABASE_URL"):
    try:
        from app.database import engine
        from app.models import Base
        
        # Create all database tables
        Base.metadata.create_all(bind=engine)
        
        from app.database import SessionLocal
        from app.seeds.medical_data import seed_data
        
        # Auto-seed database
        db = SessionLocal()
        seed_data()
        db.close()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database initialization failed: {e}")
else:
    print("No DATABASE_URL found, skipping database initialization")

# =============================================================================
# ROUTER REGISTRATION
# =============================================================================

# Authentication routes
app.include_router(auth.router)

# Profile management routes
app.include_router(profiles.router)

# Emergency access routes
app.include_router(emergency.router)

# Dashboard data routes
app.include_router(dashboard.router)

# Reference data routes
app.include_router(reference.router)

# QR code generation routes
app.include_router(qr.router, prefix="/api/qr")

# =============================================================================
# ROOT ENDPOINTS
# =============================================================================

@app.get("/")
async def root():
    """API root endpoint - returns status"""
    return {
        "message": "CrisisLink.cv API",
        "status": "operational",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy"}