from flask import Flask
from app.extensions import db, migrate, api

# Explicit imports so Alembic can see them
from .user import User
from .household import Household
from .expense import Expense
from .category import Category
from .service import Service
from .paymenthistory import PaymentHistory

_all_ = [
    "User",
    "Household",
    "Expense",
    "Category",
    "Service",
    "PaymentHistory",
    "db",
    "create_app",
]

def create_app():
    app = Flask(_name_)
    app.config.from_object("app.config")  # load settings

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)

    # Import models so Alembic sees them
    from app.models import user, household, expense, category, service, paymenthistory

    return app