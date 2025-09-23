from flask import Flask
from app.extensions import db, migrate, api

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config")  # load settings

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)

    # Import models so Alembic sees them
    from app.models import user, household, expense, category, service, paymenthistory

    return app
