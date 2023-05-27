from flask import request
from utils import authenticate, check_required_columns_post, check_required_columns_update
from app import app as app
from app import supabase as supabase
from faker import Faker

@app.route("/api/payment_transactions", methods=["POST"])
@authenticate
def create_payment_transaction():
    """
    Create a new payment transaction.

    Request body:
    - transaction_id: Unique identifier for each payment transaction
    - split_payment_id: ID of the split payment associated with the transaction
    - amount: The amount of the payment transaction
    - status: Current status of the payment transaction (e.g., processing, completed, failed)
    - transaction_date: Timestamp indicating when the transaction took place
    - payment_method: The payment method used for the transaction (e.g., Pix)
    - client_id: ID of the StarkInfra user initiating the transaction
    - final_user_id: ID of the customer involved in the transaction
    - type: specifies if it's a down_payment or one of the split portions
    - due_date: due date for the transaction to be effective
    - qr_code_copy: Code for making transactions "Pix Copia e Cola"
    - qt_code_img_link: link for QR Code image generated
    - stark_uuid: uuid for the transaction

    Returns:
    - 201 if the payment transaction is created successfully
    - 400 if the request body is missing or invalid
    - 500 if there's an error during the payment transaction creation process
    """
    data = request.get_json()
    if not data:
        return "Request body is missing.", 400
    data["transaction_id"] = Faker().uuid4()

    required_columns = [
        "split_payment_id",
        "amount",
        "status",
        "transaction_date",
        "payment_method",
        "client_id",
        "final_user_id",
        "type",
        "due_date",
        "qr_code_copy",
        "qt_code_img_link",
        "stark_uuid",
    ]
    missing_columns = check_required_columns_post(data, required_columns)
    if missing_columns:
        return missing_columns, 400

    try:
        result = supabase.table("PaymentTransactions").insert(data).execute()
        if not result:
            return "Failed to create payment transaction.", 500
        return {"transaction_id": data["transaction_id"]}, 201

    except Exception as e:
        return str(e), 500


@app.route("/api/payment_transactions/<transaction_id>", methods=["GET"])
@authenticate
def get_single_payment_transaction(transaction_id):
    """
    Get information about a single payment transaction.

    Params:
    - transaction_id: The unique identifier of the payment transaction

    Returns:
    - JSON object containing the payment transaction information if found
    - 404 if the payment transaction is not found
    - 500 if there's an error during the retrieval process
    """
    try:
        result = (
            supabase.table("PaymentTransactions")
            .select("*")
            .eq("transaction_id", transaction_id)
            .execute()
        )
        if not result:
            return "Failed to retrieve payment transaction.", 500
        if len(result.data) == 0:
            return "Payment transaction not found.", 404
        return result.data[0]
    except Exception as e:
        return str(e), 500


@app.route("/api/payment_transactions/<transaction_id>", methods=["DELETE"])
@authenticate
def delete_single_payment_transaction(transaction_id):
    """
    Delete a single payment transaction.

    Params:
    - transaction_id: The unique identifier of the payment transaction

    Returns:
    - 200 if the payment transaction is deleted successfully
    - 404 if the payment transaction is not found
    - 500 if there's an error during the deletion process
    """
    try:
        result = (
            supabase.table("PaymentTransactions")
            .delete()
            .eq("transaction_id", transaction_id)
            .execute()
        )
        if not result:
            return "Failed to delete payment transaction.", 500
        if result.count == 0:
            return "Payment transaction not found.", 404
        return "Payment transaction deleted successfully.", 200
    except Exception as e:
        return str(e), 500


@app.route("/api/payment_transactions/<transaction_id>", methods=["PUT"])
@authenticate
def update_single_payment_transaction(transaction_id):
    """
    Update information of a single payment transaction.

    Params:
    - transaction_id: The unique identifier of the payment transaction

    Request body:
    - split_payment_id: ID of the split payment associated with the transaction
    - amount: The amount of the payment transaction
    - status: Current status of the payment transaction (e.g., processing, completed, failed)
    - transaction_date: Timestamp indicating when the transaction took place
    - payment_method: The payment method used for the transaction (e.g., Pix)
    - client_id: ID of the StarkInfra user initiating the transaction
    - final_user_id: ID of the customer involved in the transaction
    - type: specifies if it's a down_payment or one of the split portions
    - due_date: due date for the transaction to be effective
    - qr_code_copy: Code for making transactions "Pix Copia e Cola"
    - qt_code_img_link: link for QR Code image generated
    - stark_uuid: uuid for the transaction

    Returns:
    - 200 if the payment transaction is updated successfully
    - 400 if the request body is missing or invalid
    - 404 if the payment transaction is not found
    - 500 if there's an error during the update process
    """
    data = request.get_json()
    if not data:
        return "Request body is missing.", 400

    possible_columns = [
        "split_payment_id",
        "amount",
        "status",
        "transaction_date",
        "payment_method",
        "client_id",
        "final_user_id",
        "type",
        "due_date",
        "qr_code_copy",
        "qt_code_img_link",
        "stark_uuid",
    ]
    update_columns = check_required_columns_update(data, possible_columns)
    if update_columns:
        return update_columns, 400

    try:
        result = (
            supabase.table("PaymentTransactions")
            .update(data)
            .eq("transaction_id", transaction_id)
            .execute()
        )
        if not result:
            return "Failed to update payment transaction.", 500
        if result.count == 0:
            return "Payment transaction not found.", 404
        return "Payment transaction updated successfully.", 200
    except Exception as e:
        return str(e), 500
