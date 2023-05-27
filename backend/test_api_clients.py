import json
from faker import Faker
import pytest
from pytest import fixture
from app import app as app
from dotenv import load_dotenv
import os

load_dotenv()
API_PASSWORD = os.getenv("API_PASSWORD")
fake = Faker()
CLIENT_ID = fake.uuid4()
 # Set the Authorization header
HEADERS = {
    "Authorization": API_PASSWORD
}
@fixture
def client():
    with app.test_client() as client:
        yield client

@pytest.mark.order(1)
def test_create_client(client):
    # Generate fake client data
    client_data = {
        "client_id": CLIENT_ID,
        "name": fake.name(),
        "email": fake.email(),
        "role": fake.random_element(["admin", "customer support"]),
        "created_at": fake.date_time().isoformat(),
        "password": fake.password()
    }

    # Send a POST request to create a new client
    response = client.post("/api/clients", data=json.dumps(client_data), content_type="application/json", headers=HEADERS)

    # Check the response status code and data
    assert response.status_code == 201
    assert response.data.decode() == "Client created successfully."

@pytest.mark.order(2)
def test_get_single_client(client):
    # Send a GET request to retrieve a client
    response = client.get(f"/api/clients/{CLIENT_ID}", content_type="application/json", headers=HEADERS)  # Replace with actual client ID
    print(
        response.data.decode()
    )
    # Check the response status code and data
    assert response.status_code == 200
    client_data = json.loads(response.data.decode())
    assert client_data["client_id"] == CLIENT_ID  # Replace with actual client ID
    # Assert other properties as needed

@pytest.mark.order(4)
def test_delete_single_client(client):
    # Send a DELETE request to delete a client
    response = client.delete(f"/api/clients/{CLIENT_ID}", content_type="application/json", headers=HEADERS)  # Replace with actual client ID
    print(
        response.data.decode()
    )
    # Check the response status code and data
    assert response.status_code == 200
    assert response.data.decode() == "Client deleted successfully."

@pytest.mark.order(3)
def test_update_single_client(client):
    # Generate fake updated client data
    updated_client_data = {
        "client_id": CLIENT_ID,  # Replace with actual client ID
        "name": fake.name(),
        "email": fake.email(),
        "role": fake.random_element(["admin", "customer support"]),
        "created_at": fake.date_time().isoformat(),
        "password": fake.password()
    }

    # Send a PUT request to update a client
    response = client.put(f"/api/clients/{CLIENT_ID}", data=json.dumps(updated_client_data), content_type="application/json", headers=HEADERS)  # Replace with actual client ID

    print(
        response.data.decode()
    )
    # Check the response status code and data
    assert response.status_code == 200
    assert response.data.decode() == "Client updated successfully."
