from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    # Foreign key
    household_id = db.Column(db.Integer, db.ForeignKey("households.id"))  # user belongs to 1 household

    # Relationships
    household = db.relationship("Household", back_populates="users")
    expenses = db.relationship("Expense", back_populates="user", cascade="all, delete-orphan")
    payment_history = db.relationship("PaymentHistory", back_populates="user", cascade="all, delete-orphan")

    # Password methods
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # Serialize method
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "household_id": self.household_id
        }
