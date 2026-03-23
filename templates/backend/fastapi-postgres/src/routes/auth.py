from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.hash import bcrypt
from ..config.database import get_db
from ..config.auth import create_access_token, verify_token
from ..models.models import User

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str
    name: str | None = None

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = bcrypt.hash(user.password)
    db_user = User(email=user.email, password=hashed, name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    token = create_access_token({"sub": db_user.email, "user_id": db_user.id})
    return {"success": True, "data": {"user": {"id": db_user.id, "email": db_user.email}, "token": token}}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not bcrypt.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": db_user.email, "user_id": db_user.id})
    return {"success": True, "data": {"token": token}}

@router.post("/logout")
def logout():
    return {"success": True, "message": "Logged out successfully"}
