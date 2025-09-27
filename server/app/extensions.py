import os
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
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Store database inside the "instance" folder (Flask best practice)
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, '..', 'instance', 'app.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False