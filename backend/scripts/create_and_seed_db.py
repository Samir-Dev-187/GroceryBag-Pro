"""Create and seed a fresh SQLite DB at ./data/grocerybag.db

- Deletes existing data/grocerybag.db (if exists)
- Creates normalized schema per user spec
- Inserts dev sample rows (plaintext passwords, flagged)
- Imports purchases from /mnt/data/Book1.xlsx if present
- Writes a short summary at the end

Run: python backend/scripts/create_and_seed_db.py
"""
import os
import sqlite3
from datetime import datetime
import shutil
import csv

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATA_DIR = os.path.join(ROOT, '..', 'data')  # repo-root/data
DB_PATH = os.path.join(DATA_DIR, 'grocerybag.db')
EXCEL_PATH = os.path.join(os.sep, 'mnt', 'data', 'Book1.xlsx')

os.makedirs(DATA_DIR, exist_ok=True)

# If DB exists, remove it
if os.path.exists(DB_PATH):
    bak = DB_PATH + '.bak'
    print(f"Backing up existing DB {DB_PATH} -> {bak}")
    shutil.move(DB_PATH, bak)

# Connect (will create)
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Enable foreign keys
cur.execute('PRAGMA foreign_keys = ON;')

# Create schema
schema_sql = r'''
BEGIN;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT UNIQUE,
    role TEXT CHECK(role IN ('admin','user','customer')),
    full_name TEXT,
    phone TEXT,
    email TEXT,
    password TEXT,
    gov_id_type TEXT,
    gov_id_number TEXT,
    note TEXT,
    created_at DATETIME
);

CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id TEXT UNIQUE,
    name TEXT,
    phone TEXT,
    email TEXT,
    outstanding REAL DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    created_at DATETIME
);

CREATE TABLE suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id TEXT UNIQUE,
    name TEXT,
    phone TEXT,
    created_at DATETIME
);

CREATE TABLE purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_id TEXT UNIQUE,
    date DATETIME,
    supplier_id TEXT,
    total_amount REAL,
    payment_mode TEXT,
    invoice_photo TEXT,
    created_by_uid TEXT,
    created_at DATETIME,
    FOREIGN KEY(supplier_id) REFERENCES suppliers(supplier_id)
);

CREATE TABLE purchase_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_id INTEGER,
    bag_size_kg INTEGER,
    units INTEGER,
    unit_price REAL,
    line_total REAL,
    FOREIGN KEY(purchase_id) REFERENCES purchases(id) ON DELETE CASCADE
);

CREATE TABLE sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id TEXT UNIQUE,
    date DATETIME,
    customer_id TEXT,
    total_amount REAL,
    payment_received REAL,
    due_amount REAL,
    created_by_uid TEXT,
    created_at DATETIME,
    FOREIGN KEY(customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER,
    bag_size_kg INTEGER,
    units INTEGER,
    unit_price REAL,
    line_total REAL,
    FOREIGN KEY(sale_id) REFERENCES sales(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    txn_id TEXT UNIQUE,
    date DATETIME,
    type TEXT CHECK(type IN ('income','expense')),
    amount REAL,
    mode TEXT CHECK(mode IN ('cash','online')),
    source TEXT,
    ref_id TEXT,
    created_by_uid TEXT,
    created_at DATETIME
);

CREATE TABLE alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_type TEXT,
    severity TEXT,
    message TEXT,
    related_ref TEXT,
    created_at DATETIME,
    resolved BOOLEAN DEFAULT 0
);

COMMIT;
'''

cur.executescript(schema_sql)
conn.commit()
print('Schema created')

# helper for UID generation per rule
from random import randint

def gen_uid(prefix, name, month, n):
    # XXX = first 3 letters of (firstName+lastName) uppercase padded with X
    merged = ''.join(name.split())[:3].upper()
    merged = (merged + 'XXX')[:3]
    mm = f"{month:02d}"
    return f"{prefix}-{merged}{mm}-{n:04d}-{randint(10,99)}"

now = datetime(2025, 11, 23, 12, 0, 0)

# Seed users (plaintext passwords, note='DEV_PLAINTEXT')
users = [
    ("AD-MAD11-4829-11","admin","Madan Sau","+919900000001","madan@example.com","Admin@1234"),
    ("US-SAN11-4829-22","user","Sanjay Roy","+919900000002","sanjay@example.com","User@1234"),
    ("US-ASH11-4829-33","user","Asha Sen","+919900000003","asha@example.com","UserAsha1!"),
    ("CU-RAM11-4829-44","customer","Ramesh Das","+919900000004","ramesh@example.com","Cust#2025"),
    ("CU-NEH11-4829-55","customer","Neha Gupta","+919900000005","neha@example.com","Neha!2025"),
]

for uid, role, full_name, phone, email, pwd in users:
    cur.execute('INSERT INTO users (uid, role, full_name, phone, email, password, note, created_at) VALUES (?,?,?,?,?,?,?,?)',
                (uid, role, full_name, phone, email, pwd, 'DEV_PLAINTEXT', now.isoformat()))

