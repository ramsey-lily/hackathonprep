from flask import Blueprint, request, jsonify
from config.supabase import supabase

requests_bp = Blueprint("requests", __name__)


# Create a food request
@requests_bp.route("/requests", methods=["POST"])
def create_request():

    data = request.get_json()

    required_fields = [
        "school_id",
        "food_item",
        "quantity",
        "unit",
        "budget",
        "delivery_date"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "error": f"{field} is required"
            }), 400

    response = (
        supabase
        .table("food_requests")
        .insert({
            "school_id": data["school_id"],
            "food_item": data["food_item"],
            "quantity": data["quantity"],
            "unit": data["unit"],
            "budget": data["budget"],
            "delivery_date": data["delivery_date"],
            "status": "open"
        })
        .execute()
    )

    return jsonify({
        "message": "Food request created successfully",
        "request": response.data[0]
    }), 201


# Get food requests
@requests_bp.route("/requests", methods=["GET"])
def get_requests():

    response = (
        supabase
        .table("food_requests")
        .select("""
            id,
            food_item,
            quantity,
            unit,
            budget,
            delivery_date,
            status,
            selected_farmer_id,
            schools (
                id,
                name,
                location
            )
        """)
        .execute()
    )

    requests_data = []

    for item in response.data:

        school = item.pop("schools", None)

        requests_data.append({
            "id": item["id"],
            "school": {
                "id": school["id"],
                "name": school["name"],
                "location": school["location"]
            } if school else None,
            "food_item": item["food_item"],
            "quantity": item["quantity"],
            "unit": item["unit"],
            "budget": item["budget"],
            "delivery_date": item["delivery_date"],
            "status": item["status"],
            "selected_farmer_id": item["selected_farmer_id"]
        })

    return jsonify(requests_data), 200

# Get one request
@requests_bp.route("/requests/<int:request_id>", methods=["GET"])
def get_request(request_id):

    response = (
        supabase
        .table("food_requests")
        .select("""
            id,
            food_item,
            quantity,
            unit,
            budget,
            delivery_date,
            status,
            selected_farmer_id,
            schools (
                id,
                name,
                location
            )
        """)
        .eq("id", request_id)
        .execute()
    )

    if not response.data:
        return jsonify({
            "error": "Food request not found"
        }), 404

    item = response.data[0]
    school = item.pop("schools", None)

    result = {
        "id": item["id"],
        "school": {
            "id": school["id"],
            "name": school["name"],
            "location": school["location"]
        } if school else None,
        "food_item": item["food_item"],
        "quantity": item["quantity"],
        "unit": item["unit"],
        "budget": item["budget"],
        "delivery_date": item["delivery_date"],
        "status": item["status"],
        "selected_farmer_id": item["selected_farmer_id"]
    }

    return jsonify(result), 200


# Get all requests belonging to a school
@requests_bp.route("/schools/<int:school_id>/requests", methods=["GET"])
def get_school_requests(school_id):

    response = (
        supabase
        .table("food_requests")
        .select("""
            id,
            food_item,
            quantity,
            unit,
            budget,
            delivery_date,
            status,
            selected_farmer_id,
            farmers (
                id,
                name,
                phone,
                location
            )
        """)
        .eq("school_id", school_id)
        .execute()
    )

    requests_data = []

    for item in response.data:

        farmer = item.pop("farmers", None)

        requests_data.append({
            "id": item["id"],
            "food_item": item["food_item"],
            "quantity": item["quantity"],
            "unit": item["unit"],
            "budget": item["budget"],
            "delivery_date": item["delivery_date"],
            "status": item["status"],
            "farmer": {
                "id": farmer["id"],
                "name": farmer["name"],
                "phone": farmer["phone"],
                "location": farmer["location"]
            } if farmer else None
        })

    return jsonify(requests_data), 200