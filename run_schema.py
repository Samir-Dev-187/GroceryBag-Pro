# run_schema.py
import sqlite3, pathlib, sys

db = pathlib.Path("data/grocerybag.db")
sqlf = pathlib.Path("data/schema.sql")

if not sqlf.exists():
    print("ERROR: schema.sql not found at", sqlf.resolve())
    sys.exit(1)

db.parent.mkdir(parents=True, exist_ok=True)  # ensure data/ exists

conn = sqlite3.connect(str(db))
with open(sqlf, "r", encoding="utf-8") as f:
    sql = f.read()
conn.executescript(sql)
conn.commit()
conn.close()
print("PY_SQL_OK")
