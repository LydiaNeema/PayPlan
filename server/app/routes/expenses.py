from flask import Blueprint, request, jsonify
from app import db
from app.models.expense import Expense

expenses_bp = Blueprint("expenses", __name__, url_prefix="/expenses")

@expenses_bp.route("/", methods=["POST"])
def create_expense():
    data = request.get_json()
    amount = data.get("amount")
    description = data.get("description")
    category_id = data.get("category_id")

    if not amount or not category_id:
        return jsonify({"error": "Amount and category_id are required"}), 400

    new_expense = Expense(amount=amount, description=description, category_id=category_id)
    db.session.add(new_expense)
    db.session.commit()
    return jsonify(new_expense.to_dict()), 201


@expenses_bp.route("/", methods=["GET"])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([e.to_dict() for e in expenses]), 200


@expenses_bp.route("/<int:id>", methods=["GET"])
def get_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    return jsonify(expense.to_dict()), 200


@expenses_bp.route("/<int:id>", methods=["PUT", "PATCH"])
def update_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    data = request.get_json()
    expense.amount = data.get("amount", expense.amount)
    expense.description = data.get("description", expense.description)
    expense.category_id = data.get("category_id", expense.category_id)

    db.session.commit()
    return jsonify(expense.to_dict()), 200


@expenses_bp.route("/<int:id>", methods=["DELETE"])
def delete_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Expense deleted"}), 200