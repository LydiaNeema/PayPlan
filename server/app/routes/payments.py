from flask import Blueprint, request, jsonify
from app import db
from app.models.paymenthistory import PaymentHistory
from datetime import date, timedelta

payments_bp = Blueprint("payments", __name__, url_prefix="/payments")

# PATCH: Mark payment as paid (partial or full)
@payments_bp.route("/<int:id>/pay", methods=["PATCH"])
def mark_paid(id):
    data = request.get_json() or {}
    payment_amount = float(data.get("amount", 0))

    if payment_amount <= 0:
        return jsonify({"error": "Invalid payment amount"}), 400

    payment = PaymentHistory.query.get_or_404(id)

    if payment.paid:
        return jsonify({"error": "Payment already fully paid"}), 400

    if payment_amount > payment.amount:
        return jsonify({"error": "Payment exceeds remaining amount"}), 400

    # Subtract the partial amount
    payment.amount -= payment_amount

    # Only mark fully paid if amount reaches zero
    if payment.amount == 0:
        payment.paid = True

        # Schedule next payment for recurring services
        if payment.service and payment.service.frequency:
            next_due = None
            if payment.service.frequency == "monthly":
                next_due = payment.due_date + timedelta(days=30)
            elif payment.service.frequency == "weekly":
                next_due = payment.due_date + timedelta(days=7)
            elif payment.service.frequency == "yearly":
                next_due = payment.due_date + timedelta(days=365)

            if next_due:
                new_payment = PaymentHistory(
                    service_id=payment.service.id,
                    user_id=payment.user_id,
                    amount=payment.service.amount,
                    due_date=next_due,
                    category=payment.service.category,
                    color=payment.service.color,
                )
                db.session.add(new_payment)

    db.session.commit()
    return jsonify(payment.to_dict()), 200
