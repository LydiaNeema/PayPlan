from flask import Blueprint, request, jsonify
from app import db
from models.household import Household

household_bp = Blueprint("household", __name__, url_prefix="/households")

@household_bp.route("/", methods=["POST"])
def create_household():
    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"error": "Household name required"}), 400

    new_household = Household(name=name)
    db.session.add(new_household)
    db.session.commit()
    return jsonify(new_household.to_dict()), 201


@household_bp.route("/", methods=["GET"])
def get_households():
    households = Household.query.all()
    return jsonify([h.to_dict() for h in households]), 200


@household_bp.route("/<int:id>", methods=["GET"])
def get_household(id):
    household = Household.query.get(id)
    if not household:
        return jsonify({"error": "Household not found"}), 404
    return jsonify(household.to_dict()), 200


@household_bp.route("/<int:id>", methods=["PUT", "PATCH"])
def update_household(id):
    household = Household.query.get(id)
    if not household:
        return jsonify({"error": "Household not found"}), 404

    data = request.get_json()
    household.name = data.get("name", household.name)
    db.session.commit()
    return jsonify(household.to_dict()), 200


@household_bp.route("/<int:id>", methods=["DELETE"])
def delete_household(id):
    household = Household.query.get(id)
    if not household:
        return jsonify({"error": "Household not found"}), 404

    db.session.delete(household)
    db.session.commit()
    return jsonify({"message": "Household deleted"}), 200
