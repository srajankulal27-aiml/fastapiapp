import os
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import create_async_engine,async_sessionmaker,AsyncSession
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import declarative_base
# pyrefly: ignore [missing-import]
from pathlib import Path
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
python-dotenv==1.1.1


load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

DATABASE_URL=os.getenv("DATABASE_URL","postgresql://postgres:admin123@localhost:5432/student_db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL=DATABASE_URL.replace("postgres://","postgresql+asyncpg://",1)

if "supabase.com" in DATABASE_URL:
    DATABASE_URL=DATABASE_URL.split("?")[0]
    engine = create_async_engine(
        DATABASE_URL,
        echo=False,
        connect_args={
            "ssl": "require",
            "statement_cache_size": 0,
            "prepared_statement_cache_size": 0,
        }
    )
else:
    engine = create_async_engine(DATABASE_URL,echo=False)
SessionLocal=async_sessionmaker(autocommit=False,autoflush=False,bind=engine,class_=AsyncSession)
Base=declarative_base()

async def get_db():
    async with SessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()