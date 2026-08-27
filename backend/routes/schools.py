from flask import Blueprint, request, jsonify
from config.supabase import supabase

schools_bp = Blueprint("schools", __name__)


@schools_bp.route("/schools", methods=["POST"])
def create_school():
    data = request.get_json()

    name = data.get("name")
    location = data.get("location")

    if not name or not location:
        return jsonify({
            "error": "Name and location are required"
        }), 400

    response = supabase.table("schools").insert({
        "name": name,
        "location": location
    }).execute()

    return jsonify({
        "message": "School created successfully",
        "school": response.data[0]
    }), 201


@schools_bp.route("/schools", methods=["GET"])
def get_schools():
    response = supabase.table("schools").select("*").execute()

    return jsonify(response.data), 200