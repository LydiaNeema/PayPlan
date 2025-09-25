from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# ------------------- Global Extensions -------------------
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate()
api = Api()

# ------------------- Create App -------------------
def create_app():
    app = Flask(_name_)
    
    # ------------------- Config -------------------
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///instance/app.db'  # unified path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.json.compact = False

    # ------------------- Initialize Extensions -------------------
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    CORS(app)

    return app