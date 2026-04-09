from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, Wallet
from auth import hash_password, verify_password, create_access_token, decode_token
from pydantic import BaseModel, EmailStr
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    email = decode_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(name=data.name, email=data.email, phone=data.phone,
                hashed_password=hash_password(data.password))
    db.add(user)
    db.flush()
    wallet = Wallet(user_id=user.id, balance=0.0)
    db.add(wallet)
    db.commit()
    return {"message": "Registered successfully"}

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "name": user.name, "email": user.email, "phone": user.phone}