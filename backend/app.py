# backend/app.py
import os
from flask import Flask
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///grocerybag.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'supersecretjwtkey')

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

@app.route('/')
def index():
    return "GroceryBag Pro backend running"

if __name__ == '__main__':
    app.run(debug=True)