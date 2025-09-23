from flask import Blueprint, request, jsonify
from app import db
from models.service import Service

services_bp = Blueprint("services", __name__, url_prefix="/services")

@services_bp.route("/", methods=["POST"])
def create_service():
    data = request.get_json()
    name = data.get("name")
    price = data.get("price")

    if not name:
        return jsonify({"error": "Service name required"}), 400

    new_service = Service(name=name, price=price)
    db.session.add(new_service)
    db.session.commit()
    return jsonify(new_service.to_dict()), 201


@services_bp.route("/", methods=["GET"])
def get_services():
    services = Service.query.all()
    return jsonify([s.to_dict() for s in services]), 200


@services_bp.route("/<int:id>", methods=["GET"])
def get_service(id):
    service = Service.query.get(id)
    if not service:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(service.to_dict()), 200


@services_bp.route("/<int:id>", methods=["PUT", "PATCH"])
def update_service(id):
    service = Service.query.get(id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    data = request.get_json()
    service.name = data.get("name", service.name)
    service.price = data.get("price", service.price)

    db.session.commit()
    return jsonify(service.to_dict()), 200


@services_bp.route("/<int:id>", methods=["DELETE"])
def delete_service(id):
    service = Service.query.get(id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    db.session.delete(service)
    db.session.commit()
    return jsonify({"message": "Service deleted"}), 200
