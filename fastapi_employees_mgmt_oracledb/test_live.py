import requests
import time

print("Waiting for server to be ready...")
time.sleep(2)

print("\nTesting API endpoints:")
print("=" * 50)

try:
    # Test root endpoint
    response = requests.get("http://127.0.0.1:8000/")
    print(f"GET / - Status: {response.status_code}")
    print(f"Response: {response.json()}\n")
except Exception as e:
    print(f"GET / - Error: {e}\n")

try:
    # Test employees/2
    response = requests.get("http://127.0.0.1:8000/employees/2")
    print(f"GET /employees/2 - Status: {response.status_code}")
    if response.status_code == 200:
        print(f"SUCCESS! Data: {response.json()}")
    else:
        print(f"Error Response: {response.text}")
except Exception as e:
    print(f"GET /employees/2 - Error: {e}")
