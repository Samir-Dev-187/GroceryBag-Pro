"""Assign random plaintext passwords to first N users in data/grocerybag.db

Run: python backend/scripts/set_random_passwords.py [N]
"""
import os
import sqlite3
import secrets
import string
import random
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DB_PATH = os.path.abspath(os.path.join(ROOT, '..', 'data', 'grocerybag.db'))

def rand_password(length=12):
    # Ensure at least one upper, one lower, one digit, one symbol
    if length < 8:
        length = 8
    upp = secrets.choice(string.ascii_uppercase)
    low = secrets.choice(string.ascii_lowercase)
    dig = secrets.choice(string.digits)
    sym = secrets.choice(string.punctuation)
    # remaining characters from full set
    remaining_len = length - 4
    all_chars = string.ascii_letters + string.digits + string.punctuation
    remaining = [secrets.choice(all_chars) for _ in range(remaining_len)]
    pwd_list = [upp, low, dig, sym] + remaining
    random.SystemRandom().shuffle(pwd_list)
    return ''.join(pwd_list)

N = int(sys.argv[1]) if len(sys.argv) > 1 else 5

if not os.path.exists(DB_PATH):
    print('DB not found at', DB_PATH)
    raise SystemExit(1)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
cur.execute('SELECT id, uid, phone FROM users ORDER BY id LIMIT ?', (N,))
rows = cur.fetchall()
mapping = {}
for id_, uid, phone in rows:
    pwd = rand_password(12)
    cur.execute('UPDATE users SET password = ? WHERE id = ?', (pwd, id_))
    mapping[uid] = pwd

conn.commit()
conn.close()

print('Updated passwords for users:')
for u,p in mapping.items():
    print(u, '->', p)
