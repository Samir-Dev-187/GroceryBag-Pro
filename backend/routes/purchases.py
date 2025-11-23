# routes/purchases.py
import os
from flask import Blueprint, request, jsonify, current_app, url_for
from werkzeug.utils import secure_filename
from extensions import db
from models import Purchase, Supplier
from datetime import datetime
import uuid

purchases = Blueprint('purchases', __name__)

# allowed extensions
ALLOWED_EXT = {'png', 'jpg', 'jpeg', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT

# helper to save uploaded file and return relative path
def save_invoice_file(file_storage):
    filename = secure_filename(file_storage.filename)
    ext = filename.rsplit('.', 1)[1].lower()
    # create unique filename
    unique_name = f"invoice_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}.{ext}"
    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    file_path = os.path.join(upload_folder, unique_name)
    file_storage.save(file_path)
    # return path relative to app root (useful to serve via /static/uploads/...)
    return f"/static/uploads/{unique_name}"

@purchases.route('/', methods=['GET'])
def list_purchases():
    # simple list all (later add pagination & filters)
    items = Purchase.query.order_by(Purchase.date.desc()).limit(100).all()
    out = []
    for p in items:
        out.append({
            "id": p.id,
            "supplier_id": p.supplier_id,
            "supplier_name": p.supplier.name if p.supplier else None,
            "bag_size": p.bag_size,
            "units": p.units,
            "price_per_unit": p.price_per_unit,
            "total_amount": p.total_amount,
            "invoice_image": p.invoice_image,
            "date": p.date.isoformat()
        })
    return jsonify(out)

@purchases.route('/', methods=['POST'])
def create_purchase():
    """
    Expects multipart/form-data with fields:
    - supplier_id (int)
    - bag_size (str) e.g. '10kg'
    - units (int)
    - price_per_unit (float)
    - invoice_file (file) optional but recommended
    """
    if 'supplier_id' not in request.form:
        return jsonify({"error":"supplier_id required"}), 400

    raw_supplier = request.form.get('supplier_id')
    supplier = None
    supplier = None
    # support numeric PK or external supplier_id string
    if raw_supplier is None:
        return jsonify({"error":"supplier_id required"}), 400
    raw_supplier = str(raw_supplier).strip()
    if raw_supplier.isdigit():
        supplier = Supplier.query.get(int(raw_supplier))
    else:
        # possible formats: supplier external id like SU-..., or UI prefix like SUP-...
        candidate = raw_supplier
        if candidate.startswith('SUP-'):
            candidate = candidate.replace('SUP-', '')
        # try exact match on supplier_id or name
        supplier = Supplier.query.filter((Supplier.supplier_id == raw_supplier) | (Supplier.supplier_id == candidate) | (Supplier.name == raw_supplier)).first()
    if not supplier:
        return jsonify({"error":"supplier not found"}), 404
    try:
        bag_size = request.form.get('bag_size', '').strip()
        units = int(request.form.get('units', 0))
        price_per_unit = float(request.form.get('price_per_unit', 0.0))
        total_amount = units * price_per_unit

        invoice_image_url = None
        if 'invoice_file' in request.files:
            file = request.files['invoice_file']
            if file and allowed_file(file.filename):
                invoice_image_url = save_invoice_file(file)
            else:
                return jsonify({"error":"Invalid or missing invoice_file. Allowed: png,jpg,jpeg,pdf"}), 400

        # generate purchase external id: P-XX(month+week)-rand4
        now = datetime.utcnow()
        month = now.month
        week = (now.day - 1) // 7 + 1
        rand4 = str(uuid.uuid4().int)[:4]

        purchase = Purchase(
            supplier_id=supplier.supplier_id or str(supplier.id),
            bag_size=bag_size,
            units=units,
            price_per_unit=price_per_unit,
            total_amount=total_amount,
            invoice_image=invoice_image_url
        )

        purchase.purchase_id = f"P-{month:02d}{week}-{rand4}"

        db.session.add(purchase)
        db.session.commit()

        return jsonify({
            "message":"Purchase created",
            "id": purchase.id,
            "purchase_id": purchase.purchase_id,
            "invoice_image": invoice_image_url
        }), 201
    except Exception as ex:
        # Return JSON error to frontend for easier debugging
        return jsonify({'error': 'purchase creation failed', 'detail': str(ex)}), 500


@purchases.route('/<int:purchase_id>', methods=['PUT'])
def update_purchase(purchase_id):
    p = Purchase.query.get(purchase_id)
    if not p:
        return jsonify({'error': 'not found'}), 404
    data = request.form or request.json or {}
    try:
        if 'bag_size' in data:
            p.bag_size = data.get('bag_size')
        if 'units' in data:
            p.units = int(data.get('units', p.units))
        if 'price_per_unit' in data:
            p.price_per_unit = float(data.get('price_per_unit', p.price_per_unit))
        p.total_amount = p.units * p.price_per_unit
        db.session.add(p)
        db.session.commit()
        return jsonify({'message': 'Purchase updated', 'id': p.id, 'purchase_id': p.purchase_id})
    except Exception as ex:
        return jsonify({'error': 'update failed', 'detail': str(ex)}), 400
