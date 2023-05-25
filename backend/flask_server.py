from flask import Flask, request, jsonify
import os
from functools import wraps
from dotenv import load_dotenv
import starkinfra

load_dotenv()

API_PASSWORD = os.getenv("API_PASSWORD")
app = Flask(__name__)

# Define credit score ranges and corresponding interest rate ranges
credit_score_ranges = {
    "excellent": {"min": 800, "max": 1000},
    "good": {"min": 700, "max": 799},
    "fair": {"min": 600, "max": 699},
    "poor": {"min": 300, "max": 599},
    "very_poor": {"min": 0, "max": 299},
}

interest_rate_ranges = {
    "excellent": {"min": 0.05, "max": 0.10},
    "good": {"min": 0.10, "max": 0.15},
    "fair": {"min": 0.15, "max": 0.20},
    "poor": {"min": 0.20, "max": 0.25},
    "very_poor": {"min": 0.25, "max": 0.30},
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
    for key, value in credit_score_ranges.items():
        if value["min"] <= credit_score <= value["max"]:
            tier = key
            break

    if tier is None:
        return jsonify({"error": "Invalid credit score."}), 400

    # Calculate the interest rate within the tier's range
    interest_rate = interest_rate_ranges[tier]["min"] + (
        credit_score - credit_score_ranges[tier]["min"]
    ) / (credit_score_ranges[tier]["max"] - credit_score_ranges[tier]["min"]) * (
        interest_rate_ranges[tier]["max"] - interest_rate_ranges[tier]["min"]
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
