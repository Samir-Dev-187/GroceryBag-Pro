# backend/app.py
import os
from flask import Flask
from flask_cors import CORS
from flask import jsonify, request
from dotenv import load_dotenv

load_dotenv()

# ensure instance folder exists and use a dedicated demo DB inside it
app = Flask(__name__)
# ensure instance folder exists
os.makedirs(app.instance_path, exist_ok=True)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')
# Use a single canonical DB file under the project `data/` folder so the user
# can open it easily. If `data/grocerybag.db` doesn't exist yet we will fall
# back to the instance DB and copy it into `data/` later.
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
data_dir = os.path.join(project_root, 'data')
os.makedirs(data_dir, exist_ok=True)
default_db = os.path.join(data_dir, 'grocerybag.db')
# Respect DATABASE_URL if provided, but normalize relative sqlite paths to the instance folder
env_db = os.getenv('DATABASE_URL')
if env_db:
    # handle common sqlite URI forms like sqlite:///grocerybag.db or sqlite:///./grocerybag.db
    if env_db.startswith('sqlite:///'):
        raw_path = env_db.replace('sqlite:///', '')
        # if path is not absolute, resolve it under the instance folder
        if not os.path.isabs(raw_path):
            resolved = os.path.join(app.instance_path, raw_path)
        else:
            resolved = raw_path
        app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{resolved}"
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = env_db
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{default_db}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# make sure SQLAlchemy uses a non-pooled engine for SQLite so external DB edits
# (e.g., via DB Browser) are visible immediately and connections don't block.
from sqlalchemy.pool import NullPool
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'connect_args': {'check_same_thread': False},
    'poolclass': NullPool,
}
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'supersecretjwtkey')

# enable CORS for frontend dev server
CORS(app)

# import the extension instances (they are not bound to app yet)
from extensions import db, migrate, jwt

# initialize extensions with app
db.init_app(app)
migrate.init_app(app, db)
jwt.init_app(app)

# import models so migrations can detect them (models import db from extensions)
from models import User, Supplier, Customer, Purchase, Sale, Transaction, Alert  # noqa

# register blueprints after app and extensions are configured
from routes.auth import auth as auth_bp
app.register_blueprint(auth_bp, url_prefix="/auth")

from routes.purchases import purchases as purchases_bp
app.register_blueprint(purchases_bp, url_prefix="/purchases")

from routes.sales import sales as sales_bp
app.register_blueprint(sales_bp, url_prefix="/sales")

# register new customers and suppliers routes
from routes.customers import customers as customers_bp
app.register_blueprint(customers_bp, url_prefix="/customers")

from routes.suppliers import suppliers as suppliers_bp
app.register_blueprint(suppliers_bp, url_prefix="/suppliers")

# debug endpoints (dev-only)
from routes.debug import debug_bp
app.register_blueprint(debug_bp)

@app.route('/')
def index():
    return "GroceryBag Pro backend running"

with app.app_context():
    # create tables if they don't exist so demo is ready immediately
    try:
        # import here so extensions and models are loaded
        from extensions import db as _db
        _db.create_all()
    except Exception:
        # if create_all fails, we don't want the app import to crash during tooling
        pass

    # ensure the users table has an `otp` column for demo convenience
    try:
        import sqlite3
        db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
        db_file = None
        if db_uri.startswith('sqlite:///'):
            db_file = db_uri.replace('sqlite:///', '')
        else:
            # fallback to instance default
            db_file = os.path.join(app.instance_path, 'grocerybag.db')
        app.config['DB_FILE_PATH'] = db_file

        conn = sqlite3.connect(db_file)
        cur = conn.cursor()
        cur.execute("PRAGMA table_info('users')")
        cols = [r[1] for r in cur.fetchall()]
        if 'otp' not in cols:
            try:
                cur.execute("ALTER TABLE users ADD COLUMN otp VARCHAR(10)")
                conn.commit()
                print('Added users.otp column to', db_file)
            except Exception as ex:
                print('Failed to add users.otp column:', ex)
        conn.close()
        # ensure suppliers has supplier_id
        conn = sqlite3.connect(db_file)
        cur = conn.cursor()
        try:
            cur.execute("PRAGMA table_info('suppliers')")
            cols = [r[1] for r in cur.fetchall()]
            if 'supplier_id' not in cols:
                try:
                    cur.execute("ALTER TABLE suppliers ADD COLUMN supplier_id VARCHAR(100)")
                    conn.commit()
                    print('Added suppliers.supplier_id to', db_file)
                except Exception as ex:
                    print('Failed to add suppliers.supplier_id:', ex)
        except Exception:
            pass
        try:
            cur.execute("PRAGMA table_info('customers')")
            cols = [r[1] for r in cur.fetchall()]
            if 'customer_id' not in cols:
                try:
                    cur.execute("ALTER TABLE customers ADD COLUMN customer_id VARCHAR(100)")
                    conn.commit()
                    print('Added customers.customer_id to', db_file)
                except Exception as ex:
                    print('Failed to add customers.customer_id:', ex)
        except Exception:
            pass
        try:
            cur.execute("PRAGMA table_info('customers')")
            cols = [r[1] for r in cur.fetchall()]
            if 'uid' not in cols:
                try:
                    cur.execute("ALTER TABLE customers ADD COLUMN uid VARCHAR(20)")
                    conn.commit()
                    print('Added customers.uid to', db_file)
                except Exception as ex:
                    print('Failed to add customers.uid:', ex)
        except Exception:
            pass
        try:
            cur.execute("PRAGMA table_info('purchases')")
            cols = [r[1] for r in cur.fetchall()]
            if 'purchase_id' not in cols:
                try:
                    cur.execute("ALTER TABLE purchases ADD COLUMN purchase_id VARCHAR(100)")
                    conn.commit()
                    print('Added purchases.purchase_id to', db_file)
                except Exception as ex:
                    print('Failed to add purchases.purchase_id:', ex)
        except Exception:
            pass
        try:
            cur.execute("PRAGMA table_info('sales')")
            cols = [r[1] for r in cur.fetchall()]
            if 'sale_id' not in cols:
                try:
                    cur.execute("ALTER TABLE sales ADD COLUMN sale_id VARCHAR(100)")
                    conn.commit()
                    print('Added sales.sale_id to', db_file)
                except Exception as ex:
                    print('Failed to add sales.sale_id:', ex)
        except Exception:
            pass
        conn.close()
    except Exception as _:
        # don't let DB migrations here break app import
        pass

if __name__ == '__main__':
    app.run(debug=True)


# Return JSON for unhandled exceptions on API routes to avoid HTML error pages
@app.errorhandler(Exception)
def handle_exception(e):
    try:
        from werkzeug.exceptions import HTTPException
        if isinstance(e, HTTPException):
            return jsonify({'error': e.description}), e.code
    except Exception:
        pass
    # Always return JSON for unhandled exceptions to avoid HTML error pages
    try:
        return jsonify({'error': 'Internal server error', 'detail': str(e)}), 500
    except Exception:
        # As a last resort, re-raise so Flask shows default behavior
        raise e