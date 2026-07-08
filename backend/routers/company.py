# pyrefly: ignore [missing-import]
from fastapi import APIRouter,HTTPException,Depends,status
from schemas import company
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
# pyrefly: ignore [missing-import]
from sqlalchemy.future import select
from schemas.company import CompanyCreate,CompanyUpdate,CompanyResponse
from models.company import Company
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import selectinload
from database import get_db,SessionLocal
# pyrefly: ignore [missing-import]
from utils.oauth2 import get_current_user

router = APIRouter(prefix="/company", tags=["company"])

@router.post("/",status_code=status.HTTP_201_CREATED,response_model=CompanyResponse)
async def create_company(company: CompanyCreate,db:Session = Depends(get_db),current_user = Depends(get_current_user)):
    try:
        db_company = Company(**company.dict())
        db.add(db_company)
        await db.commit()
        await db.refresh(db_company)
        return db_company
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        
@router.get("/",status_code=status.HTTP_200_OK,response_model=list[CompanyResponse])
async def get_all_company(db:Session = Depends(get_db),current_user = Depends(get_current_user)):
    try:
        result=await db.execute(select(Company).options(selectinload(Company.jobs)))
        companies = result.scalars().all()
        return companies
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{company_id}",status_code=status.HTTP_200_OK,response_model=CompanyResponse)
async def get_company(company_id: int,db:Session = Depends(get_db),current_user = Depends(get_current_user)):
    try:
        result = await db.execute(select(Company).filter(Company.id == company_id))
        company = result.scalars().first()
        if not company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        return company
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put("/{company_id}",status_code=status.HTTP_201_CREATED)
async def update_company(company_id: int,company: CompanyUpdate,db:Session = Depends(get_db),current_user = Depends(get_current_user)):
    try:
        result = await db.execute(select(Company).filter(Company.id == company_id))
        db_company = result.scalars().first()
        if not db_company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        for key, value in company.dict().items():
            setattr(db_company, key, value)
        db.commit()
        db.refresh(db_company)
        return db_company
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete("/{company_id}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id: int,db:Session = Depends(get_db),current_user = Depends(get_current_user)):
    try:
        result = await db.execute(select(Company).filter(Company.id == company_id))
        db_company = result.scalars().first()
        if not db_company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        await db.delete(db_company)
        await db.commit()
        return {"detail": "Company deleted successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

#@router.get("/")
#def read_company():
#    return {"company": "Company root"}
#
#@router.get("/{company_id}")
#def read_company(company_id: int):
#    return {"company_id": company_id}