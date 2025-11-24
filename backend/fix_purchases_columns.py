# fix_purchases_columns.py
import sqlite3, os

db = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'grocerybag.db'))

def has_column(conn, table, col):
    cur = conn.cursor()
    cur.execute(f"PRAGMA table_info('{table}')")
    cols = [r[1] for r in cur.fetchall()]
    return col in cols

def add_column(conn, table, column_def):
    cur = conn.cursor()
    cur.execute(f"ALTER TABLE {table} ADD COLUMN {column_def}")
    conn.commit()

print("DB_FILE:", db)
conn = sqlite3.connect(db)

try:
    if not has_column(conn, 'purchases', 'bag_size'):
        print("Adding purchases.bag_size ...")
        add_column(conn, 'purchases', 'bag_size TEXT')

    if not has_column(conn, 'purchases', 'units'):
        print("Adding purchases.units ...")
        add_column(conn, 'purchases', 'units INTEGER')

    if not has_column(conn, 'purchases', 'price_per_unit'):
        print("Adding purchases.price_per_unit ...")
        add_column(conn, 'purchases', 'price_per_unit REAL')

    if not has_column(conn, 'purchases', 'total_amount'):
        print("Adding purchases.total_amount ...")
        add_column(conn, 'purchases', 'total_amount REAL')

    if not has_column(conn, 'purchases', 'invoice_image'):
        print("Adding purchases.invoice_image ...")
        add_column(conn, 'purchases', 'invoice_image TEXT')

    print("DONE")
finally:
    conn.close()
