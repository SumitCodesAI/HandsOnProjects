from decimal import Decimal
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class EmployeeResponse(BaseModel):
    emp_id: int
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    hire_date: Optional[date] = None
    salary: Optional[float] = None
    department: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# New schema for salary update
class SalaryUpdate(BaseModel):
    salary: Decimal

    class Config:
        # Validates that salary is positive
        json_schema_extra = {
            "example": {
                "salary": 85000.00
            }
        }        