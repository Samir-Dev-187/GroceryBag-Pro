# fix_sales_columns.py
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

print('DB_FILE:', db)
conn = sqlite3.connect(db)
try:
    if not has_column(conn, 'sales', 'bag_size'):
        print('Adding sales.bag_size ...')
        add_column(conn, 'sales', 'bag_size TEXT')
    if not has_column(conn, 'sales', 'units'):
        print('Adding sales.units ...')
        add_column(conn, 'sales', 'units INTEGER')
    if not has_column(conn, 'sales', 'total_amount'):
        print('Adding sales.total_amount ...')
        add_column(conn, 'sales', 'total_amount REAL')
    if not has_column(conn, 'sales', 'paid_amount'):
        print('Adding sales.paid_amount ...')
        add_column(conn, 'sales', 'paid_amount REAL')
    if not has_column(conn, 'sales', 'outstanding'):
        print('Adding sales.outstanding ...')
        add_column(conn, 'sales', 'outstanding REAL')
    if not has_column(conn, 'sales', 'invoice_image'):
        print('Adding sales.invoice_image ...')
        add_column(conn, 'sales', 'invoice_image TEXT')
    print('DONE')
finally:
    conn.close()
