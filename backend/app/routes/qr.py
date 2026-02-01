from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.utils.qr_generator import generate_qr_code

router = APIRouter()

@router.get("/generate/{username}")
async def generate_qr_for_user(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    qr_code = generate_qr_code(username)
    return {"qr_code": qr_code}

@router.get("/my-qr")
async def get_my_qr(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    qr_code = generate_qr_code(user.username)
    return {"qr_code": qr_code}