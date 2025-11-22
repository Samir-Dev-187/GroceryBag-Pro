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

    try:
        supplier_id = int(request.form.get('supplier_id'))
    except:
        return jsonify({"error":"supplier_id must be integer"}), 400

    supplier = Supplier.query.get(supplier_id)
    if not supplier:
        return jsonify({"error":"supplier not found"}), 404

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

    purchase = Purchase(
        supplier_id=supplier_id,
        bag_size=bag_size,
        units=units,
        price_per_unit=price_per_unit,
        total_amount=total_amount,
        invoice_image=invoice_image_url
    )

    db.session.add(purchase)
    db.session.commit()

    return jsonify({
        "message":"Purchase created",
        "purchase_id": purchase.id,
        "invoice_image": invoice_image_url
    }), 201
