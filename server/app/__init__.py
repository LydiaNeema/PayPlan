from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from .extensions import db, migrate, api

def create_app():
    app = Flask(__name__)  

    # Config
    app.config['SECRET_KEY'] = 'super-secret-key'
    app.config['JWT_SECRET_KEY'] = 'super-secret-jwt-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)
    api.init_app(app)
    CORS(app)

    # Import models **after db is initialized**
    with app.app_context():
        from app.models.user import User
        from app.models.service import Service
        from app.models.paymenthistory import PaymentHistory
        from app.models.expense import Expense
        from app.models.household import Household
        from app.models.category import Category

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.services import services_bp
    from app.routes.payments import payments_bp
    from app.routes.expenses import expenses_bp
    from app.routes.household import household_bp
    from app.routes.categories import categories_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.history import history_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(services_bp, url_prefix="/services")
    app.register_blueprint(payments_bp, url_prefix="/payments")
    app.register_blueprint(expenses_bp, url_prefix="/expenses")
    app.register_blueprint(household_bp, url_prefix="/household")
    app.register_blueprint(categories_bp, url_prefix="/categories")
    app.register_blueprint(dashboard_bp, url_prefix="/dashboard")
    app.register_blueprint(history_bp, url_prefix="/history")

    @app.route('/')
    def home():
        return {"message": "Backend is running!"}

    return app
