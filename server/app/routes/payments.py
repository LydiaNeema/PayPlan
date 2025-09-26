from flask import Blueprint, request, jsonify
from app import db
from app.models.paymenthistory import PaymentHistory
from datetime import date, timedelta, datetime

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
    try:
        payment_amount = float(data.get("amount", 0))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid payment amount"}), 400

    if payment_amount <= 0:
        return jsonify({"error": "Invalid payment amount"}), 400

    # ✅ Fetch payment first
    payment = PaymentHistory.query.get_or_404(id)

    print(f"DEBUG before: {payment.to_dict()} | paying {payment_amount}")

    if payment.paid:
        return jsonify({"error": "Payment already fully paid"}), 400

    # --- Partial vs Full Payment ---
    if payment_amount >= payment.amount:
        # Full or overpayment -> close it
        payment.amount = 0.0
        payment.paid = True
        payment.paid_date = datetime.utcnow()
    else:
        # Partial -> subtract
        payment.amount = round(payment.amount - payment_amount, 2)

    # --- If fully paid, schedule next recurring ---
    if payment.paid and payment.service and getattr(payment.service, "frequency", None):
        next_due = None
        freq = (payment.service.frequency or "").strip().lower()
        if freq == "monthly":
            next_due = payment.due_date + timedelta(days=30)
        elif freq == "weekly":
            next_due = payment.due_date + timedelta(days=7)
        elif freq in ("yearly", "annually"):
            next_due = payment.due_date + timedelta(days=365)

        if next_due:
            new_payment = PaymentHistory(
                service_id=payment.service.id,
                user_id=payment.user_id,
                amount=payment.service.amount,
                due_date=next_due,
                category=payment.service.category,
                color=payment.service.color,
                paid=False,
            )
            db.session.add(new_payment)

    db.session.commit()
    print(f"DEBUG after: {payment.to_dict()}")
    return jsonify(payment.to_dict()), 200
