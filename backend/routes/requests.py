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

    status = request.args.get("status")
    location = request.args.get("location")

    query = supabase.table("food_requests").select("*")

    if status:
        query = query.eq("status", status)

    response = query.execute()

    requests_data = response.data

    # Simple location filtering
    # Can be improved later with database relationships
    if location:
        school_ids_response = (
            supabase
            .table("schools")
            .select("id")
            .eq("location", location)
            .execute()
        )

        school_ids = [
            school["id"]
            for school in school_ids_response.data
        ]

        requests_data = [
            item for item in requests_data
            if item["school_id"] in school_ids
        ]

    return jsonify(requests_data), 200


# Get one request
@requests_bp.route("/requests/<int:request_id>", methods=["GET"])
def get_request(request_id):

    response = (
        supabase
        .table("food_requests")
        .select("*")
        .eq("id", request_id)
        .execute()
    )

    if not response.data:
        return jsonify({
            "error": "Food request not found"
        }), 404

    return jsonify(response.data[0]), 200


# Get all requests belonging to a school
@requests_bp.route("/schools/<int:school_id>/requests", methods=["GET"])
def get_school_requests(school_id):

    response = (
        supabase
        .table("food_requests")
        .select("*")
        .eq("school_id", school_id)
        .execute()
    )

    return jsonify(response.data), 200