from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Employee
from app.schemas import EmployeeResponse, SalaryUpdate

router = APIRouter(prefix="/employees", tags=["employees"])

@router.get("", response_model=List[EmployeeResponse])
def get_all_employees(db: Session = Depends(get_db)):
    """Retrieve all employees from the database."""
    employees = db.query(Employee).all()
    return employees

@router.get("/{emp_id}", response_model=EmployeeResponse)
def get_employee(emp_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific employee by emp_id."""
    employee = db.query(Employee).filter(Employee.emp_id == emp_id).first()
    if not employee:
        raise HTTPException(
            status_code=404,
            detail=f"Employee with emp_id {emp_id} not found" 
        )
    return employee

# Add this new endpoint
@router.put("/{emp_id}/salary", response_model=EmployeeResponse)
def update_employee_salary(
    emp_id: int, 
    salary_update: SalaryUpdate, 
    db: Session = Depends(get_db)
):
    """Update salary for a specific employee."""
    # Find the employee
    employee = db.query(Employee).filter(Employee.emp_id == emp_id).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail=f"Employee with emp_id {emp_id} not found")
    
    # Validate salary is positive
    if salary_update.salary <= 0:
        raise HTTPException(status_code=400, detail="Salary must be greater than 0")
    
    # Update the salary
    employee.salary = salary_update.salary
    
    # Commit changes to database
    db.commit()
    db.refresh(employee)
    
    return employee