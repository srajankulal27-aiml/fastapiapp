from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from models.users import User
from database import get_db
from schemas.token import Token
from utils.security import hash_password, verify_password
from schemas.users import UserCreate, UserResponse,Login_User
from utils.token import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(form_data:OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == form_data.username).first()
    if not existing_user:   
        raise HTTPException(status_code=400, detail="Invalid email or password")
    if not verify_password(form_data.password, existing_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    access_token = create_access_token(data={"sub": str(existing_user.id), "role": existing_user.role})
    return {"access_token": access_token, "token_type": "Bearer"}