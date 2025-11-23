"""Use Flask test client to POST a sale and verify DB entry (no server needed)."""
from app import app
from extensions import db
from models import Sale

def run_test():
    with app.test_client() as client:
        data = {
            'customer_id': '1',
            'bag_size': '10kg',
            'units': '2',
            'price_per_unit': '50',
            'paid_amount': '100',
            'payment_type': 'cash'
        }
        # send as form-data
        resp = client.post('/sales/', data=data)
        print('Status code:', resp.status_code)
        print('Response:', resp.get_json())

    # verify last sale
    with app.app_context():
        s = Sale.query.order_by(Sale.id.desc()).first()
        if s:
            print('Last sale id:', s.id, 'customer_id:', s.customer_id, 'total_amount:', s.total_amount, 'paid:', s.paid_amount)
        else:
            print('No sale records found')

if __name__ == '__main__':
    run_test()
