from app.extensions import db

class Household(db.Model):
    __tablename__ = "households"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # Relationships
    users = db.relationship("User", back_populates="household", cascade="all, delete-orphan")
    expenses = db.relationship("Expense", back_populates="household", cascade="all, delete-orphan")
