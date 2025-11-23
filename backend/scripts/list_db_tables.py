import os
import sqlite3
import re
import json

# Locate the canonical DB file used by the app (prefer project `data/`)
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
data_dir = os.path.join(project_root, 'data')
db_file = os.path.join(data_dir, 'grocerybag.db')
if not os.path.exists(db_file):
    # fall back to legacy instance DB if present
    legacy = os.path.join(project_root, 'backend', 'instance', 'grocerybag.db')
    if os.path.exists(legacy):
        db_file = legacy

report = {'db_file': db_file, 'db_tables': [], 'model_tables': [], 'extra_tables': []}

if not os.path.exists(db_file):
    print('Database file not found at', db_file)
    raise SystemExit(1)

# list tables in sqlite_master
conn = sqlite3.connect(db_file)
cur = conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
rows = cur.fetchall()
db_tables = [r[0] for r in rows]
report['db_tables'] = db_tables

# parse models.py for __tablename__ assignments (simple regex)
models_path = os.path.join(project_root, 'backend', 'models.py')
if os.path.exists(models_path):
    with open(models_path, 'r', encoding='utf-8') as f:
        src = f.read()
    tbls = re.findall(r"__tablename__\s*=\s*['\"]([a-zA-Z0-9_]+)['\"]", src)
    report['model_tables'] = tbls
else:
    report['model_tables'] = []

# compute extra tables present in DB but not in models
extra = [t for t in db_tables if t not in report['model_tables']]
report['extra_tables'] = extra

# print report
print('DB file:', report['db_file'])
print('\nTables in DB ({}):'.format(len(report['db_tables'])))
for t in report['db_tables']:
    print(' -', t)

print('\nTables mapped in models.py ({}):'.format(len(report['model_tables'])))
for t in report['model_tables']:
    print(' -', t)

print('\nExtra tables (present in DB but not in models):')
for t in report['extra_tables']:
    print(' -', t)

# write json report for convenience
out_path = os.path.join(project_root, 'backend', 'scripts', 'db_table_report.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(report, f, indent=2)

print('\nWrote report to', out_path)
conn.close()
