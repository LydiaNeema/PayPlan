from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.household import Household
from app.models.category import Category
from app.models.expense import Expense
from app.models.service import Service
from app.models.paymenthistory import PaymentHistory
from datetime import date

app = create_app()

def seed():
    with app.app_context():
        db.drop_all()
        db.create_all()
        # Add your users, households, services, etc.
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
