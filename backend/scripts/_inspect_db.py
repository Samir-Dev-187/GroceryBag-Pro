import sqlite3, os
DB=os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'grocerybag.db'))
print('DB path:', DB)
conn=sqlite3.connect(DB)
cur=conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
print('Tables:')
for r in cur.fetchall():
    print(' -', r[0])

def info(t):
    try:
        cur.execute(f"PRAGMA table_info({t})")
        rows = cur.fetchall()
        if not rows:
            print(f"No table or empty: {t}")
            return
        print(f"Columns for {t}:")
        for c in rows:
            print('   ', c)
    except Exception as e:
        print('Error for', t, e)

for t in ['user','users','customers','suppliers','purchases']:
    info(t)
conn.close()
