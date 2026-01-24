# Employee API

FastAPI application to manage employee records from Oracle database.

## Setup Instructions

1. Create project directory and navigate to it:
```bash
mkdir employee_api
cd employee_api
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the application:
```bash
uvicorn app.main:app --reload
```

## API Endpoints

- `GET /` - Health check
- `GET /employees` - Get all employees
- `GET /employees/{emp_id}` - Get employee by ID
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation

## Testing

### Using curl:
```bash
# Get all employees
curl http://localhost:8000/employees

# Get employee with ID 1
curl http://localhost:8000/employees/1
```

### Using browser:
- Open http://localhost:8000/docs for interactive testing