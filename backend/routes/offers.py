from flask import Blueprint, request, jsonify
from config.supabase import supabase

offers_bp = Blueprint("offers", __name__)


# Submit an offer for a food request
@offers_bp.route("/requests/<int:request_id>/offers", methods=["POST"])
def create_offer(request_id):
    data = request.get_json()

    required_fields = [
        "farmer_id",
        "quantity",
        "price"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "error": f"{field} is required"
            }), 400

    # Check that the request exists
    request_response = (
        supabase
        .table("food_requests")
        .select("*")
        .eq("id", request_id)
        .execute()
    )

    if not request_response.data:
        return jsonify({
            "error": "Food request not found"
        }), 404

    food_request = request_response.data[0]

    # Make sure the request is still open
    if food_request["status"] != "open":
        return jsonify({
            "error": "This food request is no longer open"
        }), 400

    # Create offer
    response = (
        supabase
        .table("offers")
        .insert({
            "request_id": request_id,
            "farmer_id": data["farmer_id"],
            "quantity": data["quantity"],
            "price": data["price"],
            "status": "pending"
        })
        .execute()
    )

    return jsonify({
        "message": "Offer submitted successfully",
        "offer": response.data[0]
    }), 201


# View all offers for a food request
@offers_bp.route("/requests/<int:request_id>/offers", methods=["GET"])
def get_request_offers(request_id):

    response = (
        supabase
        .table("offers")
        .select("""
            id,
            quantity,
            price,
            status,
            farmers (
                id,
                name,
                phone,
                location
            )
        """)
        .eq("request_id", request_id)
        .execute()
    )

    offers_data = []

    for item in response.data:

        farmer = item.pop("farmers", None)

        quantity = float(item["quantity"])
        price = float(item["price"])

        offers_data.append({
            "id": item["id"],
            "farmer": {
                "id": farmer["id"],
                "name": farmer["name"],
                "phone": farmer["phone"],
                "location": farmer["location"]
            } if farmer else None,
            "quantity": quantity,
            "price": price,
            "total_amount": quantity * price,
            "status": item["status"]
        })

    return jsonify(offers_data), 200

# Select a farmer's offer
@offers_bp.route("/offers/<int:offer_id>/select", methods=["PATCH"])
def select_offer(offer_id):

    # Get the offer
    offer_response = (
        supabase
        .table("offers")
        .select("*")
        .eq("id", offer_id)
        .execute()
    )

    if not offer_response.data:
        return jsonify({
            "error": "Offer not found"
        }), 404

    offer = offer_response.data[0]

    request_id = offer["request_id"]
    farmer_id = offer["farmer_id"]

    # Get the food request
    request_response = (
        supabase
        .table("food_requests")
        .select("*")
        .eq("id", request_id)
        .execute()
    )

    if not request_response.data:
        return jsonify({
            "error": "Food request not found"
        }), 404

    food_request = request_response.data[0]

    if food_request["status"] != "open":
        return jsonify({
            "error": "This request has already been processed"
        }), 400

    # Accept selected offer
    supabase.table("offers").update({
        "status": "accepted"
    }).eq("id", offer_id).execute()

    # Reject other offers
    supabase.table("offers").update({
        "status": "rejected"
    }).eq("request_id", request_id).neq("id", offer_id).execute()

    # Update food request
    supabase.table("food_requests").update({
        "status": "selected",
        "selected_farmer_id": farmer_id
    }).eq("id", request_id).execute()

    # Calculate total
    total_amount = float(offer["quantity"]) * float(offer["price"])

    # Create order
    order_response = (
        supabase
        .table("orders")
        .insert({
            "request_id": request_id,
            "school_id": food_request["school_id"],
            "farmer_id": farmer_id,
            "offer_id": offer_id,
            "quantity": offer["quantity"],
            "price": offer["price"],
            "total_amount": total_amount,
            "status": "confirmed"
        })
        .execute()
    )

    return jsonify({
        "message": "Farmer selected successfully",
        "offer": offer_response.data[0],
        "order": order_response.data[0]
    }), 200