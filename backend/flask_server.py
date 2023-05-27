from flask import Flask, request, jsonify
import os
from functools import wraps
from dotenv import load_dotenv
import starkinfra
import numpy as np

load_dotenv()

API_PASSWORD = os.getenv("API_PASSWORD")
app = Flask(__name__)

# Define credit score ranges and corresponding interest rate ranges
CREDIT_SCORE_RANGES = {
    "excellent": {"min": 800, "max": 1000},
    "good": {"min": 700, "max": 799},
    "fair": {"min": 600, "max": 699},
    "poor": {"min": 300, "max": 599},
    "very_poor": {"min": 0, "max": 299},
}

INTEREST_RATE_RANGES = {
    "excellent": {"min": 0.005, "max": 0.010},
    "good": {"min": 0.010, "max": 0.015},
    "fair": {"min": 0.015, "max": 0.020},
    "poor": {"min": 0.020, "max": 0.025},
    "very_poor": {"min": 0.025, "max": 0.030},
}

MINIMUM_AMOUNT = 16

TOTAL_AMOUNT_MAXIMUMS = {
    "excellent": 1600,
    "good": 800,
    "fair": 400,
    "poor": 200,
    "very_poor": 200,
}

N_INSTALLMENTS = {
    "excellent": [2, 3, 6, 9, 12],
    "good": [2, 3, 6, 9],
    "fair": [2, 3, 6],
    "poor": [2, 3],
    "very_poor": [2],
}


# Dummy authentication middleware
def authenticate(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        # Perform authentication logic here
        # For example, check if the request contains a valid access token
        access_token = request.headers.get("Authorization")
        if not access_token:
            return jsonify({"error": "Unauthorized access."}), 401
        if access_token != API_PASSWORD:
            return jsonify({"error": "Invalid access token."}), 401
        # Here, you can validate the access token against your authentication system

        # For simplicity, we assume authentication is successful and set the user in the 'g' context object
        # g.user = {'id': 123, 'email': 'user@example.com'}
        return func(*args, **kwargs)

    return decorated


def get_credit_score(final_user_id, final_user_document):
    # Get the credit score from the database
    # For simplicity, we return a fixed value
    score = np.random.randint(300, 1000)
    return score

@app.route("/api/pix-creation-callback", methods=["POST"])
def pix_creation_callback():
    data = request.get_json()
    print(data)
    return jsonify({"message": "Callback received.", "data": data}), 200


@app.route("/api/pix-reversion-callback", methods=["POST"])
def pix_reversion_callback():
    data = request.get_json()
    print(data)
    return jsonify({"message": "Callback received.", "data": data}), 200

@app.route("/api/get-payment-options", methods=["POST"])
@authenticate
def get_payment_options():
    data = request.get_json()
    final_user_id = data.get("final_user_id")
    total_amount = data.get("total_amount")
    final_user_document = data.get("final_user_document")
    credit_score = get_credit_score(final_user_id, final_user_document)

    # Determine the credit score tier
    tier = None
    for key, value in CREDIT_SCORE_RANGES.items():
        if value["min"] <= credit_score <= value["max"]:
            tier = key
            break

    if tier is None:
        return jsonify({"error": "Invalid credit score."}), 400
    maximum_amount = TOTAL_AMOUNT_MAXIMUMS[tier]
    if total_amount > maximum_amount or total_amount < MINIMUM_AMOUNT:
        return (
            jsonify(
                {
                    "eligible_options": [
                        {
                            "installments": 1,
                            "interest_rate": 0,
                            "monthly_payment": total_amount,
                            "total_amount": total_amount,
                            "total_payment": total_amount,
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
    eligible_options = [
        {
            "installments": 1,
            "interest_rate": 0,
            "monthly_payment": total_amount,
            "total_amount": total_amount,
            "total_payment": total_amount,
        }
    ]
    possible_ninstallments = N_INSTALLMENTS[tier]

    for n_installments in possible_ninstallments:
        monthly_payment_without_interest = total_amount / n_installments
        total_payment = 0
        for months in range(n_installments):
            total_payment += monthly_payment_without_interest * (
                (1 + base_interest_rate) ** months
            )
        monthly_payment = total_payment / n_installments
        interest_rate = (total_payment / total_amount) ** (1 / n_installments) - 1
        eligible_options.append(
            {
                "installments": n_installments,
                "interest_rate": interest_rate,
                "monthly_payment": monthly_payment,
                "total_amount": total_amount,
                "total_payment": total_payment,
            }
        )

    return jsonify({"eligible_options": eligible_options}), 200


@app.route("/api/payments", methods=["POST"])
@authenticate
def process_payment():
    data = request.get_json()
    credit_score = data.get("credit_score")
    payer = data.get("payer")
    split_payment = data.get("split_payment")

    if credit_score is None:
        return jsonify({"error": "Credit score is missing."}), 400

    # Determine the credit score tier
    tier = None
    for key, value in CREDIT_SCORE_RANGES.items():
        if value["min"] <= credit_score <= value["max"]:
            tier = key
            break

    if tier is None:
        return jsonify({"error": "Invalid credit score."}), 400

    # Calculate the interest rate within the tier's range
    interest_rate = INTEREST_RATE_RANGES[tier]["min"] + (
        credit_score - CREDIT_SCORE_RANGES[tier]["min"]
    ) / (CREDIT_SCORE_RANGES[tier]["max"] - CREDIT_SCORE_RANGES[tier]["min"]) * (
        INTEREST_RATE_RANGES[tier]["max"] - INTEREST_RATE_RANGES[tier]["min"]
    )

    # Perform split payment calculations
    if split_payment and split_payment.get("enabled"):
        splits = split_payment.get("splits", [])
        total_split_amount = sum(split["amount"] for split in splits)

        # Ensure the total split amount matches the original payment amount
        if total_split_amount != data["amount"]:
            return jsonify({"error": "Invalid split payment amount."}), 400

        # Apply fees and distribute amounts to recipients
        for split in splits:
            amount = split["amount"]
            fee = split["fee"]
            recipient = split["recipient"]

            # Apply fee calculation logic here

            # Perform payment transfer to the recipient

    # Process the payment and return the response
    # Your payment processing logic goes here

    return jsonify({"message": "Payment processed successfully."}), 200


if __name__ == "__main__":
    app.run()
