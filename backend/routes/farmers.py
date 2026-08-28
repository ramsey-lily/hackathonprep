from flask import Blueprint, request, jsonify
from config.supabase import supabase

farmers_bp = Blueprint("farmers", __name__)


# Create a farmer
@farmers_bp.route("/farmers", methods=["POST"])
def create_farmer():
    data = request.get_json()

    name = data.get("name")
    phone = data.get("phone")
    location = data.get("location")

    if not name or not phone or not location:
        return jsonify({
            "error": "Name, phone and location are required"
        }), 400

    response = (
        supabase
        .table("farmers")
        .insert({
            "name": name,
            "phone": phone,
            "location": location
        })
        .execute()
    )

    return jsonify({
        "message": "Farmer created successfully",
        "farmer": response.data[0]
    }), 201


# Get all farmers
@farmers_bp.route("/farmers", methods=["GET"])
def get_farmers():
    response = (
        supabase
        .table("farmers")
        .select("*")
        .execute()
    )

    return jsonify(response.data), 200


# Get offers submitted by a specific farmer
@farmers_bp.route("/farmers/<int:farmer_id>/offers", methods=["GET"])
def get_farmer_offers(farmer_id):

    response = (
        supabase
        .table("offers")
        .select("""
            id,
            request_id,
            farmer_id,
            quantity,
            price,
            status,
            food_requests (
                id,
                food_item,
                unit,
                delivery_date,
                budget
            )
        """)
        .eq("farmer_id", farmer_id)
        .execute()
    )

    offers_data = []

    for item in response.data:

        food_request = item.pop("food_requests", None)

        quantity = float(item["quantity"])
        price = float(item["price"])

        offers_data.append({
            "id": item["id"],
            "request_id": item["request_id"],
            "farmer_id": item["farmer_id"],
            "quantity": quantity,
            "price": price,
            "total_amount": quantity * price,
            "status": item["status"],
            "food_request": food_request
        })

    return jsonify(offers_data), 200
