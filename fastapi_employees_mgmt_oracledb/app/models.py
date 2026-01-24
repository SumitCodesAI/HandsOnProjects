from sqlalchemy import Column, Integer, String, Float, DateTime, Date
from app.database import Base

class Employee(Base):
    __tablename__ = "employee"
    
    emp_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True)
    phone = Column(String(20))
    hire_date = Column(Date)
    salary = Column(Float)
    department = Column(String(50))
    created_at = Column(DateTime)