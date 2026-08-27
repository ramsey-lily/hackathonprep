from flask import Blueprint, request, jsonify

from config.supabase import supabase

# Import your M-Pesa functions
from services.mpesa import (
    initiate_stk_push,
    handle_mpesa_callback
)

payments = Blueprint("payments", __name__)


@payments.route("/payments/mpesa", methods=["POST"])
def mpesa_payment():

    data = request.get_json()

    phone = data.get("phone")
    order_id = data.get("order_id")

    if not phone or not order_id:
        return jsonify({
            "error": "Phone and order_id are required"
        }), 400

    # Get order from Supabase
    response = (
        supabase
        .table("orders")
        .select("*")
        .eq("id", order_id)
        .execute()
    )

    if not response.data:
        return jsonify({
            "error": "Order not found"
        }), 404

    order = response.data[0]
    amount = order["total_amount"]

    result = initiate_stk_push(
        phone,
        amount,
        order_id
    )

    return jsonify(result), 200


@payments.route("/payments/mpesa/callback", methods=["POST"])
def mpesa_callback():

    data = request.get_json()

    result = handle_mpesa_callback(data)

    return jsonify({
        "ResultCode": 0,
        "ResultDesc": "Accepted"
    }), 200
