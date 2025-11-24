import sqlite3, os

db = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'grocerybag.db'))

print("DB_FILE:", db)

conn = sqlite3.connect(db)
cur = conn.cursor()

cur.execute("SELECT id, supplier_id, name, phone, address FROM suppliers ORDER BY id DESC LIMIT 5")
rows = cur.fetchall()

print("Recent suppliers:")
for r in rows:
    print(r)

conn.close()
