from flask import request
from utils import authenticate, check_required_columns
from app import app as app
from app import supabase as supabase

@app.route("/api/final_users", methods=["POST"])
@authenticate
def create_final_user():
    """
    Create a new final user.

    Request body:
    - client_id: Unique identifier for each StarkInfra user
    - name: Name of the user
    - email: Email address of the user
    - password: User password
    - role: Role or position of the user within StarkInfra (e.g., admin, customer support)
    - created_at: Timestamp indicating when the user account was created

    Returns:
    - 201 if the user is created successfully
    - 400 if the request body is missing or invalid
    - 500 if there's an error during the user creation process
    """
    data = request.get_json()
    if not data:
        return "Request body is missing.", 400

    required_columns = ["client_id", "name", "email", "password", "role"]
    missing_columns = check_required_columns(data, required_columns)
    if missing_columns:
        return missing_columns, 400

    try:
        result = supabase.table("FinalUsers").insert(data).execute()
        if result.error:
            return "Failed to create final user.", 500
        return "Final user created successfully.", 201
    except Exception as e:
        return str(e), 500

@app.route("/api/final_users/<id>", methods=["GET"])
@authenticate
def get_single_final_user(id):
    """
    Get information about a single final user.

    Params:
    - id: The unique identifier of the final user

    Returns:
    - JSON object containing the user's information if found
    - 404 if the user is not found
    - 500 if there's an error during the retrieval process
    """
    try:
        result = supabase.table("FinalUsers").select("*").eq("id", id).execute()
        if result.error:
            return "Failed to retrieve final user.", 500
        if len(result.data) == 0:
            return "Final user not found.", 404
        return result.data[0]
    except Exception as e:
        return str(e), 500

@app.route("/api/final_users/<id>", methods=["DELETE"])
@authenticate
def delete_single_final_user(id):
    """
    Delete a single final user.

    Params:
    - id: The unique identifier of the final user

    Returns:
    - 200 if the user is deleted successfully
    - 404 if the user is not found
    - 500 if there's an error during the deletion process
    """
    try:
        result = supabase.table("FinalUsers").delete().eq("id", id).execute()
        if result.error:
            return "Failed to delete final user.", 500
        if result.count == 0:
            return "Final user not found.", 404
        return "Final user deleted successfully.", 200
    except Exception as e:
        return str(e), 500
