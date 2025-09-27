from flask import Blueprint, request, jsonify
from app import db
from app.models.service import Service
from app.models.paymenthistory import PaymentHistory
from datetime import datetime, date, timedelta

services_bp = Blueprint("services", __name__, url_prefix="/services")


# GET all services
@services_bp.route("", methods=["GET"])
def get_services():
    services = Service.query.all()
    return jsonify([s.to_dict() for s in services]), 200


# CREATE a new service (and auto-create the first PaymentHistory entry)
@services_bp.route("", methods=["POST"])
def create_service():
    data = request.get_json() or {}

    try:
        # Parse next due date if provided (accept camelCase nextDueDate or snake_case next_due_date)
        next_due_date = None
        if data.get("nextDueDate") or data.get("next_due_date"):
            raw_date = data.get("nextDueDate") or data.get("next_due_date")
            try:
                next_due_date = datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
            except ValueError:
                return jsonify({"error": "Invalid date format for nextDueDate"}), 400

        # Create service object
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
        db.session.commit()  # commit to get new_service.id

        # --- AUTO-GENERATE initial payment for this service (hybrid approach) ---
        # Determine due date for initial payment:
        #  - Use service.next_due_date if provided
        #  - Else derive from frequency: weekly -> +7d, monthly -> +30d, yearly -> +365d
        #  - Else default to today
        try:
            if new_service.next_due_date:
                initial_due = new_service.next_due_date.date() if isinstance(new_service.next_due_date, datetime) else new_service.next_due_date
            else:
                freq = (new_service.frequency or "").strip().lower()
                if freq == "weekly":
                    initial_due = date.today() + timedelta(days=7)
                elif freq == "monthly":
                    initial_due = date.today() + timedelta(days=30)
                elif freq == "yearly" or freq == "annually":
                    initial_due = date.today() + timedelta(days=365)
                else:
                    # If no frequency provided, default to next_due_date if provided else today
                    initial_due = date.today()

            # Build PaymentHistory entry
            initial_payment = PaymentHistory(
                amount=new_service.amount or 0,
                service_id=new_service.id,
                user_id=new_service.user_id,
                manual_name=None,
                category=new_service.category,
                color=new_service.color,
                due_date=initial_due,
                paid=False,
            )

            db.session.add(initial_payment)
            db.session.commit()
        except Exception as pay_err:
            # If payment creation fails, rollback the payment creation but keep the service.
            db.session.rollback()
            # Log the error server-side (here we return in response)
            # We still return service success to frontend, but include payment error info.
            return jsonify({
                "service": new_service.to_dict(),
                "warning": f"Service created but failed creating initial payment: {str(pay_err)}"
            }), 201

        # Return service as before (UI expects service JSON)
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