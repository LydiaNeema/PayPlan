from app import db
from datetime import datetime

class Service(db.Model):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255))
    frequency = db.Column(db.String(50))   # e.g. "monthly", "weekly"
    color = db.Column(db.String(20))       # UI color
    next_due_date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "amount": self.amount,
            "description": self.description,
            "frequency": self.frequency,
            "color": self.color,
            "nextDueDate": self.next_due_date.isoformat() if self.next_due_date else None
        }
