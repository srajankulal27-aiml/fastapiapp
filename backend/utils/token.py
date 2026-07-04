
from jose import jwt
from jose.exceptions import JWTError
from datetime import datetime, timedelta
from database import get_db
from dotenv import load_dotenv
import os
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from models.users import User

load_dotenv()
# Use environment variable or fall back to a default for development
SECRET_KEY = os.getenv("SECRET_KEY") or "your-secret-key-change-this-in-production-12345678"
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta =timedelta(hours=2)):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str, db: Session = Depends(get_db)):
    try:
        to_decode = jwt.decode(token, key=SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )

    user_id = None
    if isinstance(to_decode, dict):
        user_id = to_decode.get("user_id") or to_decode.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )

    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )

    current_user = db.query(User).filter(User.id == user_id).first()
    if current_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )
    return current_user