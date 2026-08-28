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
    checkout_request_id = result.get("CheckoutRequestID")

    if checkout_request_id:
        (
        supabase
        .table("orders")
        .update({
            "payment_status": "pending",
            "checkout_request_id": checkout_request_id
        })
        .eq("id", order_id)
        .execute()
        )


    return jsonify(result), 200

@payments.route("/payments/mpesa/callback", methods=["POST"])
def mpesa_callback():

    data = request.get_json()

    callback = data["Body"]["stkCallback"]

    result_code = callback["ResultCode"]
    checkout_request_id = callback["CheckoutRequestID"]

    if result_code == 0:

        metadata = callback.get("CallbackMetadata", {}).get("Item", [])

        mpesa_receipt = None

        for item in metadata:
            if item.get("Name") == "MpesaReceiptNumber":
                mpesa_receipt = item.get("Value")

        response = (
            supabase
            .table("orders")
            .update({
                "payment_status": "paid",
                "mpesa_receipt_number": mpesa_receipt
            })
            .eq("checkout_request_id", checkout_request_id)
            .execute()
        )

        print("PAYMENT UPDATED:", response.data)

    else:

        (
            supabase
            .table("orders")
            .update({
                "payment_status": "failed"
            })
            .eq("checkout_request_id", checkout_request_id)
            .execute()
        )

    return jsonify({
        "ResultCode": 0,
        "ResultDesc": "Accepted"
    }), 200
