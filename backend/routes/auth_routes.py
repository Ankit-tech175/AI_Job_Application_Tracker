from flask import Blueprint, request

from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from backend.database.extensions import db
from backend.models.user_model import User

from backend.utils.response import (
    success_response,
    error_response
)

auth_bp = Blueprint("auth", __name__)


# =========================
# REGISTER API
# =========================
@auth_bp.route("/register", methods=["POST"])
def register():

    try:
        data = request.get_json()

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # Validate fields
        if not username or not email or not password:
            return error_response(
                "All fields are required",
                400
            )

        # Check username
        existing_username = User.query.filter_by(
            username=username
        ).first()

        if existing_username:
            return error_response(
                "Username already exists",
                409
            )

        # Check email
        existing_email = User.query.filter_by(
            email=email
        ).first()

        if existing_email:
            return error_response(
                "Email already exists",
                409
            )

        # Hash password
        hashed_password = generate_password_hash(password)

        # Create user
        new_user = User(
            username=username,
            email=email,
            password=hashed_password
        )

        # Save user
        db.session.add(new_user)
        db.session.commit()

        return success_response(
            "User registered successfully",
            status_code=201
        )

    except Exception as e:
        return error_response(str(e), 500)


# =========================
# LOGIN API
# =========================
@auth_bp.route("/login", methods=["POST"])
def login():

    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        # Validate fields
        if not email or not password:
            return error_response(
                "Email and password are required",
                400
            )

        # Find user
        user = User.query.filter_by(email=email).first()

        # Verify password
        if not user or not check_password_hash(user.password, password):
            return error_response(
                "Invalid email or password",
                401
            )

        # Generate token
        access_token = create_access_token(
            identity=str(user.id)
        )

        return success_response(
            "Login successful",
            data={
                "access_token": access_token,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            },
            status_code=200
        )

    except Exception as e:
        return error_response(str(e), 500)


# =========================
# PROFILE API
# =========================
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    try:
        current_user_id = get_jwt_identity()

        user = User.query.get(current_user_id)

        if not user:
            return error_response(
                "User not found",
                404
            )

        return success_response(
            "Profile fetched successfully",
            data={
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at
            },
            status_code=200
        )

    except Exception as e:
        return error_response(str(e), 500)