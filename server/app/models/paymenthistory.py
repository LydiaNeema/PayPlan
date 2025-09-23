from app.extensions import db

class PaymentHistory(db.Model):
    __tablename__ = "payment_history"

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    paid = db.Column(db.Boolean, default=False)

    # Relationships
    service = db.relationship("Service", back_populates="payment_history")
