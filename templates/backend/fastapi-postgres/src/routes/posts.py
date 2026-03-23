from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..config.database import get_db
from ..config.auth import verify_token
from ..models.models import Post

router = APIRouter()

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    return verify_token(token)

class PostCreate(BaseModel):
    title: str
    content: str | None = None
    published: bool = False

@router.get("/")
def get_posts(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    posts = db.query(Post).filter(Post.author_id == current_user["user_id"]).all()
    return {"success": True, "data": posts}

@router.post("/")
def create_post(post: PostCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db_post = Post(**post.model_dump(), author_id=current_user["user_id"])
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return {"success": True, "data": db_post}

@router.put("/{post_id}")
def update_post(post_id: int, post: PostCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db_post = db.query(Post).filter(Post.id == post_id, Post.author_id == current_user["user_id"]).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    for key, value in post.model_dump().items():
        setattr(db_post, key, value)
    db.commit()
    return {"success": True, "message": "Post updated"}

@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db_post = db.query(Post).filter(Post.id == post_id, Post.author_id == current_user["user_id"]).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(db_post)
    db.commit()
    return {"success": True, "message": "Post deleted"}
