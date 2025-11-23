from flask import Blueprint, request, jsonify
from extensions import db
from models import Customer
import random
import datetime

customers = Blueprint('customers', __name__)


@customers.route('/', methods=['GET'])
def list_customers():
    items = Customer.query.order_by(Customer.created_at.desc()).all()
    out = []
    for c in items:
        out.append({
            'id': c.id,
            'customer_id': c.customer_id,
            'uid': c.uid,
            'name': c.name,
            'phone': c.phone,
            'address': c.address,
            'created_at': c.created_at.isoformat()
        })
    return jsonify(out)


@customers.route('/', methods=['POST'])
def create_customer():
    data = request.form or request.json or {}
    name = data.get('name')
    phone = data.get('phone')
    address = data.get('address')

    if not name or not phone:
        return jsonify({'error': 'name and phone required'}), 400

    existing = Customer.query.filter_by(phone=phone).first()
    if existing:
        return jsonify({'error': 'phone already exists', 'customer_id': existing.id}), 400

    c = Customer(name=name, phone=phone, address=address)
    # generate customer external id per requested format
    try:
        names = name.strip().split()
        first = names[0] if names else ''
        last = names[-1] if len(names) > 1 else ''
        x6 = datetime.datetime.utcnow().strftime('%y%m%d')
        rand4 = str(random.randint(1000, 9999))
        ascii_sum = sum(ord(ch) for ch in (first + last)) % 10000
        ext = f"CU-{x6}-{first}{last}{rand4}-{ascii_sum:04d}"
        c.customer_id = ext
    except Exception:
        c.customer_id = None

    db.session.add(c)
    db.session.commit()
    c.uid = f"CU-{c.id:04d}"
    db.session.add(c)
    db.session.commit()
    return jsonify({'message': 'Customer created', 'id': c.id, 'customer_id': c.customer_id, 'uid': c.uid}), 201


@customers.route('/<int:cust_id>', methods=['GET'])
def get_customer(cust_id):
    c = Customer.query.get(cust_id)
    if not c:
        return jsonify({'error': 'not found'}), 404
    return jsonify({'id': c.id, 'customer_id': c.customer_id, 'uid': c.uid, 'name': c.name, 'phone': c.phone, 'address': c.address})


@customers.route('/<int:cust_id>', methods=['PUT'])
def update_customer(cust_id):
    c = Customer.query.get(cust_id)
    if not c:
        return jsonify({'error': 'not found'}), 404
    data = request.form or request.json or {}
    c.name = data.get('name', c.name)
    c.phone = data.get('phone', c.phone)
    c.address = data.get('address', c.address)
    db.session.add(c)
    db.session.commit()
    return jsonify({'message': 'Customer updated', 'id': c.id, 'customer_id': c.customer_id})
