import requests
import time

time.sleep(2)
try:
    response = requests.get("http://127.0.0.1:8000/employees/2")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Request Error: {e}")
