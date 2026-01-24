from fastapi import FastAPI
from app.routes import employees

app = FastAPI(
    title="Employee API",
    description="API for managing employee records from Oracle database",
    version="1.0.0"
)

app.include_router(employees.router)

@app.get("/")
def root():
    """
    Health check endpoint.
    """
    return {
        "message": "Employee API is running",
        "version": "1.0.0"
    }