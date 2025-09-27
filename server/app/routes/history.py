from flask import Blueprint, request, jsonify
from app.models.paymenthistory import PaymentHistory

history_bp = Blueprint("history", __name__, url_prefix="/history")  

# Accept both /history and /history/ to avoid redirects (preflight 308)
@history_bp.route("", methods=["GET"])
@history_bp.route("/", methods=["GET"])
def get_payment_history():
    category = request.args.get("category")
    user_id = request.args.get("userId")
    reimbursed = request.args.get("reimbursed")

    # Base query: only paid payments (includes contributions now)
    query = PaymentHistory.query.filter(PaymentHistory.paid == True)

    # Apply filters if provided
    if category:
        query = query.filter(PaymentHistory.category == category)
    if user_id:
        try:
            query = query.filter(PaymentHistory.user_id == int(user_id))
        except ValueError:
            return jsonify({"error": "Invalid userId"}), 400
    if reimbursed in ["true", "false"]:
        query = query.filter(PaymentHistory.reimbursed == (reimbursed == "true"))

    # Order by most recent paid first (fallback to due_date if paid_date is null)
    payments = query.order_by(
        PaymentHistory.paid_date.desc().nullslast(),
        PaymentHistory.due_date.desc()
    ).all()

    return jsonify([p.to_dict() for p in payments]), 200