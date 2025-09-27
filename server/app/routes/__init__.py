from .auth import auth_bp
from .categories import categories_bp
from .expenses import expenses_bp
from .household import household_bp
from .services import services_bp
from .payments import payments_bp

all_blueprints = [
    auth_bp,
    categories_bp,
    expenses_bp,
    household_bp,
    services_bp,
    payments_bp
]