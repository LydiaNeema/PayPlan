from flask import Blueprint, jsonify
from app.models.expense import Expense
from app.models.paymenthistory import PaymentHistory
from app.models.user import User
from app import db
from datetime import date

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")

@dashboard_bp.route("/", methods=["GET"])
def dashboard_overview():
    # Total expenses
    total_expenses = db.session.query(db.func.sum(Expense.amount)).scalar() or 0

    # Contributions by user
    contributions = (
        db.session.query(User.username, db.func.sum(Expense.amount))
        .join(Expense, Expense.user_id == User.id)
        .group_by(User.username)
        .all()
    )
    contributions_data = [
        {"username": u, "total": float(t or 0)} for u, t in contributions
    ]

    # Breakdown by category
    categories = (
        db.session.query(db.func.sum(Expense.amount), Expense.category_id)
        .group_by(Expense.category_id)
        .all()
    )
    category_data = [
        {"category_id": cid, "total": float(t or 0)} for t, cid in categories
    ]

    # Quick upcoming payments
    today = date.today()
    upcoming = PaymentHistory.query.filter(
        PaymentHistory.due_date >= today, PaymentHistory.paid == False
    ).limit(5).all()

    return jsonify({
        "total_expenses": float(total_expenses),
        "contributions": contributions_data,
        "category_breakdown": category_data,
        "upcoming_payments": [p.to_dict() for p in upcoming],
    }), 200