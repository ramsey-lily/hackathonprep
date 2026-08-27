from flask import Blueprint, request, jsonify
from config.supabase import supabase

farmers_bp = Blueprint("farmers", __name__)


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

    response = supabase.table("farmers").insert({
        "name": name,
        "phone": phone,
        "location": location
    }).execute()

    return jsonify({
        "message": "Farmer created successfully",
        "farmer": response.data[0]
    }), 201


@farmers_bp.route("/farmers", methods=["GET"])
def get_farmers():
    response = supabase.table("farmers").select("*").execute()

    return jsonify(response.data), 200