# Seed customers (map two customers from users)
customers = [
    ("CU-RAM11-4829-44","Ramesh Das","+919900000004","ramesh@example.com",1200,5),
    ("CU-NEH11-4829-55","Neha Gupta","+919900000005","neha@example.com",0,2),
    ("CU-AAA11-4829-66","Anil Agar","+919900000006","anil@example.com",450,3),
    ("CU-BBB11-4829-77","Bina Roy","+919900000007","bina@example.com",800,8),
    ("CU-CCC11-4829-88","Chirag Sax","+919900000008","chirag@example.com",0,1),
]
for cid,name,phone,email,outstanding,orders in customers:
    cur.execute('INSERT INTO customers (customer_id, name, phone, email, outstanding, total_orders, created_at) VALUES (?,?,?,?,?,?,?)',
                (cid,name,phone,email,outstanding,orders, now.isoformat()))

# Seed suppliers
suppliers = [
    ("SUP-MAR11-4829-01","Market A","+919811000001"),
    ("SUP-MAR11-4829-02","Market B","+919811000002"),
    ("SUP-WHO11-4829-03","Wholesale X","+919811000003"),
    ("SUP-WHO11-4829-04","Wholesale Y","+919811000004"),
    ("SUP-MAR11-4829-05","Market C","+919811000005"),
]
for sid,name,phone in suppliers:
    cur.execute('INSERT INTO suppliers (supplier_id, name, phone, created_at) VALUES (?,?,?,?)', (sid,name,phone, now.isoformat()))

# Seed purchases + items (5)
purchase_examples = [
    ("PUR-0001", "SUP-MAR11-4829-01", "2025-10-01T10:00:00", 5000.0, 'cash', '/dev/invoices/p001.jpg', 'AD-MAD11-4829-11', [ (1,10,40.0), (5,5,180.0) ]),
    ("PUR-0002", "SUP-MAR11-4829-02", "2025-10-05T11:00:00", 2500.0, 'online', None, 'US-SAN11-4829-22', [ (10,2,120.0) ]),
    ("PUR-0003", "SUP-WHO11-4829-03", "2025-10-10T09:30:00", 7200.0, 'cash', '/dev/invoices/p003.jpg', 'US-ASH11-4829-33', [ (25,4,700.0) ]),
    ("PUR-0004", "SUP-WHO11-4829-04", "2025-11-01T14:20:00", 1500.0, 'cash', None, 'AD-MAD11-4829-11', [ (1,10,150.0) ]),
    ("PUR-0005", "SUP-MAR11-4829-05", "2025-11-15T16:45:00", 3300.0, 'online', '/dev/invoices/p005.jpg', 'US-SAN11-4829-22', [ (5,10,33.0) ]),
]
for pid,supp,date,total,mode,inv,creator, items in purchase_examples:
    cur.execute('INSERT INTO purchases (purchase_id, date, supplier_id, total_amount, payment_mode, invoice_photo, created_by_uid, created_at) VALUES (?,?,?,?,?,?,?,?)',
                (pid, date, supp, total, mode, inv, creator, now.isoformat()))
    p_rowid = cur.lastrowid
    for bag_size, units, unit_price in items:
        line = units * unit_price
        cur.execute('INSERT INTO purchase_items (purchase_id, bag_size_kg, units, unit_price, line_total) VALUES (?,?,?,?,?)',
                    (p_rowid, bag_size, units, unit_price, line))

# Seed sales + sale_items
sale_examples = [
    ("SAL-0001", "2025-11-05T10:00:00", "CU-RAM11-4829-44", 2000.0, 2000.0, 0.0, 'US-SAN11-4829-22', [(5,10,40.0)]),
    ("SAL-0002", "2025-11-07T12:00:00", "CU-NEH11-4829-55", 1500.0, 500.0, 1000.0, 'US-ASH11-4829-33', [(10,5,30.0)]),
    ("SAL-0003", "2025-11-10T09:00:00", "CU-AAA11-4829-66", 800.0, 0.0, 800.0, 'AD-MAD11-4829-11', [(1,8,100.0)]),
    ("SAL-0004", "2025-11-12T15:30:00", "CU-BBB11-4829-77", 1200.0, 1200.0, 0.0, 'US-SAN11-4829-22', [(5,20,60.0)]),
    ("SAL-0005", "2025-11-18T11:20:00", "CU-CCC11-4829-88", 450.0, 200.0, 250.0, 'US-ASH11-4829-33', [(1,5,90.0)]),
]
for sid,date,cust,total,paid,due,creator, items in sale_examples:
    cur.execute('INSERT INTO sales (sale_id, date, customer_id, total_amount, payment_received, due_amount, created_by_uid, created_at) VALUES (?,?,?,?,?,?,?,?)',
                (sid, date, cust, total, paid, due, creator, now.isoformat()))
    s_rowid = cur.lastrowid
    for bag_size, units, unit_price in items:
        line = units * unit_price
        cur.execute('INSERT INTO sale_items (sale_id, bag_size_kg, units, unit_price, line_total) VALUES (?,?,?,?,?)',
                    (s_rowid, bag_size, units, unit_price, line))

