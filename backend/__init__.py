from flask import Flask

from config import Config
from backend.database.extensions import db, migrate


def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Initialize database
    db.init_app(app)

    # Initialize migration engine
    migrate.init_app(app, db)

    return app