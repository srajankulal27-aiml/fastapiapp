from sqlalchemy import Column,Integer,String,enum,relationship
from database import engine,Base,SessionLocal

class Company(Base):
    __tablename__="companies"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String,nullable=False,index=True)
    email=Column(String,unique=True)
    phone=Column(String,unique=True)
    jobs=relationship("job",back_populates="Company")
    