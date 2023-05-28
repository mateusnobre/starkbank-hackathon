from dotenv import load_dotenv
from flask import Flask, request, jsonify
from utils import (
    CREDIT_SCORE_RANGES,
    INTEREST_RATE_RANGES,
    MINIMUM_AMOUNT,
    N_INSTALLMENTS,
    TOTAL_AMOUNT_MAXIMUMS,
    authenticate,
    get_credit_score,
)
import starkbank
import uuid
from datetime import datetime
from dateutil.relativedelta import relativedelta
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow CORS for all routes

import os
from supabase import create_client

load_dotenv()


SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
PRIVATE_KEY = os.environ.get("PRIVATE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


user = starkbank.Project(
    environment="sandbox", id="6142453941796864", private_key=PRIVATE_KEY
)
starkbank.user = user

import api_split_payments
import api_clients
import api_final_users
import api_payment_transactions


@app.route("/api/get-payment-options", methods=["GET", "POST"])
@authenticate
def get_payment_options():
    """
    API endpoint to retrieve eligible payment options based on the provided data.

    Method: GET, POST

    Parameters:
        - final_user_id (str): ID of the final user.
        - purchase_amount (float): Amount of the purchase.
        - down_payment (float): Amount of the down payment.
        - final_user_document (str): Document of the final user.

    Returns:
        - JSON response containing the eligible payment options:
            {
                "eligible_options": [
                    {
                        "number_splits": (int) Number of splits,
                        "interest_rate": (float) Interest rate,
                        "monthly_payment": (float) Monthly payment amount,
                        "purchase_amount": (float) Purchase amount,
                        "total_amount": (float) Total amount including interest,
                    }
                ]
            }

        - In case of error, returns JSON response:
            {
                "error": (str) Error message
            }
            with status code 400 for invalid credit score.

    """

    # Retrieve data from the request
    data = request.get_json()
    final_user_id = data.get("final_user_id")
    purchase_amount = data.get("purchase_amount")
    down_payment = data.get("down_payment")
    financed_amount = purchase_amount - down_payment
    final_user_document = data.get("final_user_document")

    # Get credit score for the final user
    credit_score = get_credit_score(final_user_id, final_user_document)

    # Determine the credit score tier
    tier = None
    for key, value in CREDIT_SCORE_RANGES.items():
        if value["min"] <= credit_score <= value["max"]:
            tier = key
            break

    if tier is None:
        return jsonify({"error": "Invalid credit score."}), 400

    maximum_financed_amount = TOTAL_AMOUNT_MAXIMUMS[tier]
    if financed_amount > maximum_financed_amount or financed_amount < MINIMUM_AMOUNT:
        # Return default option for invalid financing
        return (
            jsonify(
                {
                    "eligible_options": [
                        {
                            "number_splits": 1,
                            "interest_rate": 0,
                            "monthly_payment": purchase_amount,
                            "purchase_amount": purchase_amount,
                            "total_amount": purchase_amount,
                        }
                    ]
                }
            ),
            200,
        )

    # Calculate the interest rate within the tier's range
    base_interest_rate = INTEREST_RATE_RANGES[tier]["min"] + (
        credit_score - CREDIT_SCORE_RANGES[tier]["min"]
    ) / (CREDIT_SCORE_RANGES[tier]["max"] - CREDIT_SCORE_RANGES[tier]["min"]) * (
        INTEREST_RATE_RANGES[tier]["max"] - INTEREST_RATE_RANGES[tier]["min"]
    )

    # Prepare the list of eligible options
    eligible_options = [
        {
            "number_splits": 1,
            "interest_rate": 0,
            "monthly_payment": purchase_amount,
            "purchase_amount": purchase_amount,
            "total_amount": purchase_amount,
        }
    ]
    possible_ninstallments = N_INSTALLMENTS[tier]

    # Calculate eligible options for different number of installments
    for n_installments in possible_ninstallments:
        monthly_payment_without_interest = financed_amount / n_installments
        total_financed_payment = 0
        for months in range(n_installments):
            total_financed_payment += monthly_payment_without_interest * (
                (1 + base_interest_rate) ** months
            )
        monthly_payment = round(total_financed_payment / n_installments, 2)
        total_financed_payment = monthly_payment * n_installments
        interest_rate = (total_financed_payment / financed_amount) ** (
            1 / n_installments
        ) - 1
        eligible_options.append(
            {
                "number_splits": n_installments,
                "interest_rate": interest_rate,
                "monthly_payment": monthly_payment,
                "purchase_amount": purchase_amount,
                "total_amount": total_financed_payment + down_payment,
            }
        )

    # Return the eligible options
    return jsonify({"eligible_options": eligible_options}), 200


@app.route("/api/create-payment", methods=["POST"])
@authenticate
def create_payment():
    """
    API endpoint to create a payment and generate payment details.

    Method: POST

    Parameters:
        - final_user_id (str): ID of the final user.
        - purchase_amount (float): Amount of the purchase.
        - number_splits (int): Number of splits for the payment.
        - down_payment (float, optional): Amount of the down payment.
        - interest_rate (float, optional): Interest rate for the payment.
        - monthly_payment (float, optional): Monthly payment amount.

    Returns:
        - JSON response containing the payment details:
            {
                "message": "Payment created successfully",
                "qr_code_copy": (str) QR code copy for down payment,
                "qr_code_img_link": (str) QR code image link for down payment,
                "due_dates": [(str) Due dates for split payments],
                "monthly_payment": (float) Monthly payment amount,
            }

        - In case of error, returns JSON response:
            {
                "error": (str) Error message
            }
            with status code 400 for missing fields or invalid values,
            or status code 500 for an error during payment creation.
    """

    try:
        data = request.get_json()
        final_user_id = data.get("final_user_id")
        purchase_amount = data.get("purchase_amount")
        number_splits = data.get("number_splits")
        down_payment = data.get("down_payment")
        interest_rate = data.get("interest_rate")
        monthly_payment = data.get("monthly_payment")

        # Check if required fields are missing
        if final_user_id is None or purchase_amount is None or number_splits is None:
            return jsonify({"error": "Missing required fields."}), 400

        # Check if both interest rate and monthly payment are provided
        if interest_rate is not None and monthly_payment is not None:
            return jsonify({"error": "You must choose only one method"}), 400

        # Check if number_splits is a non-negative integer
        if not isinstance(number_splits, int) or number_splits < 0:
            return jsonify({"error": "Invalid number of splits."}), 400

        # Calculate future payment amount based on purchase amount and down payment
        future_payment = purchase_amount
        if down_payment is not None:
            future_payment -= down_payment
        else:
            down_payment = 0

        # Calculate monthly payment if interest rate is provided
        if interest_rate is not None:
            monthly_payment = (future_payment / number_splits) * (
                1 + interest_rate
            ) ** number_splits

        # Calculate future payment based on monthly payment and number of splits
        future_payment = monthly_payment * number_splits

        # Calculate interest rate if not provided
        if interest_rate is None:
            interest_rate = ((future_payment + down_payment) / purchase_amount) ** (
                1 / number_splits
            ) - 1

        # Check if future payment amount is valid
        if not isinstance(future_payment, (int, float)) or future_payment < 0:
            return jsonify({"error": "Invalid future payment."}), 400

        # Check if monthly payment matches the calculated future payment
        if (
            monthly_payment is not None
            and monthly_payment * number_splits != future_payment
        ):
            return jsonify({"error": "Invalid monthly payment."}), 400

        # Generate due dates for the split payments
        due_dates = [
            datetime.now() + relativedelta(months=i)
            for i in range(1, number_splits + 1)
        ]
        due_dates_str = [date.strftime("%Y-%m-%d") for date in due_dates]
        due_dates_timestamp = [int(datetime.timestamp(date)) for date in due_dates]

        # Prepare dynamic BR codes for each payment
        dynamics_brcodes = []
        if down_payment > 0:
            dynamics_brcodes.append(
                starkbank.DynamicBrcode(amount=down_payment, tags=["down_payment"])
            )
        for i in range(number_splits):
            dynamics_brcodes.append(
                starkbank.DynamicBrcode(
                    amount=monthly_payment,
                    expiration=due_dates_timestamp[i],
                    tags=["split_payment"],
                )
            )

        # Prepare payment details for split payment
        splited_payment = {
            "final_user_id": final_user_id,
            "original_amount": purchase_amount,
            "interest_rate": interest_rate,
            "status": "pending",
            "payment_method": "pix_brcode",
            "client_id": "dc8a9c41-1bbd-48c9-b57d-24438e940d1a",
            "total_amount": future_payment + down_payment,
        }

        # Save split payment details to the database
        split_id = api_split_payments.save_split_payments_to_database(splited_payment)
        if type(split_id) == bool and not split_id:
            return jsonify({"error": "Error creating payment."}), 500

        # Create dynamic BR codes for the payments
        brcodes = starkbank.dynamicbrcode.create(dynamics_brcodes)
        if brcodes is None or len(brcodes) < 1:
            return jsonify({"error": "Error creating payment."}), 500

        transaction_down_id = None
        start_split = 0

        # Process down payment transaction if down payment amount is greater than 0
        if down_payment > 0:
            transaction_down = {
                "split_payment_id": split_id,
                "amount": brcodes[0].amount,
                "status": "pending",
                "transaction_date": None,
                "payment_method": "pix_brcode",
                "client_id": "dc8a9c41-1bbd-48c9-b57d-24438e940d1a",
                "final_user_id": final_user_id,
                "type": "down_payment",
                "due_date": None,
                "qr_code_copy": brcodes[0].id,
                "qr_code_img_link": brcodes[0].picture_url,
                "stark_uuid": brcodes[0].uuid,
            }
            transaction_down_id = (
                api_payment_transactions.save_payment_transaction_to_database(
                    transaction_down
                )
            )

            if type(transaction_down_id) == bool and not transaction_down_id:
                return jsonify({"error": "Error creating payment."}), 500

            start_split = 1

        # Process split payment transactions
        for i in range(start_split, len(brcodes)):
            transaction = {
                "split_payment_id": split_id,
                "amount": brcodes[i].amount,
                "status": "pending",
                "transaction_date": None,
                "payment_method": "pix_brcode",
                "client_id": "dc8a9c41-1bbd-48c9-b57d-24438e940d1a",
                "final_user_id": final_user_id,
                "type": "split_payment",
                "due_date": due_dates_str[i - 1 if down_payment > 0 else i],
                "qr_code_copy": brcodes[i].id,
                "qr_code_img_link": brcodes[i].picture_url,
                "stark_uuid": brcodes[i].uuid,
            }

            transaction_id = (
                api_payment_transactions.save_payment_transaction_to_database(
                    transaction
                )
            )
            if type(transaction_id) == bool and not transaction_id:
                return jsonify({"error": "Error creating payment."}), 500

        # Prepare response JSON for successful payment creation
        if down_payment > 0:
            qr_code_copy = brcodes[0].id
            qr_code_img_link = brcodes[0].picture_url

            return (
                jsonify(
                    {
                        "message": "Payment created successfully",
                        "qr_code_copy": qr_code_copy,
                        "qr_code_img_link": qr_code_img_link,
                        "due_dates": due_dates_str[1:]
                        if len(due_dates_str) > 1
                        else [],
                        "monthly_payment": monthly_payment,
                    }
                ),
                200,
            )

        return (
            jsonify(
                {
                    "message": "Payment created successfully",
                    "due_dates": due_dates_str[1:] if len(due_dates_str) > 1 else [],
                    "monthly_payment": monthly_payment,
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"error": "Error creating payment."}), 500


if __name__ == "__main__":
    app.run()
