import sqlite3
import os
p = os.path.join('backend','instance','grocerybag.db')
if not os.path.exists(p):
    print('No grocerybag.db found at', os.path.abspath(p))
else:
    print('Using DB file:', os.path.abspath(p))
    conn = sqlite3.connect(p)
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
    rows = cur.fetchall()
    print('Tables:')
    for r in rows:
        print(' -', r[0])
    conn.close()
