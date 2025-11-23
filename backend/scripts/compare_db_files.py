import sqlite3, os
import os
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
files = [
    os.path.join(project_root, 'backend', 'instance', 'grocerybag.db'),
    os.path.join(project_root, 'data', 'grocerybag.db'),
]
for f in files:
    print('DB:', f)
    if not os.path.exists(f):
        print('  (not found)')
        continue
    con = sqlite3.connect(f)
    cur = con.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = [r[0] for r in cur.fetchall()]
    for t in tables:
        try:
            cur.execute(f'SELECT COUNT(*) FROM "{t}"')
            c = cur.fetchone()[0]
        except Exception as e:
            c = 'err'
        print('  ', t, c)
    con.close()
    print()
