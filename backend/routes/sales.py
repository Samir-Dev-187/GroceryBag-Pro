from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from extensions import db
from models import Sale, Customer, Transaction
from datetime import datetime
import uuid
import os

sales = Blueprint('sales', __name__)

ALLOWED_EXT = {'png', 'jpg', 'jpeg', 'pdf'}

def allowed_file(name):
    return '.' in name and name.rsplit('.', 1)[1].lower() in ALLOWED_EXT

def save_invoice(file):
    filename = secure_filename(file.filename)
    ext = filename.rsplit('.', 1)[1].lower()
    new_name = f"sale_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:6]}.{ext}"

    folder = os.path.join(current_app.root_path, "static", "uploads")
    os.makedirs(folder, exist_ok=True)

    path = os.path.join(folder, new_name)
    file.save(path)

    return "/static/uploads/" + new_name


@sales.route('/', methods=['POST'])
def create_sale():
    """
    multipart/form-data:

    customer_id
    bag_size
    units
    price_per_unit
    paid_amount
    payment_type (cash/online)
    invoice_file (optional)
    """

    customer_id = request.form.get("customer_id")
    if not customer_id:
        return jsonify({"error": "customer_id required"}), 400

    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({"error": "customer not found"}), 404

    bag_size = request.form.get("bag_size")
    units = int(request.form.get("units", 0))
    price_per_unit = float(request.form.get("price_per_unit", 0))
    total_amount = units * price_per_unit

    paid_amount = float(request.form.get("paid_amount", 0))
    outstanding = total_amount - paid_amount

    payment_type = request.form.get("payment_type", "cash")

    invoice_url = None
    if "invoice_file" in request.files:
        file = request.files["invoice_file"]
        if file and allowed_file(file.filename):
            invoice_url = save_invoice(file)

    sale = Sale(
        customer_id=customer_id,
        bag_size=bag_size,
        units=units,
        total_amount=total_amount,
        paid_amount=paid_amount,
        outstanding=outstanding,
        invoice_image=invoice_url
    )

    db.session.add(sale)
    db.session.commit()

    # Auto transaction entry only if paid_amount > 0
    if paid_amount > 0:
        t = Transaction(
            type=payment_type,
            amount=paid_amount,
            related_type="sale",
            related_id=sale.id,
            note=f"Sale payment by Customer {customer_id}"
        )
        db.session.add(t)
        db.session.commit()

    return jsonify({
        "message": "Sale created",
        "sale_id": sale.id,
        "total_amount": total_amount,
        "paid_amount": paid_amount,
        "outstanding": outstanding,
        "invoice_image": invoice_url
    })
