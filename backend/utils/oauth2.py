from models.users import User
# pyrefly: ignore [missing-import]
from fastapi import Depends, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.security import OAuth2PasswordBearer
from database import get_db
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
# pyrefly: ignore [missing-import]
from sqlalchemy.future import select
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from sqlalchemy import text
from utils.token import verify_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme),db:AsyncSession=Depends(get_db)):
    user_info= verify_access_token(token, db)
    result = await db.execute(select(User).filter(User.id == int (user_info["sub"])))
    current_user=result.scalars().first()

    if current_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )
    return current_user

def role_required(roles: list):
    normalized_roles = [r.lower() for r in roles]
    def _role_decorator(current_user = Depends(get_current_user)):
        user_role = (getattr(current_user, "role", "") or "").lower()
        if user_role not in normalized_roles:
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions"
            )
        return current_user
    return _role_decorator