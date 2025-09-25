from app.extensions import db
from datetime import date

class PaymentHistory(db.Model):
    _tablename_ = "payment_history"

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)  # included for relationship
    amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    paid = db.Column(db.Boolean, default=False)

    # Relationships
    service = db.relationship("Service", back_populates="payment_history")
    user = db.relationship("User", back_populates="payment_history")

    def to_dict(self):
        return {
            "id": self.id,
            "serviceId": self.service_id,
            "serviceName": self.service.name if self.service else None,
            "userId": self.user_id,
            "amount": self.amount,
            "dueDate": self.due_date.isoformat() if self.due_date else None,
            "paid": self.paid,
        }