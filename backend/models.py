from datetime import datetime
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

def generate_uid(prefix, id_num):
    return f"{prefix}-{id_num:04d}"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(20), unique=True, index=True)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # 'admin','user','customer'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.String(250))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(20), unique=True, index=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), unique=True)
    address = db.Column(db.String(250))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Purchase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    bag_size = db.Column(db.String(20), nullable=False)  # '1kg','5kg','10kg'
    units = db.Column(db.Integer, nullable=False)
    price_per_unit = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    invoice_image = db.Column(db.String(300))  # path or URL
    date = db.Column(db.DateTime, default=datetime.utcnow)
    supplier = db.relationship('Supplier', backref=db.backref('purchases', lazy=True))

class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    bag_size = db.Column(db.String(20), nullable=False)
    units = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    paid_amount = db.Column(db.Float, default=0.0)
    outstanding = db.Column(db.Float, default=0.0)
    invoice_image = db.Column(db.String(300))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    customer = db.relationship('Customer', backref=db.backref('sales', lazy=True))

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20), nullable=False)  # 'cash','online','expense'
    amount = db.Column(db.Float, nullable=False)
    related_type = db.Column(db.String(30))  # 'sale','purchase','other'
    related_id = db.Column(db.Integer)  # store id of sale or purchase if any
    note = db.Column(db.String(300))
    date = db.Column(db.DateTime, default=datetime.utcnow)

class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50))
    message = db.Column(db.String(500))
    related_type = db.Column(db.String(30))
    related_id = db.Column(db.Integer)
    resolved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
