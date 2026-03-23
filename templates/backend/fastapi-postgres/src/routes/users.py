from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from ..config.database import get_db
from ..config.auth import verify_token

router = APIRouter()

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    return verify_token(authorization.split(" ")[1])

@router.get("/me")
def get_me(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    from ..models.models import User
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "data": {"id": user.id, "email": user.email, "name": user.name}}

@router.put("/me")
def update_me(data: dict, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    from ..models.models import User
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in data.items():
        if hasattr(user, key):
            setattr(user, key, value)
    db.commit()
    return {"success": True, "message": "User updated"}
