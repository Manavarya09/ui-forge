from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, posts, users
from .config.database import engine
from .models import Base

app = FastAPI(title="FastAPI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": str(__import__('datetime').datetime.now())}

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(posts.router, prefix="/api/posts", tags=["posts"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
