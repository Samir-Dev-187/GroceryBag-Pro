"""Import purchases from an Excel file into data/grocerybag.db

Usage: run inside backend venv or via the workspace Python.
Configure INPUT_PATH below or pass as an argument.
"""
import os
import sqlite3
import sys
from datetime import datetime
from random import randint

try:
    import openpyxl
except Exception:
    print('openpyxl not installed; please install in backend venv')
    raise

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATA_DB = os.path.abspath(os.path.join(ROOT, '..', 'data', 'grocerybag.db'))

def ensure_supplier(cur, supplier_name):
    cur.execute('SELECT supplier_id FROM suppliers WHERE name = ?', (supplier_name,))
    r = cur.fetchone()
    if r:
        return r[0]
    # create supplier
    supplier_id = f"SUP-IMP-{randint(1000,9999)}"
    now = datetime.utcnow().isoformat()
    cur.execute('INSERT INTO suppliers (supplier_id, name, phone, created_at) VALUES (?,?,?,?)', (supplier_id, supplier_name, '', now))
    return supplier_id

def import_excel(path):
    if not os.path.exists(path):
        print('Excel file not found:', path)
        return
    wb = openpyxl.load_workbook(path)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        print('No rows found in Excel')
        return
    headers = [str(h).strip() for h in rows[0]]
    # required headers mapping
    needed = ['Date','Supplier','BagSizeKg','Units','UnitPrice']
    for n in needed:
        if n not in headers:
            print('Missing column in Excel:', n)
            return

    col = {h: headers.index(h) for h in headers}

    conn = sqlite3.connect(DATA_DB)
    cur = conn.cursor()
    now = datetime.utcnow().isoformat()
    imported = 0
    for row in rows[1:]:
        try:
            date = row[col['Date']]
            supplier = str(row[col['Supplier']]).strip()
            bagkg = int(row[col['BagSizeKg']])
            units = int(row[col['Units']])
            unitprice = float(row[col['UnitPrice']])
            invoice = None
            if 'InvoicePhotoPath' in col:
                invoice = row[col['InvoicePhotoPath']] or None
        except Exception as e:
            print('Skipping row due to parse error:', e)
            continue

        supplier_id = ensure_supplier(cur, supplier)
        total = units * unitprice
        purchase_id = f"IMP-{randint(10000,99999)}"
        date_str = date.isoformat() if hasattr(date,'isoformat') else str(date)
        cur.execute('INSERT INTO purchases (purchase_id, date, supplier_id, total_amount, payment_mode, invoice_photo, created_by_uid, created_at) VALUES (?,?,?,?,?,?,?,?)',
                    (purchase_id, date_str, supplier_id, total, 'cash', invoice, 'AD-MAD11-4829-11', now))
        p_rowid = cur.lastrowid
        cur.execute('INSERT INTO purchase_items (purchase_id, bag_size_kg, units, unit_price, line_total) VALUES (?,?,?,?,?)',
                    (p_rowid, bagkg, units, unitprice, units*unitprice))
        imported += 1

    conn.commit()
    conn.close()
    print(f'Imported {imported} rows from Excel into', DATA_DB)


if __name__ == '__main__':
    if len(sys.argv) > 1:
        path = sys.argv[1]
    else:
        # default path (user-provided)
        path = r'C:\Users\USER\OneDrive\Desktop\GNIT\Weekly Routine for 2025-26 Odd Sem  B.Tech. 1st Year - Copy.xlsx'
    import_excel(path)
