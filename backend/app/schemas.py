# Pydantic schemas

from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime

class MedicalProfileCreate(BaseModel):
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
    id: str
    full_name: str
    blood_type: Optional[str]
    emergency_url: str
    qr_code_url: str
    updated_at: datetime

class EmergencyContactCreate(BaseModel):
    name: str
    relation: str
    phone: str
    email: Optional[str] = None
    priority: int

class EmergencyView(BaseModel):
    full_name: str
    blood_type: Optional[str]
    allergies: List[str]
    medications: List[str]
    medical_conditions: List[str]
    dnr_status: bool
    special_instructions: Optional[str]
    emergency_contacts: List[dict]
    languages: List[str]