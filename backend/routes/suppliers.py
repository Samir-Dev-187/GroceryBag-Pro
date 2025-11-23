from flask import Blueprint, request, jsonify
from extensions import db
from models import Supplier
import random
import datetime

suppliers = Blueprint('suppliers', __name__)


@suppliers.route('/', methods=['GET'])
def list_suppliers():
    items = Supplier.query.order_by(Supplier.created_at.desc()).all()
    out = []
    for s in items:
        out.append({
            'id': s.id,
            'supplier_id': s.supplier_id,
            'name': s.name,
            'phone': s.phone,
            'address': s.address,
            'created_at': s.created_at.isoformat()
        })
    return jsonify(out)


@suppliers.route('/', methods=['POST'])
def create_supplier():
    data = request.form or request.json or {}
    name = data.get('name')
    phone = data.get('phone')
    address = data.get('address')

    if not name:
        return jsonify({'error': 'name required'}), 400

    s = Supplier(name=name, phone=phone, address=address)
    # generate supplier external id per requested format
    try:
        names = name.strip().split()
        first = names[0] if names else ''
        last = names[-1] if len(names) > 1 else ''
        # XXXXXX -> date YYMMDD
        x6 = datetime.datetime.utcnow().strftime('%y%m%d')
        rand4 = str(random.randint(1000, 9999))
        ascii_sum = sum(ord(c) for c in (first + last)) % 10000
        ext = f"SU-{x6}-{first}{last}{rand4}-{ascii_sum:04d}"
        s.supplier_id = ext
    except Exception:
        s.supplier_id = None

    db.session.add(s)
    db.session.commit()
    return jsonify({'message': 'Supplier created', 'id': s.id, 'supplier_id': s.supplier_id}), 201


@suppliers.route('/<int:supp_id>', methods=['GET'])
def get_supplier(supp_id):
    s = Supplier.query.get(supp_id)
    if not s:
        return jsonify({'error': 'not found'}), 404
    return jsonify({'id': s.id, 'supplier_id': s.supplier_id, 'name': s.name, 'phone': s.phone, 'address': s.address})


@suppliers.route('/<int:supp_id>', methods=['PUT'])
def update_supplier(supp_id):
    s = Supplier.query.get(supp_id)
    if not s:
        return jsonify({'error': 'not found'}), 404
    data = request.form or request.json or {}
    s.name = data.get('name', s.name)
    s.phone = data.get('phone', s.phone)
    s.address = data.get('address', s.address)
    db.session.add(s)
    db.session.commit()
    return jsonify({'message': 'Supplier updated', 'id': s.id, 'supplier_id': s.supplier_id})
