from flask import Blueprint, request, jsonify
from app import db
from app.models.service import Service
from datetime import datetime

services_bp = Blueprint("services", __name__)

# CRUD for Services

# GET all services
@services_bp.route("", methods=["GET"])
def get_services():
    services = Service.query.all()
    return jsonify([s.to_dict() for s in services]), 200


# CREATE a new service
@services_bp.route("", methods=["POST"])
def create_service():
    data = request.get_json() or {}

    try:
        next_due_date = None
        if data.get("next_due_date"):
            try:
                next_due_date = datetime.fromisoformat(
                    data["next_due_date"].replace("Z", "+00:00")
                )
            except ValueError:
                return jsonify({"error": "Invalid date format"}), 400

        new_service = Service(
            name=data.get("name"),
            amount=data.get("amount"),
            description=data.get("description"),
            frequency=data.get("frequency"),
            color=data.get("color"),
            next_due_date=next_due_date,
        )

        db.session.add(new_service)
        db.session.commit()

        return jsonify(new_service.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# UPDATE a service
@services_bp.route("/<int:id>", methods=["PUT", "PATCH"])
def update_service(id):
    data = request.get_json() or {}
    service = Service.query.get_or_404(id)

    try:
        if "name" in data:
            service.name = data["name"]
        if "amount" in data:
            service.amount = data["amount"]
        if "description" in data:
            service.description = data["description"]
        if "frequency" in data:
            service.frequency = data["frequency"]
        if "color" in data:
            service.color = data["color"]
        if "next_due_date" in data:
            if data["next_due_date"]:
                try:
                    service.next_due_date = datetime.fromisoformat(
                        data["next_due_date"].replace("Z", "+00:00")
                    )
                except ValueError:
                    return jsonify({"error": "Invalid date format"}), 400
            else:
                service.next_due_date = None

        db.session.commit()
        return jsonify(service.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE a service
@services_bp.route("/<int:id>", methods=["DELETE"])
def delete_service(id):
    service = Service.query.get_or_404(id)
    try:
        db.session.delete(service)
        db.session.commit()
        return jsonify({"message": "Service deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
