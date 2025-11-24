# backend/fix_add_columns.py
import sqlite3, os

# canonical DB path used by your app
db = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'grocerybag.db'))

def has_column(conn, table, col):
    cur = conn.cursor()
    cur.execute(f"PRAGMA table_info('{table}')")
    cols = [r[1] for r in cur.fetchall()]
    return col in cols

def add_column(conn, table, col_def):
    cur = conn.cursor()
    cur.execute(f"ALTER TABLE {table} ADD COLUMN {col_def}")
    conn.commit()

print("DB_FILE:", db)
conn = sqlite3.connect(db)
try:
    # suppliers.address
    if not has_column(conn, 'suppliers', 'address'):
        print("Adding column suppliers.address (TEXT)...")
        add_column(conn, 'suppliers', "address TEXT")
        print("Added suppliers.address")
    else:
        print("suppliers.address already exists")

    # customers.customer_id and customers.uid and customers.address (if missing)
    if not has_column(conn, 'customers', 'customer_id'):
        print("Adding column customers.customer_id (VARCHAR(100))...")
        add_column(conn, 'customers', "customer_id VARCHAR(100)")
        print("Added customers.customer_id")
    else:
        print("customers.customer_id already exists")

    if not has_column(conn, 'customers', 'uid'):
        print("Adding column customers.uid (VARCHAR(20))...")
        add_column(conn, 'customers', "uid VARCHAR(20)")
        print("Added customers.uid")
    else:
        print("customers.uid already exists")

    if not has_column(conn, 'customers', 'address'):
        print("Adding column customers.address (TEXT)...")
        add_column(conn, 'customers', "address TEXT")
        print("Added customers.address")
    else:
        print("customers.address already exists")

    # purchases.purchase_id
    if not has_column(conn, 'purchases', 'purchase_id'):
        print("Adding column purchases.purchase_id (VARCHAR(100))...")
        add_column(conn, 'purchases', "purchase_id VARCHAR(100)")
        print("Added purchases.purchase_id")
    else:
        print("purchases.purchase_id already exists")

    # sales.sale_id
    if not has_column(conn, 'sales', 'sale_id'):
        print("Adding column sales.sale_id (VARCHAR(100))...")
        add_column(conn, 'sales', "sale_id VARCHAR(100)")
        print("Added sales.sale_id")
    else:
        print("sales.sale_id already exists")

finally:
    conn.close()
    print("Done")
