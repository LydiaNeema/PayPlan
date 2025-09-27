from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.household import Household
from werkzeug.security import generate_password_hash

household_bp = Blueprint("household", __name__)

def _get_current_user():
    ident = get_jwt_identity()
    user_id = ident.get("id") if isinstance(ident, dict) else ident
    return User.query.get(user_id)

# ------------------------
# Household Endpoints
# ------------------------

@household_bp.route("/", methods=["POST"])
@jwt_required()
def create_household():
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Household name is required"}), 400

    household = Household(name=name)
    db.session.add(household)
    db.session.commit()

    current_user = _get_current_user()
    if current_user:
        current_user.household_id = household.id
        current_user.role = "owner"
        db.session.commit()

    return jsonify({
        "id": household.id,
        "name": household.name
    }), 201


@household_bp.route("/", methods=["GET"])
@jwt_required()
def get_household():
    current_user = _get_current_user()
    household = None
    if current_user and current_user.household_id:
        household = Household.query.get(current_user.household_id)

    if not household:
        return jsonify({
            "id": None,
            "name": None,
            "members": []
        }), 200

    members = User.query.filter_by(household_id=household.id).all()
    members_data = [
        {"id": m.id, "username": m.username, "email": m.email, "role": m.role}
        for m in members
    ]
    return jsonify({
        "id": household.id,
        "name": household.name,
        "members": members_data
    }), 200


@household_bp.route("/<int:household_id>", methods=["PUT"])
@jwt_required()
def update_household(household_id):
    data = request.get_json() or {}
    new_name = (data.get("name") or "").strip()
    if not new_name:
        return jsonify({"error": "Household name is required"}), 400

    current_user = _get_current_user()
    if not current_user or current_user.household_id != household_id:
        return jsonify({"error": "Not allowed"}), 403

    household = Household.query.get_or_404(household_id)
    household.name = new_name
    db.session.commit()

    return jsonify({
        "id": household.id,
        "name": household.name
    }), 200

# ------------------------
# Member Endpoints
# ------------------------

@household_bp.route("/members", methods=["POST"])
@jwt_required()
def create_member():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = data.get("role") or "member"
    household_id = data.get("household_id")  # optional

    if not username or not email or not password:
        return jsonify({"error": "username, email and password are required"}), 400

    current_user = _get_current_user()
    if not current_user:
        return jsonify({"error": "Invalid user"}), 401

    # Use current user's household if none specified
    if not household_id:
        household_id = current_user.household_id

    # Validate household if provided
    household = None
    if household_id:
        household = Household.query.get(household_id)
        if not household:
            return jsonify({"error": "Household not found"}), 404

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
        role=role,
        household_id=household_id,
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "role": new_user.role,
        "household_id": new_user.household_id
    }), 201


@household_bp.route("/members/<int:member_id>", methods=["PUT"])
@jwt_required()
def update_member(member_id):
    data = request.get_json() or {}
    member = User.query.get(member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404

    if "username" in data:
        member.username = data["username"].strip()
    if "email" in data:
        new_email = data["email"].strip().lower()
        if User.query.filter(User.email == new_email, User.id != member.id).first():
            return jsonify({"error": "Email already used"}), 400
        member.email = new_email
    if "role" in data:
        member.role = data["role"]
    if "password" in data and data["password"]:
        member.password_hash = generate_password_hash(data["password"])
    if "household_id" in data:
        # optional: allow moving member to a different household
        household = Household.query.get(data["household_id"])
        if not household and data["household_id"] is not None:
            return jsonify({"error": "Household not found"}), 404
        member.household_id = data["household_id"]

    db.session.commit()
    return jsonify({
        "id": member.id,
        "username": member.username,
        "email": member.email,
        "role": member.role,
        "household_id": member.household_id
    }), 200


@household_bp.route("/members/<int:member_id>", methods=["DELETE"])
@jwt_required()
def delete_member(member_id):
    member = User.query.get(member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404

    if member.role == "owner":
        return jsonify({"error": "Cannot remove the owner"}), 403

    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": "Member deleted"}), 200