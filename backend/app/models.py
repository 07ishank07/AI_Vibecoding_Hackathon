# SQLAlchemy models for CrisisLink.cv

from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, JSON, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

# =============================================================================
# HARDCODED HOSPITAL OPTIONS
# =============================================================================

HOSPITALS = [
    {"id": "royal-melbourne", "name": "Royal Melbourne Hospital"},
    {"id": "alfred", "name": "The Alfred Hospital"},
    {"id": "st-vincents", "name": "St Vincent's Hospital"},
    {"id": "royal-childrens", "name": "Royal Children's Hospital"},
    {"id": "monash", "name": "Monash Medical Centre"},
    {"id": "austin", "name": "Austin Hospital"},
    {"id": "western", "name": "Western Health"},
    {"id": "eastern", "name": "Eastern Health"},
]

# =============================================================================
# USER MODEL (Patients and Doctors both extend this)
# =============================================================================

class User(Base):
    """
    Base user model for all authenticated users.
    user_type determines if this is a 'patient' or 'doctor'.
    """
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    user_type = Column(String, nullable=False, default="patient")  # 'patient' or 'doctor'
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    profile = relationship("MedicalProfile", back_populates="user", uselist=False)
    contacts = relationship("EmergencyContact", back_populates="user")
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False)

# =============================================================================
# DOCTOR MODEL
# =============================================================================

class Doctor(Base):
    """
    Extended profile for medical professionals.
    Links to a User with user_type='doctor'.
    """
    __tablename__ = "doctors"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Professional Info
    hospital_id = Column(String, nullable=False)  # References HOSPITALS list
    hospital_name = Column(String, nullable=False)
    specialty = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    
    # Verification Status
    is_verified = Column(Boolean, default=False)
    verified_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="doctor_profile")

# =============================================================================
# MEDICAL PROFILE MODEL (For Patients)
# =============================================================================

class MedicalProfile(Base):
    """
    Patient's medical information profile.
    Contains encrypted sensitive medical data.
    """
    __tablename__ = "medical_profiles"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    
    # Basic Info
    full_name = Column(String, nullable=False)
    date_of_birth = Column(String)
    blood_type = Column(String)
    
    # Medical Info (encrypted)
    allergies = Column(Text)  # JSON encrypted
    medications = Column(Text)  # JSON encrypted
    medical_conditions = Column(Text)  # JSON encrypted
    
    # Emergency Instructions
    dnr_status = Column(Boolean, default=False)
    organ_donor = Column(Boolean, default=False)
    special_instructions = Column(Text)
    
    # Languages spoken
    languages = Column(JSON)  # ["English", "Spanish"]
    
    # QR Code
    qr_code_url = Column(String)
    emergency_url = Column(String)  # username.cv
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="profile")

# =============================================================================
# EMERGENCY CONTACT MODEL
# =============================================================================

class EmergencyContact(Base):
    """
    Emergency contacts for a patient.
    Ordered by priority for notification sequence.
    """
    __tablename__ = "emergency_contacts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    
    name = Column(String, nullable=False)
    relation = Column(String)  # "Spouse", "Parent", etc.
    phone = Column(String, nullable=False)
    email = Column(String)
    priority = Column(Integer, default=1)  # 1, 2, 3
    
    # Relationship
    user = relationship("User", back_populates="contacts")

# =============================================================================
# EMERGENCY ACCESS LOG MODEL
# =============================================================================

class EmergencyAccess(Base):
    """
    Logs every access to a patient's emergency profile.
    Used for audit and notification purposes.
    """
    __tablename__ = "emergency_access_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    accessed_at = Column(DateTime, default=datetime.utcnow)
    responder_info = Column(Text)  # IP, location, etc.
    access_type = Column(String)  # "qr_scan", "url_access"


# =============================================================================
# REFERENCE DATA MODEL
# =============================================================================

class ReferenceData(Base):
    __tablename__ = "reference_data"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True)  # "Allergies", "Medications", "Conditions"
    subcategory = Column(String, nullable=True) # e.g., "Foods", "Environmental"
    name = Column(String, unique=True, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "subcategory": self.subcategory,
            "name": self.name
        }