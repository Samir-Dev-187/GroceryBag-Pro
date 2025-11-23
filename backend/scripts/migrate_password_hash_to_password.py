"""Migrate users.password_hash -> users.password (plaintext) and assign random passwords.

This script will:
- create a new users table with `password` column
- copy existing user rows and set `password` to a generated plaintext value
- drop the old `users` table and rename the new one
- print a mapping of `uid` -> new plaintext password

Run: python backend/scripts/migrate_password_hash_to_password.py
"""
import os
import sqlite3
import secrets
import string

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DB_PATH = os.path.abspath(os.path.join(ROOT, '..', 'data', 'grocerybag.db'))

def rand_password(length=10):
    alphabet = string.ascii_letters + string.digits + "!@#$%"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

if not os.path.exists(DB_PATH):
    print('DB not found at', DB_PATH)
    raise SystemExit(1)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
cur.execute('PRAGMA foreign_keys=OFF;')

# get existing columns for users table
cur.execute("PRAGMA table_info('users')")
cols = cur.fetchall()
col_names = [c[1] for c in cols]
print('Existing users columns:', col_names)

# create new table users_new with 'password' column instead of 'password_hash'
cur.execute('''
CREATE TABLE users_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT UNIQUE,
    role TEXT CHECK(role IN ('admin','user','customer')),
    full_name TEXT,
    phone TEXT,
    email TEXT,
    password TEXT,
    gov_id_type TEXT,
    gov_id_number TEXT,
    note TEXT,
    created_at DATETIME
);
''')

# fetch existing users
cur.execute('SELECT id, uid, role, full_name, phone, email, password_hash, gov_id_type, gov_id_number, note, created_at FROM users')
rows = cur.fetchall()

uid_password_map = {}
for r in rows:
    (id_, uid, role, full_name, phone, email, password_hash, gov_id_type, gov_id_number, note, created_at) = r
    newpwd = rand_password(10)
    uid_password_map[uid] = newpwd
    cur.execute('INSERT INTO users_new (id, uid, role, full_name, phone, email, password, gov_id_type, gov_id_number, note, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                (id_, uid, role, full_name, phone, email, newpwd, gov_id_type, gov_id_number, note, created_at))

conn.commit()

# drop old table and rename
cur.execute('ALTER TABLE users RENAME TO users_old')
cur.execute('ALTER TABLE users_new RENAME TO users')
conn.commit()

print('Migration complete. Generated passwords:')
for k,v in uid_password_map.items():
    print(k, '->', v)

conn.close()
