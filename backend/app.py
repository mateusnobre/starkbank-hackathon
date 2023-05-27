from dotenv import load_dotenv
from flask import Flask, request, jsonify
from utils import CREDIT_SCORE_RANGES, INTEREST_RATE_RANGES, MINIMUM_AMOUNT, N_INSTALLMENTS, TOTAL_AMOUNT_MAXIMUMS, authenticate, get_credit_score

app = Flask(__name__)

import os
from supabase import create_client
load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


import api_split_payments
import api_clients
import api_final_users
import api_payment_transactions

@app.route("/api/get-payment-options", methods=["GET"])
@authenticate
def get_payment_options():
    data = request.get_json()
    final_user_id = data.get("final_user_id")
    purchase_amount = data.get("purchase_amount")
    down_payment = data.get("down_payment")
    financed_amount = purchase_amount - down_payment
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
    maximum_financed_amount = TOTAL_AMOUNT_MAXIMUMS[tier]
    if financed_amount > maximum_financed_amount or financed_amount < MINIMUM_AMOUNT:
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

    for n_installments in possible_ninstallments:
        monthly_payment_without_interest = financed_amount / n_installments
        total_payment = 0
        for months in range(n_installments):
            total_financed_payment += monthly_payment_without_interest * (
                (1 + base_interest_rate) ** months
            )
        monthly_payment = round(total_financed_payment / n_installments,2)
        total_financed_payment = monthly_payment * n_installments
        interest_rate = (total_financed_payment / financed_amount) ** (1 / n_installments) - 1
        eligible_options.append(
            {
                "number_splits": n_installments,
                "interest_rate": interest_rate,
                "monthly_payment": monthly_payment,
                "purchase_amount": purchase_amount,
                "total_amount": total_financed_payment+down_payment
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
