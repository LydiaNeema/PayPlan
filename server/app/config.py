import os
from pathlib import Path
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from sqlalchemy import MetaData

# ------------------- Global Extensions -------------------
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate()
api = Api()

# ------------------- Config Values -------------------
BASE_DIR = Path(__file__).resolve().parent

# Use PostgreSQL if DATABASE_URL is set (Render), otherwise fallback to local SQLite
SQLALCHEMY_DATABASE_URI = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{BASE_DIR.parent / 'instance' / 'app.db'}"
)

# Disable modification tracking (recommended)
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Secret keys from environment variables for security in production
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-jwt-key")