# Seed transactions (5)
transactions = [
    ("TXN-0001","2025-11-05T10:05:00","income",2000.0,'cash','sale','SAL-0001','US-SAN11-4829-22'),
    ("TXN-0002","2025-11-07T12:10:00","income",500.0,'online','sale','SAL-0002','US-ASH11-4829-33'),
    ("TXN-0003","2025-11-01T14:25:00","expense",1500.0,'cash','purchase','PUR-0004','AD-MAD11-4829-11'),
    ("TXN-0004","2025-11-15T16:50:00","income",3300.0,'online','purchase','PUR-0005','US-SAN11-4829-22'),
    ("TXN-0005","2025-11-10T09:15:00","income",800.0,'cash','sale','SAL-0003','AD-MAD11-4829-11'),
]
for txn in transactions:
    cur.execute('INSERT INTO transactions (txn_id, date, type, amount, mode, source, ref_id, created_by_uid, created_at) VALUES (?,?,?,?,?,?,?,?,?)', txn + (now.isoformat(),))

# Alerts (missing invoice for PUR-0004 and high outstanding)
cur.execute('INSERT INTO alerts (alert_type, severity, message, related_ref, created_at, resolved) VALUES (?,?,?,?,?,?)',
            ('missingInvoice','high','Purchase PUR-0004 is missing an invoice','PUR-0004', now.isoformat(), 0))
cur.execute('INSERT INTO alerts (alert_type, severity, message, related_ref, created_at, resolved) VALUES (?,?,?,?,?,?)',
            ('highOutstanding','medium','Customer CU-RAM11-4829-44 has outstanding > 1000','CU-RAM11-4829-44', now.isoformat(), 0))

conn.commit()
print('Seeded dev data into', DB_PATH)

# Import Excel purchases if present
try:
    import openpyxl
    if os.path.exists(EXCEL_PATH):
        print('Found Excel file, importing purchases from', EXCEL_PATH)
        wb = openpyxl.load_workbook(EXCEL_PATH)
        ws = wb.active
        # Expect columns: Date, Supplier, BagSizeKg, Units, UnitPrice, InvoicePhotoPath
        rows = list(ws.iter_rows(values_only=True))
        headers = [h for h in rows[0]]
        col_map = {k: headers.index(k) for k in headers}
        for row in rows[1:]:
            try:
                date = row[col_map['Date']]
                supplier_name = row[col_map['Supplier']]
                bagkg = int(row[col_map['BagSizeKg']])
                units = int(row[col_map['Units']])
                unitprice = float(row[col_map['UnitPrice']])
                invoice = row[col_map.get('InvoicePhotoPath')] if 'InvoicePhotoPath' in col_map else None
            except Exception as e:
                print('Skipping row, malformed:', e)
                continue
            # match supplier
            cur.execute('SELECT supplier_id FROM suppliers WHERE name = ?', (supplier_name,))
            r = cur.fetchone()
            if r:
                supplier_id = r[0]
            else:
                # create supplier
                supplier_id = f"SUP-IMP-{randint(1000,9999)}"
                cur.execute('INSERT INTO suppliers (supplier_id, name, phone, created_at) VALUES (?,?,?,?)', (supplier_id, supplier_name, '', now.isoformat()))
            total = units * unitprice
            purchase_id = f"IMP-{randint(10000,99999)}"
            cur.execute('INSERT INTO purchases (purchase_id, date, supplier_id, total_amount, payment_mode, invoice_photo, created_by_uid, created_at) VALUES (?,?,?,?,?,?,?,?)',
                        (purchase_id, date.isoformat() if hasattr(date,'isoformat') else str(date), supplier_id, total, 'cash', invoice, 'AD-MAD11-4829-11', now.isoformat()))
            p_rowid = cur.lastrowid
            cur.execute('INSERT INTO purchase_items (purchase_id, bag_size_kg, units, unit_price, line_total) VALUES (?,?,?,?,?)',
                        (p_rowid, bagkg, units, unitprice, units*unitprice))
        conn.commit()
        print('Excel import complete')
    else:
        print('Excel file not found at', EXCEL_PATH)
except Exception as e:
    print('openpyxl not available or error importing Excel:', e)

# close
conn.close()

# Write .env update helper instructions
env_path = os.path.join(ROOT, '.env')
abs_db = os.path.abspath(DB_PATH)
print('\nTo use the new DB, set in backend/.env:')
print(f'DATABASE_URL=sqlite:///{abs_db}')
print("Also set DEV_SEED=true to avoid accidental reseed in production")

