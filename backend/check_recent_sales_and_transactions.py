import sqlite3, os

db = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'grocerybag.db'))
print('DB_FILE:', db)

conn = sqlite3.connect(db)
cur = conn.cursor()

print('\nRecent SALES:')
cur.execute('SELECT id, sale_id, customer_id, bag_size, units, total_amount, paid_amount, outstanding, date FROM sales ORDER BY id DESC LIMIT 6')
for r in cur.fetchall():
    print(r)

print('\nRecent TRANSACTIONS:')
cur.execute('SELECT id, type, amount, related_type, related_id, note, date FROM transactions ORDER BY id DESC LIMIT 8')
for r in cur.fetchall():
    print(r)

conn.close()
