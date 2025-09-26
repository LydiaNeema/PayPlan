from flask import Blueprint, request, jsonify
from app import db
from app.models.paymenthistory import PaymentHistory
from datetime import date, timedelta

payments_bp = Blueprint("payments", __name__, url_prefix="/payments")

# -------------------------
# GET: Upcoming Payments
# -------------------------
@payments_bp.route("/upcoming", methods=["GET"])
def get_upcoming():
    today = date.today()
    payments = PaymentHistory.query.filter(
        PaymentHistory.due_date >= today,
        PaymentHistory.paid == False
    ).all()
    return jsonify([p.to_dict() for p in payments]), 200


# -------------------------
# GET: Overdue Payments
# -------------------------
@payments_bp.route("/overdue", methods=["GET"])
def get_overdue():
    today = date.today()
    payments = PaymentHistory.query.filter(
        PaymentHistory.due_date < today,
        PaymentHistory.paid == False
    ).all()
    return jsonify([p.to_dict() for p in payments]), 200


# -------------------------
# PATCH: Mark partial/full payment
# -------------------------
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

    # subtract partial amount
    payment.amount -= payment_amount

    # fully paid?
    if payment.amount == 0:
        payment.paid = True

        # schedule next if recurring
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
                    amount=payment.service.amount,  # reset to full
                    due_date=next_due,
                    category=payment.service.category,
                    color=payment.service.color,
                )
                db.session.add(new_payment)

    db.session.commit()
    return jsonify(payment.to_dict()), 200
