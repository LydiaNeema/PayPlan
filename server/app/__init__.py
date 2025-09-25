from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .extensions import db, migrate, api

# ------------------- Create App -------------------
def create_app():
    app = Flask(__name__)

    # ------------------- Config -------------------
    app.config['SECRET_KEY'] = 'super-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///instance/app.db'  # unified path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret-jwt-key'

    # ------------------- Extensions -------------------
    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)
    api.init_app(app)
    CORS(app)

    # ------------------- Import models -------------------
    from app.models import user, service, paymenthistory, expense, household, category

    # ------------------- Register blueprints -------------------
    from app.routes.auth import auth_bp
    from app.routes.services import services_bp
    from app.routes.payments import payments_bp
    from app.routes.expenses import expenses_bp
    from app.routes.household import household_bp
    from app.routes.categories import categories_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(services_bp, url_prefix="/services")
    app.register_blueprint(payments_bp, url_prefix="/payments")
    app.register_blueprint(expenses_bp, url_prefix="/expenses")
    app.register_blueprint(household_bp, url_prefix="/households")
    app.register_blueprint(categories_bp, url_prefix="/categories")

    # ------------------- Optional Test Route -------------------
    @app.route('/')
    def home():
        return {"message": "Backend is running!"}

    return app
