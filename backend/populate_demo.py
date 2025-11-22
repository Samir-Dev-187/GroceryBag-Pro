# backend/populate_demo.py
import os
import shutil
from datetime import datetime
from extensions import db
from app import app
from models import Supplier, Customer, Purchase, Sale, Transaction

# === CONFIG ===
# Source demo image uploaded earlier (ChatGPT environment path available to you)
SRC_IMAGE = r"/mnt/data/5499db14-1698-4ebc-844c-28e46abf4d80.png"
# NOTE: on your Windows PC use some local image path if that file is not present;
# but since you uploaded file earlier, this path will be used by the script to copy into backend/static/uploads.

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def copy_demo_image(src_path):
    # If src not found, skip copying and return None
    if not os.path.exists(src_path):
        print("Demo source image not found at:", src_path)
        return None
    base = "invoice_demo_" + datetime.utcnow().strftime("%Y%m%d%H%M%S")
    ext = os.path.splitext(src_path)[1] or ".png"
    dst_name = base + ext
    dst_path = os.path.join(UPLOAD_DIR, dst_name)
    shutil.copy(src_path, dst_path)
    # return URL path served by Flask static
    return f"/static/uploads/{dst_name}"

def seed():
    with app.app_context():
        # 1) Supplier (idempotent by phone)
        supplier_phone = "9999912345"
        supplier = Supplier.query.filter_by(phone=supplier_phone).first()
        if not supplier:
            supplier = Supplier(name="Demo Supplier", phone=supplier_phone, address="Demo address")
            db.session.add(supplier)
            db.session.commit()
            print("Created Supplier id:", supplier.id)
        else:
            print("Supplier exists id:", supplier.id)

        # 2) Customer
        customer_phone = "9000000001"
        customer = Customer.query.filter_by(phone=customer_phone).first()
        if not customer:
            customer = Customer(name="Demo Customer", phone=customer_phone, address="Demo City")
            db.session.add(customer)
            db.session.commit()
            print("Created Customer id:", customer.id)
        else:
            print("Customer exists id:", customer.id)

        # 3) Copy demo image (if available)
        invoice_url = copy_demo_image(SRC_IMAGE)
        if invoice_url:
            print("Copied demo invoice to:", invoice_url)
        else:
            print("No demo image copied - continuing without invoice image.")

        # 4) Purchase (if not duplicate)
        # We'll check duplicate by supplier + total_amount + date within same day
        p_total = 10 * 40.0  # 10 units * 40 per unit example
        existing_purchase = Purchase.query.filter_by(
            supplier_id=supplier.id, total_amount=p_total
        ).first()
        if not existing_purchase:
            purchase = Purchase(
                supplier_id=supplier.id,
                bag_size="10kg",
                units=10,
                price_per_unit=40.0,
                total_amount=p_total,
                invoice_image=invoice_url
            )
            db.session.add(purchase)
            db.session.commit()
            print("Created Purchase id:", purchase.id)
        else:
            purchase = existing_purchase
            print("Purchase already exists id:", purchase.id)

        # 5) Sale (partial payment)
        s_total = 5 * 100.0  # 5 units * 100
        paid_amount = 300.0
        existing_sale = Sale.query.filter_by(
            customer_id=customer.id, total_amount=s_total
        ).first()
        if not existing_sale:
            sale = Sale(
                customer_id=customer.id,
                bag_size="10kg",
                units=5,
                total_amount=s_total,
                paid_amount=paid_amount,
                outstanding=(s_total - paid_amount),
                invoice_image=invoice_url
            )
            db.session.add(sale)
            db.session.commit()
            print("Created Sale id:", sale.id)
            # 6) Transaction for paid part
            if paid_amount > 0:
                t = Transaction(
                    type="cash",
                    amount=paid_amount,
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
    print("Done seeding demo data.")
