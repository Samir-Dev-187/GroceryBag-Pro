from datetime import datetime
from extensions import db

def generate_uid(prefix, id_num):
    return f"{prefix}-{id_num:04d}"

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(20), unique=True, index=True)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    otp = db.Column(db.String(10), nullable=True)
    role = db.Column(db.String(10), nullable=False)  # 'admin','user','customer'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        # Dev-only: store plaintext password
        self.password = password

    def check_password(self, password):
        return self.password == password

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.String(50), unique=True, index=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.String(250))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Customer(db.Model):
    __tablename__ = 'customers'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.String(50), unique=True, index=True)
    uid = db.Column(db.String(20), unique=True, index=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), unique=True)
    address = db.Column(db.String(250))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Purchase(db.Model):
    __tablename__ = 'purchases'
    purchase_id = db.Column(db.String(50), unique=True, index=True)
    id = db.Column(db.Integer, primary_key=True)
    # seeded DB stores supplier_id as the supplier's external id string (supplier_id)
    supplier_id = db.Column(db.String(80), db.ForeignKey('suppliers.supplier_id'), nullable=False)
    bag_size = db.Column(db.String(20), nullable=False)  # '1kg','5kg','10kg'
    units = db.Column(db.Integer, nullable=False)
    price_per_unit = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    invoice_image = db.Column(db.String(300))  # path or URL
    date = db.Column(db.DateTime, default=datetime.utcnow)
    supplier = db.relationship('Supplier', primaryjoin="Supplier.supplier_id==Purchase.supplier_id", backref=db.backref('purchases', lazy=True))

class Sale(db.Model):
    __tablename__ = 'sales'
    sale_id = db.Column(db.String(50), unique=True, index=True)
    id = db.Column(db.Integer, primary_key=True)
    # seeded DB stores customer_id as the customer's external id string (customer_id)
    customer_id = db.Column(db.String(80), db.ForeignKey('customers.customer_id'), nullable=False)
    bag_size = db.Column(db.String(20), nullable=False)
    units = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    paid_amount = db.Column(db.Float, default=0.0)
    outstanding = db.Column(db.Float, default=0.0)
    invoice_image = db.Column(db.String(300))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    customer = db.relationship('Customer', primaryjoin="Customer.customer_id==Sale.customer_id", backref=db.backref('sales', lazy=True))

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20), nullable=False)  # 'cash','online','expense'
    amount = db.Column(db.Float, nullable=False)
    related_type = db.Column(db.String(30))  # 'sale','purchase','other'
    related_id = db.Column(db.Integer)  # store id of sale or purchase if any
    note = db.Column(db.String(300))
    date = db.Column(db.DateTime, default=datetime.utcnow)

class Alert(db.Model):
    __tablename__ = 'alerts'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50))
    message = db.Column(db.String(500))
    related_type = db.Column(db.String(30))
    related_id = db.Column(db.Integer)
    resolved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class OTP(db.Model):
    __tablename__ = 'otp'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    code = db.Column(db.String(10), nullable=False)
    used = db.Column(db.Boolean, default=False)
    expires_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('otps', lazy=True))
