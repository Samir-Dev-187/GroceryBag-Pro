import sqlite3
import os

root = os.path.dirname(os.path.dirname(__file__))
db_path = os.path.join(root, 'data', 'grocerybag.db')

if not os.path.exists(db_path):
    print('Database not found at', db_path)
    raise SystemExit(1)

conn = sqlite3.connect(db_path)
cur = conn.cursor()

def print_table(query, title):
    print('\n===', title, '===')
    try:
        cur.execute(query)
        rows = cur.fetchall()
        if not rows:
            print('  (no rows)')
            return
        for r in rows:
            print(' ', r)
    except Exception as e:
        print('  error querying', title, e)

# Common demo tables that store login info
print_table('SELECT id, phone, password, email, note FROM users', 'Users (id, phone, password, email, note)')
print_table('SELECT id, phone, password, email FROM customers', 'Customers (id, phone, password, email)')
print_table('SELECT id, phone, password, email FROM suppliers', 'Suppliers (id, phone, password, email)')

conn.close()
