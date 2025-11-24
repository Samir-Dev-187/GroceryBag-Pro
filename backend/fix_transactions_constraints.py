# fix_transactions_constraints.py
import sqlite3, os, shutil

db = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'grocerybag.db'))
print("DB_FILE:", db)

# Backup DB before modification
backup = db + ".backup_before_transactions_fix"
shutil.copyfile(db, backup)
print("Backup created:", backup)

conn = sqlite3.connect(db)
cur = conn.cursor()

# fetch existing rows
cur.execute("SELECT id, type, amount, related_type, related_id, note, date FROM transactions")
rows = cur.fetchall()
print("Existing rows:", len(rows))

# Drop temp table if exists
cur.execute("DROP TABLE IF EXISTS transactions_new")

# Create new table WITHOUT CHECK constraint
cur.execute("""
    CREATE TABLE transactions_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        amount REAL,
        related_type TEXT,
        related_id INTEGER,
        note TEXT,
        date DATETIME
    )
""")

# Insert old data into new clean table
for r in rows:
    cur.execute("""
        INSERT INTO transactions_new (id, type, amount, related_type, related_id, note, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, r)

# Drop old table
cur.execute("DROP TABLE transactions")

# Rename new table to original
cur.execute("ALTER TABLE transactions_new RENAME TO transactions")

conn.commit()
conn.close()
print("DONE  transactions table rebuilt successfully!")
