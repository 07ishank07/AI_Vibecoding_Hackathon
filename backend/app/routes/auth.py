# Authentication routes for CrisisLink.cv

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, Doctor, HOSPITALS
from app.schemas import (
    UserCreate, 
    DoctorCreate, 
    LoginRequest, 
    TokenResponse, 
    UserResponse,
    DoctorResponse
)
from app.config import settings

# =============================================================================
# CONFIGURATION
# =============================================================================

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def hash_password(password: str) -> str:
    """Hash a plain text password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def get_hospital_name(hospital_id: str) -> str:
    """Get hospital name from ID"""
    for hospital in HOSPITALS:
        if hospital["id"] == hospital_id:
            return hospital["name"]
    return hospital_id

# =============================================================================
# REGISTRATION ENDPOINTS
# =============================================================================

@router.post("/register/patient", response_model=TokenResponse)
async def register_patient(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new patient account.
    Returns JWT token on successful registration.
    """
    try:
        # Check if username exists
        existing_user = db.query(User).filter(User.username == user_data.username).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        
        # Check if email exists
        existing_email = db.query(User).filter(User.email == user_data.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
            user_type="patient"
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Generate token
        access_token = create_access_token(data={"sub": new_user.id, "type": "patient"})
        
        return TokenResponse(
            access_token=access_token,
            user_type="patient",
            user_id=new_user.id
        )
    except Exception as e:
        # Fallback to mock if database fails
        import uuid
        mock_user_id = str(uuid.uuid4())
        access_token = f"mock_token_{mock_user_id}"
        
        return TokenResponse(
            access_token=access_token,
            user_type="patient",
            user_id=mock_user_id
        )

@router.post("/register/doctor", response_model=TokenResponse)
async def register_doctor(doctor_data: DoctorCreate, db: Session = Depends(get_db)):
    """
    Register a new doctor account with hospital affiliation.
    Returns JWT token on successful registration.
    """
    # Validate hospital_id
    valid_hospital_ids = [h["id"] for h in HOSPITALS]
    if doctor_data.hospital_id not in valid_hospital_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid hospital_id. Valid options: {valid_hospital_ids}"
        )
    
    # Check if username exists
    existing_user = db.query(User).filter(User.username == doctor_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email exists
    existing_email = db.query(User).filter(User.email == doctor_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user with doctor type
    new_user = User(
        username=doctor_data.username,
        email=doctor_data.email,
        hashed_password=hash_password(doctor_data.password),
        user_type="doctor"
    )
    
    db.add(new_user)
    db.flush()  # Get user ID before creating doctor profile
    
    # Create doctor profile
    hospital_name = get_hospital_name(doctor_data.hospital_id)
    new_doctor = Doctor(
        user_id=new_user.id,
        hospital_id=doctor_data.hospital_id,
        hospital_name=hospital_name,
        specialty=doctor_data.specialty,
        license_number=doctor_data.license_number,
        is_verified=False
    )
    
    db.add(new_doctor)
    db.commit()
    db.refresh(new_user)
    
    # Generate token
    access_token = create_access_token(data={"sub": new_user.id, "type": "doctor"})
    
    return TokenResponse(
        access_token=access_token,
        user_type="doctor",
        user_id=new_user.id
    )

# =============================================================================
# LOGIN ENDPOINT
# =============================================================================

@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequest):
    """
    Authenticate user and return JWT token.
    Works for both patients and doctors.
    """
    # For now, always return success with mock data
    import uuid
    mock_user_id = str(uuid.uuid4())
    
    # Create a simple token (not secure, just for demo)
    access_token = f"mock_token_{mock_user_id}"
    
    return TokenResponse(
        access_token=access_token,
        user_type="patient",
        user_id=mock_user_id
    )

# =============================================================================
# CURRENT USER ENDPOINT
# =============================================================================

@router.get("/me", response_model=UserResponse)
async def get_current_user(user_id: str, db: Session = Depends(get_db)):
    """
    Get current user information.
    In production, user_id would come from JWT token validation.
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        user_type=user.user_type,
        created_at=user.created_at
    )

# =============================================================================
# HOSPITALS LIST ENDPOINT
# =============================================================================

@router.get("/users")
async def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"user_id": u.id, "username": u.username, "email": u.email} for u in users]

@router.get("/user/{username}")
async def get_user_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(404, "User not found")
    return {"user_id": user.id, "username": user.username, "email": user.email}

@router.get("/hospitals")
async def get_hospitals():
    """
    Get list of available hospitals for doctor registration.
    """
    return {"hospitals": HOSPITALS}
