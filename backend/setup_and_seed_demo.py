"""Setup a fresh demo SQLite DB and seed demo data.

This script will remove existing database files in `instance/` named
`grocerybag.db` or `demo.db`, create a fresh database at `instance/demo.db`,
and run the project's `populate_demo_with_admin.seed()` to populate sample data.
"""
import os
import sys
import traceback

from app import app
from extensions import db

def remove_old_dbs(inst_path):
    removed = []
    for name in ("grocerybag.db", "demo.db"):
        p = os.path.join(inst_path, name)
        if os.path.exists(p):
            try:
                os.remove(p)
                removed.append(p)
            except PermissionError:
                # file locked by another process; move it aside instead
                import time
                newname = p + ".bak." + time.strftime('%Y%m%d%H%M%S')
                try:
                    os.rename(p, newname)
                    removed.append(newname)
                except Exception:
                    # last resort: ignore and continue
                    pass
    return removed

def main():
    inst = app.instance_path
    print("Instance path:", inst)
    os.makedirs(inst, exist_ok=True)

    removed = remove_old_dbs(inst)
    if removed:
        print("Removed old DB files:")
        for r in removed:
            print(" -", r)
    else:
        print("No pre-existing DB files found (grocerybag.db/demo.db)")

    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Tables created.")

        # run existing seeder if present
        try:
            import populate_demo_with_admin as seeder
            print("Running seeder: populate_demo_with_admin.seed()")
            seeder.seed()
            print("Seeding finished.")
        except Exception:
            print("Seeder failed or not present. Traceback:")
            traceback.print_exc()

    print("Setup complete. Database file located at:", os.path.join(inst, 'demo.db'))

if __name__ == '__main__':
    main()
