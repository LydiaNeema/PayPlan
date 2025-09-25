from flask import Blueprint, jsonify
from app.models.paymenthistory import PaymentHistory

history_bp = Blueprint("history", __name__, url_prefix="/history")

@history_bp.route("/", methods=["GET"])
def get_payment_history():
    payments = PaymentHistory.query.filter_by(paid=True).all()
    return jsonify([p.to_dict() for p in payments]), 200