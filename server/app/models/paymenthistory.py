from app import db
from datetime import datetime, date

class PaymentHistory(db.Model):
    __tablename__ = "payment_history"

    id = db.Column(db.Integer, primary_key=True)

    # If payment is linked to a service, this may point to it; manual payments allowed (nullable)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"), nullable=True)

    # Nullable user_id so service-created payments can exist without explicit user
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    manual_name = db.Column(db.String(120), nullable=True)
    category = db.Column(db.String(120), nullable=True)
    color = db.Column(db.String(20), nullable=True)

    amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.Date, nullable=False)

    paid = db.Column(db.Boolean, default=False, nullable=False)
    paid_date = db.Column(db.DateTime, nullable=True)  # ✅ Added
    reimbursed = db.Column(db.Boolean, default=False, nullable=False)  # ✅ Added

    # Relationships
    service = db.relationship("Service", back_populates="payment_history", lazy="joined")
    user = db.relationship("User", back_populates="payment_history")

    def to_dict(self):
        service_obj = None
        if self.service:
            service_obj = {
                "id": self.service.id,
                "name": self.service.name,
                "category": getattr(self.service, "category", None),
                "color": getattr(self.service, "color", None),
            }

        return {
            "id": self.id,
            "serviceId": self.service_id,
            "service": service_obj,
            "manualName": self.manual_name,
            "userId": self.user_id,
            "amount": self.amount,
            "dueDate": self.due_date.isoformat() if self.due_date else None,
            "paid": self.paid,
            "paidDate": self.paid_date.isoformat() if self.paid_date else None,
            "reimbursed": self.reimbursed,
            "category": self.category,
            "color": self.color,
        }