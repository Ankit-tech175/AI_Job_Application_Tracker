import os

from flask import Flask

from config import Config

from backend.database.extensions import db, migrate, jwt

from backend.models import User

from backend.routes.auth_routes import auth_bp


def create_app():

    # Get project root directory
    base_dir = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )

    app = Flask(
        __name__,
        template_folder=os.path.join(base_dir, "templates"),
        static_folder=os.path.join(base_dir, "static")
    )

    # Load configuration
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)

    migrate.init_app(app, db)

    jwt.init_app(app)

    # Register blueprints
    app.register_blueprint(
        auth_bp,
        url_prefix="/api/auth"
    )

    print("Database Connected Successfully")

    return app