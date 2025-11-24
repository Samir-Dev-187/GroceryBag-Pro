import sqlite3, os
db = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'grocerybag.db'))
print("DB_FILE:", db)
conn = sqlite3.connect(db)
cur = conn.cursor()
cur.execute("SELECT id, purchase_id, supplier_id, bag_size, units, price_per_unit, total_amount, date FROM purchases ORDER BY id DESC LIMIT 8")
rows = cur.fetchall()
print("Recent purchases:")
for r in rows:
    print(r)
conn.close()
