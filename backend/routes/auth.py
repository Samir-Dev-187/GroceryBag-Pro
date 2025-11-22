from flask import Blueprint, request, jsonify
from extensions import db
from models import User
from flask_jwt_extended import create_access_token

auth = Blueprint('auth', __name__)

# Register user (Admin only will use this later)
@auth.route('/register', methods=['POST'])
def register():
    data = request.json or {}
    phone = data.get("phone")
    password = data.get("password")
    role = data.get("role")  # admin/user/customer

    if not phone or not password or not role:
        return jsonify({"error": "phone, password and role required"}), 400

    if User.query.filter_by(phone=phone).first():
        return jsonify({"error": "Phone already exists"}), 400

    user = User(phone=phone, role=role)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    # generate UID (AD/US/CU prefix)
    prefix = 'AD' if role == 'admin' else 'US' if role == 'user' else 'CU'
    user.uid = f"{prefix}-{user.id:04d}"

    db.session.commit()

    return jsonify({"message": "User created", "uid": user.uid}), 201


# Login
@auth.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    phone = data.get("phone")
    password = data.get("password")

    if not phone or not password:
        return jsonify({"error": "phone and password required"}), 400

    user = User.query.filter_by(phone=phone).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid phone or password"}), 401

    token = create_access_token(identity=user.uid)

    return jsonify({"message": "Login successful", "token": token, "role": user.role})
