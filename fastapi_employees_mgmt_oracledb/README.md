# Employee API - FastAPI with Oracle Database

A RESTful API built with FastAPI to manage employee records from an Oracle database.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Architecture & Flow](#architecture--flow)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Interview Questions & Answers](#interview-questions--answers)

---

## 🎯 Project Overview

This is a FastAPI-based REST API that connects to an Oracle database to perform CRUD operations on employee records. The API provides endpoints to retrieve all employees or fetch specific employee details by ID.

**Key Features:**
- Fast, asynchronous API using FastAPI
- Oracle database integration using SQLAlchemy ORM
- Automatic API documentation (Swagger UI)
- Type validation using Pydantic models
- Connection pooling for database efficiency

---

## 🏗️ Architecture & Flow

```
Client (Browser/Postman)
        ↓
FastAPI Application (main.py)
        ↓
Router (employees.py)
        ↓
Database Session (database.py)
        ↓
SQLAlchemy ORM (models.py)
        ↓
Oracle Database (EMPLOYEE table)
```

### Request Flow:
1. **Client Request**: Client sends HTTP request to API endpoint
2. **FastAPI Routing**: Request is routed to appropriate endpoint handler
3. **Dependency Injection**: Database session is injected via `Depends(get_db)`
4. **ORM Query**: SQLAlchemy constructs and executes SQL query
5. **Data Retrieval**: Data fetched from Oracle database
6. **Validation**: Response validated against Pydantic schema
7. **JSON Response**: Data serialized and returned as JSON

---

## 💻 Technology Stack

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Modern web framework for building APIs |
| **SQLAlchemy** | SQL toolkit and ORM |
| **Oracledb** | Oracle database driver (python-oracledb) |
| **Pydantic** | Data validation using Python type annotations |
| **Uvicorn** | ASGI server for running the application |

---

## 📁 Project Structure

```
employee_api/
│
├── app/
│   ├── __init__.py           # Makes app a Python package
│   ├── main.py               # FastAPI application entry point
│   ├── database.py           # Database connection and session management
│   ├── models.py             # SQLAlchemy models (ORM)
│   ├── schemas.py            # Pydantic schemas for validation
│   └── routes/
│       ├── __init__.py
│       └── employees.py      # Employee endpoints
│
├── requirements.txt          # Python dependencies
└── README.md                # This file
```

### File Descriptions:

**main.py**
- Creates FastAPI application instance
- Includes routers
- Defines root health check endpoint

**database.py**
- Database connection URL configuration
- SQLAlchemy engine creation
- Session factory setup
- Database session dependency function

**models.py**
- Defines `Employee` ORM model
- Maps Python class to database table
- Defines column types and constraints

**schemas.py**
- Pydantic models for request/response validation
- `EmployeeResponse` schema for API responses

**routes/employees.py**
- Employee-related endpoint handlers
- `GET /employees` - Retrieve all employees
- `GET /employees/{emp_id}` - Retrieve specific employee

---

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.8+
- Oracle Database (XE/Free Edition or higher)
- pip package manager

### Installation Steps

1. **Clone/Navigate to project directory**
   ```bash
   cd C:\Users\sumit\projects\employee_api
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database connection**
   - Edit `app/database.py`
   - Update DATABASE_URL with your credentials:
     ```python
     DATABASE_URL = "oracle+oracledb://username:password@host:port/?service_name=SERVICE"
     ```

5. **Run the application**
   ```bash
   uvicorn app.main:app --reload
   ```

6. **Access the API**
   - API: http://127.0.0.1:8000
   - Interactive Docs: http://127.0.0.1:8000/docs
   - Alternative Docs: http://127.0.0.1:8000/redoc

---

## 🔌 API Endpoints

### Health Check
```http
GET /
```
**Response:**
```json
{
  "message": "Employee API is running",
  "version": "1.0.0"
}
```

### Get All Employees
```http
GET /employees
```
**Response:**
```json
[
  {
    "emp_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "hire_date": "2024-01-15",
    "salary": 75000.00,
    "department": "Engineering",
    "created_at": "2024-01-15T10:30:00"
  }
]
```

### Get Employee by ID
```http
GET /employees/{emp_id}
```
**Parameters:**
- `emp_id` (path parameter): Employee ID

**Response (200 OK):**
```json
{
  "emp_id": 2,
  "first_name": "FirstName2",
  "last_name": "LastName2",
  "email": "employee2@example.com",
  "phone": "555-0102",
  "hire_date": "2024-02-01",
  "salary": 65000.00,
  "department": "Sales",
  "created_at": "2024-02-01T09:00:00"
}
```

**Response (404 Not Found):**
```json
{
  "detail": "Employee with emp_id 999 not found"
}
```

---

## 🗄️ Database Schema

### EMPLOYEE Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| emp_id | INTEGER | PRIMARY KEY | Unique employee identifier |
| first_name | VARCHAR(50) | NOT NULL | Employee's first name |
| last_name | VARCHAR(50) | NOT NULL | Employee's last name |
| email | VARCHAR(100) | UNIQUE | Employee's email address |
| phone | VARCHAR(20) | | Contact phone number |
| hire_date | DATE | | Date of joining |
| salary | FLOAT | | Employee salary |
| department | VARCHAR(50) | | Department name |
| created_at | DATETIME | | Record creation timestamp |

---

## 🎤 Interview Questions & Answers

### Basic Questions

**Q1: What is FastAPI and why did you choose it?**

**A:** FastAPI is a modern, high-performance web framework for building APIs with Python. I chose it because:
- It's extremely fast (comparable to NodeJS and Go)
- Automatic interactive API documentation (Swagger UI)
- Built-in data validation using Pydantic
- Type hints support for better code quality
- Asynchronous support for handling concurrent requests
- Easy to learn and develop with

**Q2: Explain the project structure and purpose of each file.**

**A:** The project follows a modular structure:
- `main.py` - Application entry point, creates FastAPI instance and includes routers
- `database.py` - Handles database connection, creates SQLAlchemy engine and session factory
- `models.py` - Defines ORM models that map Python classes to database tables
- `schemas.py` - Pydantic models for request/response validation and serialization
- `routes/employees.py` - Contains endpoint handlers for employee-related operations

This separation of concerns makes the code maintainable and testable.

**Q3: How does the database connection work?**

**A:** 
1. SQLAlchemy engine is created with the Oracle connection string
2. Connection pooling is enabled with `pool_pre_ping=True` to verify connections
3. SessionLocal factory creates database sessions
4. `get_db()` function yields database sessions and ensures proper cleanup
5. Sessions are injected into endpoints using FastAPI's dependency injection

**Q4: What is the purpose of Pydantic schemas?**

**A:** Pydantic schemas serve multiple purposes:
- **Validation**: Automatically validate request/response data types
- **Serialization**: Convert ORM objects to JSON-compatible dictionaries
- **Documentation**: Auto-generate API documentation with data types
- **Type Safety**: Catch type errors during development
- **Data Parsing**: Handle data conversion (e.g., dates, datetimes)

### Intermediate Questions

**Q5: Explain the ORM model and how it maps to the database.**

**A:** The `Employee` class inherits from SQLAlchemy's `Base` class:
- `__tablename__ = "employee"` specifies the database table name
- Each class attribute (emp_id, first_name, etc.) maps to a table column
- `Column()` defines the data type and constraints
- `primary_key=True` indicates the primary key
- SQLAlchemy translates Python operations to SQL queries automatically

**Q6: How does dependency injection work in FastAPI?**

**A:** FastAPI uses the `Depends()` function for dependency injection:
```python
def get_employee(emp_id: int, db: Session = Depends(get_db)):
```
- `Depends(get_db)` tells FastAPI to call `get_db()` before executing the endpoint
- The database session is automatically created and injected
- FastAPI ensures proper cleanup (session close) after request completion
- This pattern makes testing easier and keeps code clean

**Q7: What happens when you query /employees/2?**

**A:** Complete flow:
1. FastAPI receives GET request to `/employees/2`
2. Router matches the path and extracts `emp_id=2`
3. `get_db()` creates a database session
4. Session is injected into `get_employee(emp_id=2, db=session)`
5. SQLAlchemy executes: `SELECT * FROM employee WHERE emp_id = 2`
6. Result is converted to Employee ORM object
7. If found: Pydantic serializes it to JSON and returns 200
8. If not found: HTTPException raises 404 error
9. Session is closed automatically

**Q8: How is the password encoded in the database URL?**

**A:** Special characters in URLs must be percent-encoded:
- Original password: `App@123`
- The `@` symbol is a reserved character in URLs
- Encoded: `App%40123` (@ becomes %40)
- This prevents parsing errors in the connection string

**Q9: What is connection pooling and why is it important?**

**A:** Connection pooling:
- Maintains a pool of reusable database connections
- `pool_pre_ping=True` verifies connections before use
- Reduces overhead of creating new connections for each request
- Improves performance under concurrent load
- Handles connection timeouts and stale connections

**Q10: How would you handle database connection errors?**

**A:** Multiple strategies:
1. Use `pool_pre_ping` to test connections before use
2. Implement try-catch blocks for OperationalError
3. Add retry logic with exponential backoff
4. Use FastAPI middleware for global exception handling
5. Return appropriate HTTP status codes (503 Service Unavailable)
6. Log errors for monitoring and debugging

### Advanced Questions

**Q11: How would you add authentication to this API?**

**A:** Several approaches:
- **JWT Tokens**: Use FastAPI's OAuth2 with JWT for stateless auth
- **API Keys**: Header-based API key validation
- **OAuth2**: Third-party authentication (Google, Microsoft)
- Implementation: Create security dependencies, protect endpoints with `Depends()`

**Q12: How would you implement pagination for the /employees endpoint?**

**A:** Add query parameters:
```python
@router.get("", response_model=List[EmployeeResponse])
def get_all_employees(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    employees = db.query(Employee).offset(skip).limit(limit).all()
    return employees
```

**Q13: How would you add a POST endpoint to create employees?**

**A:** 
1. Create `EmployeeCreate` schema in schemas.py
2. Add POST endpoint:
```python
@router.post("", response_model=EmployeeResponse, status_code=201)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee
```

**Q14: How would you implement filtering and searching?**

**A:** Add query parameters:
```python
@router.get("", response_model=List[EmployeeResponse])
def get_employees(
    department: Optional[str] = None,
    min_salary: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Employee)
    if department:
        query = query.filter(Employee.department == department)
    if min_salary:
        query = query.filter(Employee.salary >= min_salary)
    return query.all()
```

**Q15: How would you test this API?**

**A:** Multiple testing approaches:
- **Unit Tests**: Test individual functions with mocked database
- **Integration Tests**: Test with test database
- **Use pytest with TestClient**:
```python
from fastapi.testclient import TestClient
client = TestClient(app)
response = client.get("/employees/1")
assert response.status_code == 200
```

**Q16: How would you handle CORS for frontend applications?**

**A:** Add CORS middleware in main.py:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Q17: How would you deploy this API in production?**

**A:** Production deployment steps:
1. Use production ASGI server (Gunicorn with Uvicorn workers)
2. Set up environment variables for sensitive data
3. Use reverse proxy (Nginx) for SSL/TLS
4. Implement logging and monitoring
5. Use Docker for containerization
6. Deploy to cloud (AWS, Azure, GCP)
7. Set up CI/CD pipeline

**Q18: What security considerations should you be aware of?**

**A:** 
- Never hardcode credentials (use environment variables)
- Implement rate limiting to prevent abuse
- Validate and sanitize all inputs
- Use HTTPS in production
- Implement proper authentication/authorization
- Protect against SQL injection (ORM helps)
- Add request timeout limits
- Enable CORS only for trusted origins

**Q19: How would you optimize this API for better performance?**

**A:** 
- Add database indexes on frequently queried columns
- Implement caching (Redis) for frequently accessed data
- Use async endpoints for I/O-bound operations
- Optimize SQL queries (avoid N+1 queries)
- Implement pagination to limit response size
- Use database connection pooling (already implemented)
- Add response compression
- Use CDN for static content

**Q20: Explain the difference between synchronous and asynchronous endpoints.**

**A:** 
- **Sync** (current implementation): Blocks thread while waiting for DB
- **Async**: Can handle other requests while waiting for I/O
- For async: Use `async def` and `await` with async database drivers
- Async is better for I/O-bound operations and high concurrency
- Our current implementation is sync, suitable for most use cases

---

## 🚀 Running the Application

**Development Mode (with auto-reload):**
```bash
uvicorn app.main:app --reload
```

**Production Mode:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**With specific host and port:**
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Oracle Python Driver](https://python-oracledb.readthedocs.io/)

---

## 👤 Author

Sumit

---

## 📝 License

This project is for educational and interview purposes.
