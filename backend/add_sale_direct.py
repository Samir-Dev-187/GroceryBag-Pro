"""Add a sale record directly using SQLAlchemy to verify DB persistence."""
from app import app
from extensions import db
from models import Sale

def main():
    with app.app_context():
        sale = Sale(
            customer_id=1,
            bag_size='5kg',
            units=3,
            total_amount=3*75.0,
            paid_amount=225.0,
            outstanding=0.0
        )
        db.session.add(sale)
        db.session.commit()
        print('Inserted sale id:', sale.id)

if __name__ == '__main__':
    main()
