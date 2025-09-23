from flask import Blueprint, request, jsonify
from app import db
from models.paymenthistory import PaymentHistory

payments_bp = Blueprint("payments", __name__, url_prefix="/payments")

@payments_bp.route("/", methods=["POST"])
def create_payment():
    data = request.get_json()
    amount = data.get("amount")
    service_id = data.get("service_id")
    user_id = data.get("user_id")

    if not amount or not service_id or not user_id:
        return jsonify({"error": "Amount, service_id, and user_id required"}), 400

    new_payment = PaymentHistory(amount=amount, service_id=service_id, user_id=user_id)
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
    payment.amount = data.get("amount", payment.amount)
    payment.service_id = data.get("service_id", payment.service_id)
    payment.user_id = data.get("user_id", payment.user_id)

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
