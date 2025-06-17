from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User
from schemas import UserCreate, UserLogin
from passlib.hash import bcrypt
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB 테이블 자동 생성
Base.metadata.create_all(bind=engine)

# DB 세션 관리
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 회원가입 API
@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_username = db.query(User).filter(User.username == user.username).first()
    db_email = db.query(User).filter(User.email == user.email).first()

    if db_username:
        raise HTTPException(status_code=400, detail="Username already exists")
    if db_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_pw = bcrypt.hash(user.password)
    new_user = User(
        username=user.username,
        name=user.name,
        email=user.email,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

# 로그인 API (토큰 X)
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not bcrypt.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful"}

@app.get("/")
def health_check():
    return {"status": "Emotion FastAPI Server Running!"}

