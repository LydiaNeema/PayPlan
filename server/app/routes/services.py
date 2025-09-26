from flask import Blueprint, request, jsonify
from app import db
from app.models.service import Service
from datetime import datetime

services_bp = Blueprint("services", __name__)

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
        # Handle next due date (accept both camelCase and snake_case)
        next_due_date = None
        if data.get("nextDueDate") or data.get("next_due_date"):
            raw_date = data.get("nextDueDate") or data.get("next_due_date")
            try:
                next_due_date = datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
            except ValueError:
                return jsonify({"error": "Invalid date format"}), 400

        new_service = Service(
            name=data.get("name"),
            amount=data.get("amount"),
            description=data.get("description"),
            frequency=data.get("frequency"),
            category=data.get("category"),
            color=data.get("color"),
            next_due_date=next_due_date,
            user_id=data.get("userId") or data.get("user_id"),
            household_id=data.get("householdId") or data.get("household_id"),
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
        if "category" in data:
            service.category = data["category"]
        if "color" in data:
            service.color = data["color"]

        if "nextDueDate" in data or "next_due_date" in data:
            raw_date = data.get("nextDueDate") or data.get("next_due_date")
            if raw_date:
                try:
                    service.next_due_date = datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
                except ValueError:
                    return jsonify({"error": "Invalid date format"}), 400
            else:
                service.next_due_date = None

        if "userId" in data or "user_id" in data:
            service.user_id = data.get("userId") or data.get("user_id")

        if "householdId" in data or "household_id" in data:
            service.household_id = data.get("householdId") or data.get("household_id")

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
