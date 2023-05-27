from dotenv import load_dotenv
from flask import request
from utils import authenticate, check_required_columns_post, check_required_columns_update
from app import app as app
from app import supabase as supabase


def save_split_payments_to_database(splitted_payment):
    required_columns = [
        "split_payment_id",
        "original_amount",
        "interest_rate",
        "due_date",
        "status",
        "payment_method",
        "final_user_id",
        "client_id",
        "total_amount"
    ]
    missing_columns = check_required_columns_post(splitted_payment, required_columns)
    if missing_columns:
        return False

    try:
        result = supabase.table("SplitPayments").insert(splitted_payment).execute()
        print(result)
        if not result:
            False
        return True
    except Exception as e:
        return False


@app.route("/api/split_payments", methods=["POST"])
@authenticate
def create_split_payment():
    """
    Create a new split payment.

    Request body:
    - split_payment_id: Unique identifier for each split payment
    - original_amount: The total original_amount of the split payment
    - interest_rate: The interest rate charged on the split payment
    - due_date: The due date for the split payment
    - status: Current status of the split payment (e.g., pending, paid, overdue)
    - payment_method: The payment method used for the split payment (e.g., Pix)
    - final_user_id: ID of the customer making the split payment
    - client_id: ID of the StarkInfra user managing the split payment
    - created_at: Timestamp indicating when the split payment was created
    - total_amount: The total amount of the split payment after applying interest

    Returns:
    - 201 if the split payment is created successfully
    - 400 if the request body is missing or invalid
    - 500 if there's an error during the split payment creation process
    """
    data = request.get_json()
    if not data:
        return "Request body is missing.", 400

    required_columns = [
        "split_payment_id",
        "original_amount",
        "interest_rate",
        "due_date",
        "status",
        "payment_method",
        "final_user_id",
        "client_id",
        "total_amount"
    ]
    missing_columns = check_required_columns_post(data, required_columns)
    if missing_columns:
        return missing_columns, 400

    try:
        result = supabase.table("SplitPayments").insert(data).execute()
        if not result:
            return "Failed to create split payment.", 500
        return "Split payment created successfully.", 201
    except Exception as e:
        return str(e), 500


@app.route("/api/split_payments/<id>", methods=["GET"])
@authenticate
def get_single_split_payment(id):
    """
    Get information about a single split payment.

    Params:
    - id: The unique identifier of the split payment

    Returns:
    - JSON object containing the split payment's information if found
    - 404 if the split payment is not found
    - 500 if there's an error during the retrieval process
    """
    try:
        result = supabase.table("SplitPayments").select("*").eq("id", id).execute()
        if not result:
            return "Failed to retrieve split payment.", 500
        if len(result.data) == 0:
            return "Split payment not found.", 404
        return result.data[0]
    except Exception as e:
        return str(e), 500


@app.route("/api/split_payments/<id>", methods=["DELETE"])
@authenticate
def delete_single_split_payment(id):
    """
    Delete a single split payment.

    Params:
    - id: The unique identifier of the split payment

    Returns:
    - 200 if the split payment is deleted successfully
    - 404 if the split payment is not found
    - 500 if there's an error during the deletion process
    """
    try:
        result = supabase.table("SplitPayments").delete().eq("id", id).execute()
        if not result:
            return "Failed to delete split payment.", 500
        if result.count == 0:
            return "Split payment not found.", 404
        return "Split payment deleted successfully.", 200
    except Exception as e:
        return str(e), 500


@app.route("/api/split_payments/<id>", methods=["PUT"])
@authenticate
def update_single_split_payment(id):
    """
    Update information of a single split payment.

    Params:
    - id: The unique identifier of the split payment

    Request body:
    - split_payment_id: Unique identifier for each split payment
    - original_amount: The total original_amount of the split payment
    - interest_rate: The interest rate charged on the split payment
    - due_date: The due date for the split payment
    - status: Current status of the split payment (e.g., pending, paid, overdue)
    - payment_method: The payment method used for the split payment (e.g., Pix)
    - final_user_id: ID of the customer making the split payment
    - client_id: ID of the StarkInfra user managing the split payment
    - created_at: Timestamp indicating when the split payment was created
    - total_amount: The total amount of the split payment after applying interest

    Returns:
    - 200 if the split payment is updated successfully
    - 400 if the request body is missing or invalid
    - 404 if the split payment is not found
    - 500 if there's an error during the update process
    """
    data = request.get_json()
    if not data:
        return "Request body is missing.", 400

    required_columns = [
        "split_payment_id",
        "original_amount",
        "interest_rate",
        "due_date",
        "status",
        "payment_method",
        "final_user_id",
        "client_id",
        "total_amount",
    ]
    update_columns = check_required_columns_update(data, required_columns)
    if update_columns:
        return update_columns, 400

    try:
        result = supabase.table("SplitPayments").update(data).eq("id", id).execute()
        if not result:
            return "Failed to update split payment.", 500
        if result.count == 0:
            return "Split payment not found.", 404
        return "Split payment updated successfully.", 200
    except Exception as e:
        return str(e), 500


@app.route("/api/split_payments", methods=["GET"])
@authenticate
def get_all_split_payments():
    """
    Get information about all split payments.

    Returns:
    - JSON object containing the information of all split payments
    - 500 if there's an error during the retrieval process
    """
    try:
        result = supabase.table("SplitPayments").select("*").execute()
        if not result:
            return "Failed to retrieve split payments.", 500
        return result.data
    except Exception as e:
        return str(e), 500


@app.route("/api/split_payments/due_date/<due_date>", methods=["GET"])
@authenticate
def get_split_payments_by_due_date(due_date):
    """
    Get information about split payments with a specific due date.

    Params:
    - due_date: The due date of the split payments

    Returns:
    - JSON object containing the information of split payments with the specified due date
    - 500 if there's an error during the retrieval process
    """
    try:
        result = (
            supabase.table("SplitPayments")
            .select("*")
            .eq("due_date", due_date)
            .execute()
        )
        if not result:
            return "Failed to retrieve split payments by due date.", 500
        return result.data
    except Exception as e:
        return str(e), 500
