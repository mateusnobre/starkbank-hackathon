from flask import request
from utils import (
    authenticate,
    check_required_columns_post,
    check_required_columns_update,
)
from app import app as app
from app import supabase as supabase
from faker import Faker


@app.route("/api/clients", methods=["POST"])
@authenticate
def create_client():
    """
    Create a new client.

    Request body:
    - name: Name of the user
    - email: Email address of the user
    - role: Role or position of the user within StarkInfra (e.g., admin, customer support)
    - created_at: Timestamp indicating when the user account was created
    - password: password used for login

    Returns:
    - 201 if the client is created successfully
    - 400 if the request body is missing or invalid
    - 500 if there's an error during the client creation process
    """
    data = request.get_json()
    if not data:
        return "Request body is missing.", 400

    required_columns = ["name", "email", "role"]
    data["client_id"] = Faker().uuid4()

    missing_columns = check_required_columns_post(data, required_columns)
    if missing_columns:
        return missing_columns, 400

    try:
        result = supabase.table("Clients").insert(data).execute()
        if not result:
            return "Failed to create client.", 500
        return {"client_id": data["client_id"]}, 201
    except Exception as e:
        return str(e), 500


@app.route("/api/clients/<id>", methods=["GET"])
@authenticate
def get_single_client(id):
    """
    Get information about a single client.

    Params:
    - id: The unique identifier of the client

    Returns:
    - JSON object containing the client's information if found
    - 404 if the client is not found
    - 500 if there's an error during the retrieval process
    """
    try:
        result = supabase.table("Clients").select("*").eq("client_id", id).execute()
        if not result:
            return "Failed to retrieve client.", 500
        if len(result.data) == 0:
            return "Client not found.", 404
        return result.data[0]
    except Exception as e:
        return str(e), 500


@app.route("/api/clients/<id>", methods=["DELETE"])
@authenticate
def delete_single_client(id):
    """
    Delete a single client.

    Params:
    - id: The unique identifier of the client

    Returns:
    - 200 if the client is deleted successfully
    - 404 if the client is not found
    - 500 if there's an error during the deletion process
    """
    try:
        result = supabase.table("Clients").delete().eq("client_id", id).execute()
        if not result:
            return "Failed to delete client.", 500
        if result.count == 0:
            return "Client not found.", 404
        return "Client deleted successfully.", 200
    except Exception as e:
        return str(e), 500


@app.route("/api/clients/<id>", methods=["PUT"])
@authenticate
def update_single_client(id):
    """
    Update information of a single client.

    Params:
    - id: The unique identifier of the client

    Request body:
    - client_id: Unique identifier for each StarkInfra user
    - name: Name of the user
    - email: Email address of the user
    - role: Role or position of the user within StarkInfra (e.g., admin, customer support)
    - created_at: Timestamp indicating when the user account was created
    - password: password used for login

    Returns:
    - 200 if the client is updated successfully
    - 400 if the request body is missing or invalid
    - 404 if the client is not found
    - 500 if there's an error during the update process
    """
    data = request.get_json()
    if not data:
        return "Request body is missing.", 400

    possible_columns = ["client_id", "name", "email", "role"]
    update_columns = check_required_columns_update(data, possible_columns)
    if update_columns:
        return update_columns, 400

    try:
        result = supabase.table("Clients").update(data).eq("client_id", id).execute()
        if not result:
            return "Failed to update client.", 500
        if result.count == 0:
            return "Client not found.", 404
        return "Client updated successfully.", 200
    except Exception as e:
        return str(e), 500
