from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # -------------------
    # App configuration
    # -------------------
    app.config['SECRET_KEY'] = 'super-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret-jwt-key'

    # -------------------
    # Initialize extensions
    # -------------------
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # Import models so migrations detect them
    from app.models import user, service
    # household, expense, category, paymenthistory (future)

    # -------------------
    # Register blueprints
    # -------------------
    from app.routes.auth import auth_bp
    from app.routes.services import services_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(services_bp, url_prefix="/services")

    # Optional test route
    @app.route('/')
    def home():
        return {"message": "Backend is running!"}

    return app