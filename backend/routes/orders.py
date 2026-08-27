from flask import Blueprint, request, jsonify
from config.supabase import supabase

orders_bp = Blueprint("orders", __name__)


# Get a single order
@orders_bp.route("/orders/<int:order_id>", methods=["GET"])
def get_order(order_id):

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

    return jsonify(response.data[0]), 200


# Get school orders
@orders_bp.route("/schools/<int:school_id>/orders", methods=["GET"])
def get_school_orders(school_id):

    response = (
        supabase
        .table("orders")
        .select("*")
        .eq("school_id", school_id)
        .execute()
    )

    return jsonify(response.data), 200


# Get farmer orders
@orders_bp.route("/farmers/<int:farmer_id>/orders", methods=["GET"])
def get_farmer_orders(farmer_id):

    response = (
        supabase
        .table("orders")
        .select("*")
        .eq("farmer_id", farmer_id)
        .execute()
    )

    return jsonify(response.data), 200


# Update order status
@orders_bp.route("/orders/<int:order_id>/status", methods=["PATCH"])
def update_order_status(order_id):

    data = request.get_json()

    status = data.get("status")

    allowed_statuses = [
        "confirmed",
        "in_delivery",
        "delivered",
        "completed"
    ]

    if status not in allowed_statuses:
        return jsonify({
            "error": "Invalid order status"
        }), 400

    response = (
        supabase
        .table("orders")
        .update({
            "status": status
        })
        .eq("id", order_id)
        .execute()
    )

    if not response.data:
        return jsonify({
            "error": "Order not found"
        }), 404

    return jsonify({
        "message": "Order status updated successfully",
        "order": response.data[0]
    }), 200