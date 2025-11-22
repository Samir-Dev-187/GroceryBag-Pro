# backend/populate_demo_with_admin.py
import os
import shutil
from datetime import datetime
from extensions import db
from app import app
from models import Supplier, Customer, Purchase, Sale, Transaction, User

# Demo image path (use this file if present)
DEMO_SRC_IMAGE = r"/mnt/data/5499db14-1698-4ebc-844c-28e46abf4d80.png"

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def copy_demo_image(src_path):
    if not os.path.exists(src_path):
        print("Demo source image not found at:", src_path)
        return None
    base = "invoice_demo_" + datetime.utcnow().strftime("%Y%m%d%H%M%S")
    ext = os.path.splitext(src_path)[1] or ".png"
    dst_name = base + ext
    dst_path = os.path.join(UPLOAD_DIR, dst_name)
    shutil.copy(src_path, dst_path)
    return f"/static/uploads/{dst_name}"

def ensure_user(phone, password, role, name=None):
    user = User.query.filter_by(phone=phone).first()
    if user:
        print(f"User with phone {phone} already exists (uid={user.uid}, role={user.role})")
        return user
    user = User(phone=phone, role=role)
    if name:
        # If you later add a name field, set it; for now models don't have a name on User
        pass
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    # assign UID based on role prefix and id
    prefix = 'AD' if role == 'admin' else 'US' if role == 'user' else 'CU'
    user.uid = f"{prefix}-{user.id:04d}"
    db.session.commit()
    print(f"Created user {user.uid} (phone={phone}, role={role})")
    return user

def seed():
    with app.app_context():
        # 1) Admin user
        admin = ensure_user(phone="9000000000", password="admin123", role="admin")
        # 2) Staff user
        staff = ensure_user(phone="9000000002", password="user123", role="user")
        # 3) Customer (as User or separate Customer model)
        customer_phone = "9000000001"
        customer = Customer.query.filter_by(phone=customer_phone).first()
        if not customer:
            customer = Customer(name="Demo Customer", phone=customer_phone, address="Demo City")
            db.session.add(customer)
            db.session.commit()
            customer.uid = f"CU-{customer.id:04d}"
            db.session.commit()
            print("Created Customer id:", customer.id)
        else:
            print("Customer exists id:", customer.id)

        # 4) Supplier
        supplier_phone = "9999912345"
        supplier = Supplier.query.filter_by(phone=supplier_phone).first()
        if not supplier:
            supplier = Supplier(name="Demo Supplier", phone=supplier_phone, address="Demo address")
            db.session.add(supplier)
            db.session.commit()
            print("Created Supplier id:", supplier.id)
        else:
            print("Supplier exists id:", supplier.id)

        # 5) Copy demo invoice image if available
        invoice_url = copy_demo_image(DEMO_SRC_IMAGE)
        if invoice_url:
            print("Copied demo invoice to:", invoice_url)
        else:
            print("No demo invoice copied; purchases/sales will have invoice_image=None")

        # 6) Purchase (idempotent check by supplier + total_amount + units)
        p_units = 10
        p_price = 40.0
        p_total = p_units * p_price
        existing_purchase = Purchase.query.filter_by(supplier_id=supplier.id, total_amount=p_total, units=p_units).first()
        if not existing_purchase:
            purchase = Purchase(
                supplier_id=supplier.id,
                bag_size="10kg",
                units=p_units,
                price_per_unit=p_price,
                total_amount=p_total,
                invoice_image=invoice_url
            )
            db.session.add(purchase)
            db.session.commit()
            print("Created Purchase id:", purchase.id)
        else:
            purchase = existing_purchase
            print("Purchase already exists id:", purchase.id)

        # 7) Sale (partial payment)
        s_units = 5
        s_price = 100.0
        s_total = s_units * s_price
        s_paid = 300.0  # partial -> outstanding expected
        existing_sale = Sale.query.filter_by(customer_id=customer.id, total_amount=s_total, units=s_units).first()
        if not existing_sale:
            sale = Sale(
                customer_id=customer.id,
                bag_size="10kg",
                units=s_units,
                total_amount=s_total,
                paid_amount=s_paid,
                outstanding=(s_total - s_paid),
                invoice_image=invoice_url
            )
            db.session.add(sale)
            db.session.commit()
            print("Created Sale id:", sale.id)
            # create related transaction
            if s_paid > 0:
                t = Transaction(
                    type="cash",
                    amount=s_paid,
                    related_type="sale",
                    related_id=sale.id,
                    note=f"Partial payment for sale {sale.id} by customer {customer.id}"
                )
                db.session.add(t)
                db.session.commit()
                print("Created Transaction id:", t.id)
        else:
            sale = existing_sale
            print("Sale already exists id:", sale.id)

if __name__ == "__main__":
    seed()
    print("Seeding complete.")
