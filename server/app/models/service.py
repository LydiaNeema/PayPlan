from app.extensions import db

class Service(db.Model):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    amount = db.Column(db.Float, nullable=False)
    frequency = db.Column(db.String(50))  # e.g., monthly, yearly

    # Relationships
    payment_history = db.relationship("PaymentHistory", back_populates="service", cascade="all, delete-orphan")
