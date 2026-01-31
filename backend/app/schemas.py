# Pydantic schemas for CrisisLink.cv API

from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# =============================================================================
# AUTH SCHEMAS
# =============================================================================

class UserCreate(BaseModel):
    """Schema for patient registration"""
    username: str
    email: EmailStr
    password: str

class DoctorCreate(BaseModel):
    """Schema for doctor registration with hospital selection"""
    username: str
    email: EmailStr
    password: str
    hospital_id: str
    hospital_name: str
    specialty: Optional[str] = None
    license_number: Optional[str] = None

class LoginRequest(BaseModel):
    """Schema for login request"""
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    """Schema for auth token response"""
    access_token: str
    token_type: str = "bearer"
    user_type: str
    user_id: str

class UserResponse(BaseModel):
    """Schema for user info response"""
    id: str
    username: str
    email: str
    user_type: str
    created_at: datetime

# =============================================================================
# DOCTOR SCHEMAS
# =============================================================================

class DoctorResponse(BaseModel):
    """Schema for doctor profile response"""
    id: str
    user_id: str
    hospital_id: str
    hospital_name: str
    specialty: Optional[str]
    license_number: Optional[str]
    is_verified: bool

# =============================================================================
# MEDICAL PROFILE SCHEMAS
# =============================================================================

class MedicalProfileCreate(BaseModel):
    """Schema for creating a medical profile"""
    full_name: str
    date_of_birth: Optional[str] = None
    blood_type: Optional[str] = None
    allergies: Optional[List[str]] = []
    medications: Optional[List[str]] = []
    medical_conditions: Optional[List[str]] = []
    dnr_status: bool = False
    organ_donor: bool = False
    special_instructions: Optional[str] = None
    languages: List[str] = ["English"]

class MedicalProfileResponse(BaseModel):
    """Schema for medical profile response"""
    id: str
    full_name: str
    date_of_birth: Optional[str]
    blood_type: Optional[str]
    emergency_url: Optional[str]
    qr_code_url: Optional[str]
    updated_at: datetime

class MedicalProfileFull(BaseModel):
    """Full medical profile with all details"""
    id: str
    full_name: str
    date_of_birth: Optional[str]
    blood_type: Optional[str]
    allergies: List[str]
    medications: List[str]
    medical_conditions: List[str]
    dnr_status: bool
    organ_donor: bool
    special_instructions: Optional[str]
    languages: List[str]
    emergency_url: Optional[str]
    qr_code_url: Optional[str]

# =============================================================================
# EMERGENCY CONTACT SCHEMAS
# =============================================================================

class EmergencyContactCreate(BaseModel):
    """Schema for creating emergency contact"""
    name: str
    relation: str
    phone: str
    email: Optional[str] = None
    priority: int

class EmergencyContactResponse(BaseModel):
    """Schema for emergency contact response"""
    id: str
    name: str
    relation: str
    phone: str
    email: Optional[str]
    priority: int

# =============================================================================
# EMERGENCY VIEW SCHEMAS
# =============================================================================

class EmergencyView(BaseModel):
    """Schema for emergency access view (responders see this)"""
    full_name: str
    blood_type: Optional[str]
    allergies: List[str]
    medications: List[str]
    medical_conditions: List[str]
    dnr_status: bool
    special_instructions: Optional[str]
    emergency_contacts: List[dict]
    languages: List[str]

# =============================================================================
# DASHBOARD SCHEMAS
# =============================================================================

class DashboardStats(BaseModel):
    """Statistics for medical dashboard"""
    total_accesses: int
    active_profiles: int
    emergency_alerts: int  # Set to 0 for now

class PatientListItem(BaseModel):
    """Patient item for doctor's patient lookup"""
    id: str
    name: str
    age: Optional[int]
    blood_type: Optional[str]
    last_accessed: Optional[str]

class PatientListResponse(BaseModel):
    """Response for patient list endpoint"""
    patients: List[PatientListItem]
    total_count: int