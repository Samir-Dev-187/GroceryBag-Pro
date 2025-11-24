# db.py
import os
import sqlite3
from flask import g

# Use absolute path to avoid "which DB" confusion:
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "data", "grocerybag.db")

def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DB_PATH, detect_types=sqlite3.PARSE_DECLTYPES)
        db.row_factory = sqlite3.Row
        # enable foreign keys
        db.execute("PRAGMA foreign_keys = ON;")
    return db

def close_db(e=None):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()
        g._database = None
