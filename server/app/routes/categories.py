from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.category import Category

# Blueprint for categories
categories_bp = Blueprint("categories", __name__, url_prefix="/categories")

# ---------------- CREATE a new category ----------------
@categories_bp.route("/", methods=["POST"])
def create_category():
    data = request.get_json()
    if not data.get("name"):
        return jsonify({"error": "Category name is required"}), 400

    new_category = Category(
        name=data.get("name"),
        description=data.get("description")
    )
    db.session.add(new_category)
    db.session.commit()
    return jsonify(new_category.to_dict()), 201

# ---------------- READ all categories ----------------
@categories_bp.route("/", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories]), 200

# ---------------- READ a single category by ID ----------------
@categories_bp.route("/<int:id>", methods=["GET"])
def get_category(id):
    category = Category.query.get_or_404(id)
    return jsonify(category.to_dict()), 200

# ---------------- UPDATE a category by ID ----------------
@categories_bp.route("/<int:id>", methods=["PUT", "PATCH"])
def update_category(id):
    category = Category.query.get_or_404(id)
    data = request.get_json()
    category.name = data.get("name", category.name)
    category.description = data.get("description", category.description)
    db.session.commit()
    return jsonify(category.to_dict()), 200

# ---------------- DELETE a category by ID ----------------
@categories_bp.route("/<int:id>", methods=["DELETE"])
def delete_category(id):
    category = Category.query.get_or_404(id)
    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": f"Category {id} deleted"}), 200
