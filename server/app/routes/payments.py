from flask import Blueprint, request, jsonify
from app import db
from app.models.paymenthistory import PaymentHistory
from datetime import date

payments_bp = Blueprint("payments", __name__, url_prefix="/payments")

# -------------------- CRUD --------------------

@payments_bp.route("/", methods=["POST"])
def create_payment():
    data = request.get_json()
    amount = data.get("amount")
    service_id = data.get("service_id")
    user_id = data.get("user_id")
    due_date = data.get("due_date")

    if not amount or not service_id or not user_id or not due_date:
        return jsonify({"error": "amount, service_id, user_id, and due_date are required"}), 400

    new_payment = PaymentHistory(
        amount=amount,
        service_id=service_id,
        user_id=user_id,
        due_date=date.fromisoformat(due_date),
    )
    db.session.add(new_payment)
    db.session.commit()
    return jsonify(new_payment.to_dict()), 201


@payments_bp.route("/", methods=["GET"])
def get_payments():
    payments = PaymentHistory.query.all()
    return jsonify([p.to_dict() for p in payments]), 200


@payments_bp.route("/<int:id>", methods=["GET"])
def get_payment(id):
    payment = PaymentHistory.query.get(id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404
    return jsonify(payment.to_dict()), 200


@payments_bp.route("/<int:id>", methods=["PUT", "PATCH"])
def update_payment(id):
    payment = PaymentHistory.query.get(id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    data = request.get_json()
    if "amount" in data:
        payment.amount = data["amount"]
    if "service_id" in data:
        payment.service_id = data["service_id"]
    if "user_id" in data:
        payment.user_id = data["user_id"]
    if "due_date" in data:
        payment.due_date = date.fromisoformat(data["due_date"])
    if "paid" in data:
        payment.paid = data["paid"]

    db.session.commit()
    return jsonify(payment.to_dict()), 200


@payments_bp.route("/<int:id>", methods=["DELETE"])
def delete_payment(id):
    payment = PaymentHistory.query.get(id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    db.session.delete(payment)
    db.session.commit()
    return jsonify({"message": "Payment deleted"}), 200

# -------------------- EXTRA ROUTES --------------------

@payments_bp.route("/upcoming", methods=["GET"])
def get_upcoming_payments():
    today = date.today()
    payments = PaymentHistory.query.filter(
        PaymentHistory.due_date >= today, PaymentHistory.paid == False
    ).all()
    return jsonify([p.to_dict() for p in payments]), 200


@payments_bp.route("/overdue", methods=["GET"])
def get_overdue_payments():
    today = date.today()
    payments = PaymentHistory.query.filter(
        PaymentHistory.due_date < today, PaymentHistory.paid == False
    ).all()
    return jsonify([p.to_dict() for p in payments]), 200


@payments_bp.route("/mark-paid/<int:id>", methods=["PATCH"])
def mark_payment_paid(id):
    payment = PaymentHistory.query.get(id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    payment.paid = True
    db.session.commit()
    return jsonify(payment.to_dict()), 200