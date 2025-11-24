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

        raw_customer = request.form.get("customer_id")
        if not raw_customer:
            return jsonify({"error": "customer_id required"}), 400
        raw_customer = str(raw_customer).strip()
        customer = None
        if raw_customer.isdigit():
            customer = Customer.query.get(int(raw_customer))
        else:
            candidate = raw_customer
            if candidate.startswith('CU-'):
                candidate = candidate.replace('CU-', '')
            customer = Customer.query.filter((Customer.customer_id == raw_customer) | (Customer.customer_id == candidate) | (Customer.name == raw_customer)).first()
        if not customer:
            return jsonify({"error": "customer not found"}), 404

        try:
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

            now = datetime.utcnow()
            month = now.month
            week = (now.day - 1) // 7 + 1
            rand4 = str(uuid.uuid4().int)[:4]

            sale = Sale(
                customer_id=customer.customer_id or str(customer.id),
                bag_size=bag_size,
                units=units,
                total_amount=total_amount,
                paid_amount=paid_amount,
                outstanding=outstanding,
                invoice_image=invoice_url
            )

            sale.sale_id = f"S-{month:02d}{week}-{rand4}"

            db.session.add(sale)
            db.session.commit()

            # Auto transaction entry only if paid_amount > 0
            if paid_amount > 0:
                t = Transaction(
                    type=payment_type,
                    amount=paid_amount,
                    related_type="sale",
                    related_id=sale.id,
                    note=f"Sale payment by Customer {customer.customer_id}"
                )
                db.session.add(t)
                db.session.commit()

            return jsonify({
                "message": "Sale created",
                "id": sale.id,
                "sale_id": sale.sale_id,
                "total_amount": total_amount,
                "paid_amount": paid_amount,
                "outstanding": outstanding,
                "invoice_image": invoice_url
            })
        except Exception as ex:
            return jsonify({'error': 'sale creation failed', 'detail': str(ex)}), 500


@sales.route('/<int:sale_id>', methods=['PUT'])
def update_sale(sale_id):
        s = Sale.query.get(sale_id)
        if not s:
            return jsonify({'error': 'not found'}), 404
        data = request.form or request.json or {}
        try:
            if 'bag_size' in data:
                s.bag_size = data.get('bag_size')
            if 'units' in data:
                s.units = int(data.get('units', s.units))
            if 'paid_amount' in data:
                s.paid_amount = float(data.get('paid_amount', s.paid_amount))
            s.total_amount = s.units * (s.total_amount / (s.units or 1)) if s.units else s.total_amount
            s.outstanding = s.total_amount - s.paid_amount
            db.session.add(s)
            db.session.commit()
            return jsonify({'message': 'Sale updated', 'id': s.id, 'sale_id': s.sale_id})
        except Exception as ex:
            return jsonify({'error': 'update failed', 'detail': str(ex)}), 400
