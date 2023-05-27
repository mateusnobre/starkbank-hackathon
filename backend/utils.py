# Dummy authentication middleware
from functools import wraps
from dotenv import load_dotenv
import os
from flask import request, jsonify
import numpy as np

load_dotenv()
API_PASSWORD = os.getenv("API_PASSWORD")


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


def check_required_columns_post(data, required_columns):
    missing_columns = [col for col in required_columns if col not in data]
    if missing_columns:
        return f"Missing required columns: {', '.join(missing_columns)}"
    return None

def check_required_columns_update(data, required_columns):
    update_columns = [col for col in required_columns if col in data]
    if len(update_columns) == 0:
        return f"At least 1 column is required for update"
    return None



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


def get_credit_score(final_user_id, final_user_document):
    # Get the credit score from the database
    # For simplicity, we return a fixed value
    score = np.random.randint(300, 1000)
    return score
