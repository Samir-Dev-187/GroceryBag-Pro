# fix_transactions_columns.py
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
    if not has_column(conn, 'transactions', 'type'):
        print("Adding transactions.type ...")
        add_column(conn, 'transactions', 'type TEXT')

    if not has_column(conn, 'transactions', 'amount'):
        print("Adding transactions.amount ...")
        add_column(conn, 'transactions', 'amount REAL')

    if not has_column(conn, 'transactions', 'related_type'):
        print("Adding transactions.related_type ...")
        add_column(conn, 'transactions', 'related_type TEXT')

    if not has_column(conn, 'transactions', 'related_id'):
        print("Adding transactions.related_id ...")
        add_column(conn, 'transactions', 'related_id INTEGER')

    if not has_column(conn, 'transactions', 'note'):
        print("Adding transactions.note ...")
        add_column(conn, 'transactions', 'note TEXT')

    if not has_column(conn, 'transactions', 'date'):
        print("Adding transactions.date ...")
        add_column(conn, 'transactions', 'date DATETIME')

    print("DONE")
finally:
    conn.close()
