from app import db
from datetime import datetime

class Service(db.Model):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255))
    frequency = db.Column(db.String(50))   # e.g. "monthly", "weekly"
    category = db.Column(db.String(120))   # e.g. Entertainment, Utilities
    color = db.Column(db.String(20))       # UI color hex
    next_due_date = db.Column(db.DateTime, default=datetime.utcnow)

    # Foreign Keys (link to household & user)
    household_id = db.Column(db.Integer, db.ForeignKey("households.id"), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    # Relationships
    payment_history = db.relationship(
        "PaymentHistory", back_populates="service", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "amount": self.amount,
            "description": self.description,
            "frequency": self.frequency,
            "category": self.category,
            "color": self.color,
            "nextDueDate": self.next_due_date.isoformat() if self.next_due_date else None,
            "householdId": self.household_id,
            "userId": self.user_id,
        }