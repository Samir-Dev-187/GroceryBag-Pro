# backend/routes/updates.py
from flask import Blueprint, request, jsonify, current_app
import sqlite3
import os
from datetime import datetime

updates = Blueprint("updates", __name__)

def _get_db_path():
    # try app config first, fall back to project data/grocerybag.db
    db_file = current_app.config.get("DB_FILE_PATH")
    if not db_file:
        base = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        db_file = os.path.join(base, "data", "grocerybag.db")
    return os.path.abspath(db_file)

def _query_rows(db, sql, params=()):
    cur = db.cursor()
    cur.execute(sql, params)
    cols = [c[0] for c in cur.description] if cur.description else []
    rows = [dict(zip(cols, r)) for r in cur.fetchall()]
    return rows

@updates.route("/recent", methods=["GET"])
def recent_updates():
    """
    Returns recent rows for suppliers, customers, purchases, sales.
    Query param `since` accepts ISO8601 datetime (e.g. 2025-11-24T12:00:00).
    """
    since = request.args.get("since") or "1970-01-01T00:00:00"
    # basic validation / normalize
    try:
        # allow space or T
        since_dt = datetime.fromisoformat(since.replace(" ", "T"))
    except Exception:
        return jsonify({"error": "invalid since timestamp, use ISO format like 2025-11-24T12:00:00"}), 400
    since_str = since_dt.isoformat()

    db_path = _get_db_path()
    if not os.path.exists(db_path):
        return jsonify({"error": "db not found", "db_path": db_path}), 500

    conn = sqlite3.connect(db_path)
    try:
        out = {"db_path": db_path, "since": since_str, "suppliers": [], "customers": [], "purchases": [], "sales": []}

        # Note: use created_at or date columns depending on table naming
        out["suppliers"] = _query_rows(conn, "SELECT id, supplier_id, name, phone, address, created_at FROM suppliers WHERE created_at > ? ORDER BY created_at ASC", (since_str,))
        out["customers"] = _query_rows(conn, "SELECT id, customer_id, uid, name, phone, address, created_at FROM customers WHERE created_at > ? ORDER BY created_at ASC", (since_str,))
        out["purchases"] = _query_rows(conn, "SELECT id, purchase_id, supplier_id, bag_size, units, price_per_unit, total_amount, date FROM purchases WHERE date > ? ORDER BY date ASC", (since_str,))
        out["sales"] = _query_rows(conn, "SELECT id, sale_id, customer_id, bag_size, units, total_amount, paid_amount, outstanding, date FROM sales WHERE date > ? ORDER BY date ASC", (since_str,))

        return jsonify(out)
    finally:
        conn.close()
