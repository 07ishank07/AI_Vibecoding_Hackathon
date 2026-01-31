# SQLAlchemy models

from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    profile = relationship("MedicalProfile", back_populates="user", uselist=False)
    contacts = relationship("EmergencyContact", back_populates="user")

class MedicalProfile(Base):
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
    
    user = relationship("User", back_populates="profile")

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    
    name = Column(String, nullable=False)
    relation = Column(String)  # "Spouse", "Parent", etc.
    phone = Column(String, nullable=False)
    email = Column(String)
    priority = Column(String)  # 1, 2, 3
    
    user = relationship("User", back_populates="contacts")

class EmergencyAccess(Base):
    __tablename__ = "emergency_access_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    accessed_at = Column(DateTime, default=datetime.utcnow)
    responder_info = Column(Text)  # IP, location, etc.
    access_type = Column(String)  # "qr_scan", "url_access"