"""Create a fresh demo DB and populate 5 rows in each table.

This script will:
- backup existing `grocerybag.db` to `grocerybag.db.bak.<ts>` if present
- create a new `demo.db` in the instance folder
- create tables and insert 5 sample rows into each model/table

Run from repository root with the project's venv Python.
"""
import os
import shutil
from datetime import datetime, timedelta

from app import app
from extensions import db
from models import User, Customer, Supplier, Purchase, Sale, Transaction, Alert, OTP


def backup_old_db(inst_path):
    old = os.path.join(inst_path, 'grocerybag.db')
    if os.path.exists(old):
        ts = datetime.utcnow().strftime('%Y%m%d%H%M%S')
        bak = old + f'.bak.{ts}'
        shutil.copy(old, bak)
        print('Backed up', old, '->', bak)
        try:
            os.remove(old)
            print('Removed original', old)
        except Exception as e:
            print('Could not remove original:', e)


def populate():
    inst = app.instance_path
    os.makedirs(inst, exist_ok=True)

    # backup existing grocerybag.db then remove it
    backup_old_db(inst)

    # ensure tables are created on demo.db (app is already configured to use demo.db)
    with app.app_context():
        print('Creating tables...')
        db.create_all()

        # clear any existing rows just in case
        db.session.query(OTP).delete()
        db.session.query(Alert).delete()
        db.session.query(Transaction).delete()
        db.session.query(Sale).delete()
        db.session.query(Purchase).delete()
        db.session.query(Customer).delete()
        db.session.query(Supplier).delete()
        db.session.query(User).delete()
        db.session.commit()

        users = []
        for i in range(1, 6):
            phone = f'90000000{10+i}'
            role = 'admin' if i == 1 else 'user' if i == 2 else 'customer'
            u = User(phone=phone, role=role)
            u.set_password('Passw0rd!')
            db.session.add(u)
            users.append(u)
        db.session.commit()
        for u in users:
            prefix = 'AD' if u.role == 'admin' else 'US' if u.role == 'user' else 'CU'
            u.uid = f"{prefix}-{u.id:04d}"
        db.session.commit()

        customers = []
        for i in range(1, 6):
            c = Customer(name=f'Demo Customer {i}', phone=f'9001000{i:02d}', address=f'City {i}')
            db.session.add(c)
            customers.append(c)
        db.session.commit()
        for c in customers:
            c.uid = f"CU-{c.id:04d}"
        db.session.commit()

        suppliers = []
        for i in range(1, 6):
            s = Supplier(name=f'Demo Supplier {i}', phone=f'9992000{i:02d}', address=f'Street {i}')
            db.session.add(s)
            suppliers.append(s)
        db.session.commit()

        # purchases (link to suppliers)
        purchases = []
        for i, s in enumerate(suppliers, start=1):
            p = Purchase(supplier_id=s.id, bag_size='10kg', units=10+i, price_per_unit=50.0 + i, total_amount=(10+i)*(50.0+i))
            db.session.add(p)
            purchases.append(p)
        db.session.commit()

        # sales (link to customers)
        sales = []
        for i, c in enumerate(customers, start=1):
            total = (5 + i) * (80.0 + i)
            paid = total if i % 2 == 0 else total / 2
            s = Sale(customer_id=c.id, bag_size='5kg', units=5 + i, total_amount=total, paid_amount=paid, outstanding=(total - paid))
            db.session.add(s)
            sales.append(s)
        db.session.commit()

        # transactions
        transactions = []
        for i, s in enumerate(sales, start=1):
            t = Transaction(type='cash', amount=s.paid_amount, related_type='sale', related_id=s.id, note=f'Payment for sale {s.id}')
            db.session.add(t)
            transactions.append(t)
        db.session.commit()

        # alerts
        for i in range(1, 6):
            a = Alert(type='info', message=f'Test alert {i}', related_type='other', related_id=None)
            db.session.add(a)
        db.session.commit()

        # otps (for first user)
        now = datetime.utcnow()
        for i in range(1, 6):
            otp = OTP(user_id=users[0].id, code=f'{100000 + i}', used=False, expires_at=now + timedelta(minutes=30))
            db.session.add(otp)
        db.session.commit()

        print('Inserted sample rows:')
        print(' Users:', User.query.count())
        print(' Customers:', Customer.query.count())
        print(' Suppliers:', Supplier.query.count())
        print(' Purchases:', Purchase.query.count())
        print(' Sales:', Sale.query.count())
        print(' Transactions:', Transaction.query.count())
        print(' Alerts:', Alert.query.count())
        print(' OTPs:', OTP.query.count())


if __name__ == '__main__':
    populate()
