from flask import Blueprint, request, jsonify
from extensions import db
from models import User
from flask_jwt_extended import create_access_token

from datetime import datetime, timedelta
import random
from models import OTP
from flask import current_app
import os
import re

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

    # Password policy: 8-32 chars, at least one upper, one lower, one digit, one special
    def password_is_valid(pwd: str):
        if not isinstance(pwd, str):
            return False, 'Password must be a string'
        if len(pwd) < 8 or len(pwd) > 32:
            return False, 'Password must be 8-32 characters long'
        if not re.search(r'[A-Z]', pwd):
            return False, 'Password must contain at least one uppercase letter'
        if not re.search(r'[a-z]', pwd):
            return False, 'Password must contain at least one lowercase letter'
        if not re.search(r'\d', pwd):
            return False, 'Password must contain at least one digit'
        if not re.search(r'[!@#$%^&*(),.?":{}|<>\[\]\\/;\'`~_+=\-]', pwd):
            return False, 'Password must contain at least one special character'
        return True, None

    ok, msg = password_is_valid(password)
    if not ok:
        return jsonify({"error": msg}), 400

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

    # Generate and persist OTP on successful login (demo-friendly)
    code = f"{random.randint(0, 999999):06d}"
    expires = datetime.utcnow() + timedelta(minutes=10)
    otp = OTP(user_id=user.id, code=code, expires_at=expires)
    # also save current OTP on the user row (replace previous)
    user.otp = code
    db.session.add(otp)
    db.session.add(user)
    db.session.commit()

    # Return OTP in response when in debug or DEV_SEED to make testing simple
    env_dev = os.getenv('DEV_SEED', '')
    dev_flag = str(env_dev).lower() in ('1', 'true', 'yes')
    debug_otp = current_app.config.get('DEBUG', False) or dev_flag

    resp = {"message": "Login successful", "token": token, "role": user.role}
    if debug_otp:
        resp['otp'] = code

    return jsonify(resp)


@auth.route('/request-otp', methods=['POST'])
def request_otp():
    data = request.json or {}
    phone = data.get('phone')
    if not phone:
        return jsonify({'error': 'phone required'}), 400

    user = User.query.filter_by(phone=phone).first()
    if not user:
        return jsonify({'error': 'user not found'}), 404

    # generate 6-digit code
    code = f"{random.randint(0, 999999):06d}"
    expires = datetime.utcnow() + timedelta(minutes=10)
    otp = OTP(user_id=user.id, code=code, expires_at=expires)
    # persist OTP row and update user's otp column so current OTP is always on the user
    user.otp = code
    db.session.add(otp)
    db.session.add(user)
    db.session.commit()

    # For demo convenience return the OTP when in debug or when DEV_SEED env flag is set
    env_dev = os.getenv('DEV_SEED', '')
    dev_flag = str(env_dev).lower() in ('1', 'true', 'yes')
    debug_otp = current_app.config.get('DEBUG', False) or dev_flag
    response = {'message': 'OTP generated'}
    if debug_otp:
        response['otp'] = code
    return jsonify(response)


@auth.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json or {}
    phone = data.get('phone')
    code = data.get('code')
    if not phone or not code:
        return jsonify({'error': 'phone and code required'}), 400

    user = User.query.filter_by(phone=phone).first()
    if not user:
        return jsonify({'error': 'user not found'}), 404

    # find matching, unused OTP not expired
    now = datetime.utcnow()
    otp = OTP.query.filter_by(user_id=user.id, code=code, used=False).filter(OTP.expires_at >= now).first()
    if not otp:
        return jsonify({'error': 'Invalid or expired OTP'}), 400

    otp.used = True
    db.session.commit()

    return jsonify({'message': 'OTP verified'})
