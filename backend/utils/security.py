import hashlib
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt", "pbkdf2_sha256"], deprecated="auto")

def hash_password(password: str) :


    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) :
    try:
        return pwd_context.verify(password, hashed_password)
    except Exception:
        # re-raise so the caller (login) sees the specific error
        raise

def get_password_hash(password: str) :
    return pwd_context.hash(password)
