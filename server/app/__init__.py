from flask import Flask
from flask_cors import CORS
from app.extensions import db, migrate, api

def create_app():
    app = Flask(__name__)

    # Config
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.json.compact = False

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    CORS(app)

    # Import models so Alembic can detect them
    from app.models import user, household, expense, category, service, paymenthistory

    return app
