from flask import Blueprint, current_app, request, jsonify
import os
import sqlite3

debug_bp = Blueprint('debug_bp', __name__)


def is_allowed():
    # Allow when DEV_SEED=true (dev environment) or when correct debug key provided
    dev_seed = os.getenv('DEV_SEED', 'false').lower() in ('1', 'true', 'yes')
    if dev_seed:
        return True
    key = os.getenv('DEBUG_API_KEY')
    if key and request.headers.get('X-DEBUG-KEY') == key:
        return True
    return False


@debug_bp.route('/debug/info', methods=['GET'])
def debug_info():
    if not is_allowed():
        return jsonify({'error': 'debug endpoint restricted'}), 403

    # resolve sqlite path
    uri = current_app.config.get('SQLALCHEMY_DATABASE_URI', '')
    db_path = uri.replace('sqlite:///', '') if uri.startswith('sqlite:///') else uri

    info = {'db_uri': uri, 'db_path': db_path, 'tables': {}}

    try:
        if db_path and os.path.exists(db_path):
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            # list tables
            cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [r[0] for r in cur.fetchall()]
            for t in tables:
                try:
                    cur.execute(f'SELECT COUNT(*) FROM "{t}"')
                    info['tables'][t] = cur.fetchone()[0]
                except Exception:
                    info['tables'][t] = 'error'
            con.close()
        else:
            info['warning'] = 'DB path not found'
    except Exception as e:
        info['error'] = str(e)

    return jsonify(info)
