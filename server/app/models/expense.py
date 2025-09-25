from app.extensions import db

class Expense(db.Model):
    _tablename_ = "expenses"

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200))
    date = db.Column(db.Date, nullable=False)
    source = db.Column(db.String(50), default="manual")  # manual / MPESA / Bank

    household_id = db.Column(db.Integer, db.ForeignKey("households.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=True)

    # Relationships
    household = db.relationship("Household", back_populates="expenses")
    user = db.relationship("User", back_populates="expenses")
    category = db.relationship("Category", back_populates="expenses")