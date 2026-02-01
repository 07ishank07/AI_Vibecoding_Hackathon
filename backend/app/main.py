# FastAPI entry point for CrisisLink.cv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.config import settings
from app.routes import profiles, emergency, auth, dashboard, reference, qr
from app.database import engine
from app.models import Base

# =============================================================================
# DATABASE INITIALIZATION
# =============================================================================

# Create all database tables
# Create all database tables
Base.metadata.create_all(bind=engine)

from app.database import SessionLocal
from app.routes.reference import populate_reference_data

# Auto-seed database
try:
    db = SessionLocal()
    from app.seeds.medical_data import seed_data
    seed_data()
    print("Database seeded successfully")
except Exception as e:
    print(f"Error seeding database: {e}")
finally:
    if 'db' in locals():
        db.close()

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