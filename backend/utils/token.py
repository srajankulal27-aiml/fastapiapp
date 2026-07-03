from fastapi import HTTPException, Depends
from jose import jwt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.database import get_db
from schemas.token import Token
import os
from models import users
from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=2)):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str, db: Session = Depends(get_db)):
    current_user = verify_token(token)
    if current_user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return current_user