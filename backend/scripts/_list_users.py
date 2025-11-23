import sqlite3, os
DB=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','data','grocerybag.db'))
print('DB',DB)
conn=sqlite3.connect(DB)
cur=conn.cursor()
for row in cur.execute('SELECT uid, phone, password FROM users'):
    print(row)
conn.close()
