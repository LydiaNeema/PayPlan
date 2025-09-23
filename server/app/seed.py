from datetime import date
from app.extensions import db
from app.models.user import User
from app.models.household import Household
from app.models.category import Category
from app.models.expense import Expense
from app.models.service import Service
from app.models.paymenthistory import PaymentHistory
from wsgi import app  # import app so we can use app.app_context()

def seed():
    with app.app_context():
        # -------------------
        # Drop & recreate tables (for testing only!)
        # -------------------
        db.drop_all()
        db.create_all()

        # -------------------
        # Create households
        # -------------------
        household1 = Household(name="Smith Family")
        household2 = Household(name="Johnson Family")
        db.session.add_all([household1, household2])
        db.session.commit()

        # -------------------
        # Create users
        # -------------------
        user1 = User(username="johnsmith", email="john@example.com", household_id=household1.id)
        user1.set_password("password123")

        user2 = User(username="marysmith", email="mary@example.com", household_id=household1.id)
        user2.set_password("password123")

        user3 = User(username="alexjohnson", email="alex@example.com", household_id=household2.id)
        user3.set_password("password123")

        db.session.add_all([user1, user2, user3])
        db.session.commit()

        # -------------------
        # Create categories (no description field)
        # -------------------
        groceries = Category(name="Groceries")
        rent = Category(name="Rent")
        utilities = Category(name="Utilities")

        db.session.add_all([groceries, rent, utilities])
        db.session.commit()

        # -------------------
        # Create expenses (use date objects, not timestamp)
        # -------------------
        expense1 = Expense(
            amount=5000,
            description="Supermarket shopping",
            source="manual",
            date=date(2025, 9, 23),
            user_id=user1.id,
            household_id=household1.id,
            category_id=groceries.id
        )

        expense2 = Expense(
            amount=20000,
            description="September rent",
            source="bank",
            date=date(2025, 9, 1),
            user_id=user2.id,
            household_id=household1.id,
            category_id=rent.id
        )

        db.session.add_all([expense1, expense2])
        db.session.commit()

        # -------------------
        # Create services (amount is required)
        # -------------------
        service1 = Service(name="Netflix", description="Streaming subscription", amount=1200, frequency="monthly")
        service2 = Service(name="Spotify", description="Music subscription", amount=500, frequency="monthly")

        db.session.add_all([service1, service2])
        db.session.commit()

        # -------------------
        # Create payment histories (use due_date)
        # -------------------
        payment1 = PaymentHistory(
            amount=1200,
            due_date=date(2025, 9, 10),
            service_id=service1.id,
            paid=True
        )

        payment2 = PaymentHistory(
            amount=500,
            due_date=date(2025, 9, 15),
            service_id=service2.id,
            paid=True
        )

        db.session.add_all([payment1, payment2])
        db.session.commit()

        print("✅ Database seeded successfully!")

if __name__ == "__main__":
    seed()
