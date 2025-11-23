import os
import sqlite3
import json
import datetime
import argparse

parser = argparse.ArgumentParser(description='Backup and optionally drop unused DB tables listed in scripts/db_table_report.json')
parser.add_argument('--confirm', action='store_true', help='Actually drop the tables (destructive).')
args = parser.parse_args()

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
report_path = os.path.join(project_root, 'backend', 'scripts', 'db_table_report.json')
if not os.path.exists(report_path):
    print('Report not found. Run list_db_tables.py first to generate the report.')
    raise SystemExit(1)

with open(report_path, 'r', encoding='utf-8') as f:
    report = json.load(f)

db_file = report.get('db_file')
extra = report.get('extra_tables', [])
if not extra:
    print('No extra tables detected; nothing to do.')
    raise SystemExit(0)

stamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
backup_path = os.path.join(base, 'scripts', f'unused_tables_backup_{stamp}.sql')

print('DB file:', db_file)
print('Tables flagged as extra (will be backed up):')
for t in extra:
    print(' -', t)

conn = sqlite3.connect(db_file)
cur = conn.cursor()

with open(backup_path, 'w', encoding='utf-8') as out:
    out.write('-- Backup of unused tables\n')
    out.write(f'-- Created: {stamp}\n')
    out.write(f'-- Source DB: {db_file}\n\n')

    for table in extra:
        # get create statement
        cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name=?", (table,))
        row = cur.fetchone()
        if row and row[0]:
            create_sql = row[0]
            out.write(create_sql + ';\n')
        else:
            out.write(f'-- No CREATE statement found for table {table}\n')
        # dump rows as INSERTs
        try:
            cur.execute(f"SELECT * FROM '{table}'")
            cols = [d[0] for d in cur.description]
            rows = cur.fetchall()
            if rows:
                for r in rows:
                    vals = []
                    for v in r:
                        if v is None:
                            vals.append('NULL')
                        elif isinstance(v, (int, float)):
                            vals.append(str(v))
                        else:
                            vals.append("'" + str(v).replace("'", "''") + "'")
                    out.write(f"INSERT INTO '{table}' ({', '.join(cols)}) VALUES ({', '.join(vals)});\n")
            else:
                out.write(f'-- Table {table} has no rows\n')
        except Exception as ex:
            out.write(f'-- Failed to dump rows for {table}: {ex}\n')
        out.write('\n')

print('Wrote backup to', backup_path)

if args.confirm:
    print('Dropping tables...')
    for table in extra:
        try:
            cur.execute(f"DROP TABLE IF EXISTS '{table}'")
            print('Dropped', table)
        except Exception as ex:
            print('Failed to drop', table, ex)
    conn.commit()
    print('Dropped all extra tables and committed changes.')
else:
    print('\nDry-run: no tables were dropped. To drop them, run with --confirm')

conn.close()
