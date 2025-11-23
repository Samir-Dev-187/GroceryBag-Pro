import json
import urllib.request

data = json.dumps({"phone": "+919900000001", "password": "Admin@1234"}).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:5000/auth/login', data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as res:
        print('STATUS', res.status)
        body = res.read().decode('utf-8')
        print('BODY:')
        print(body)
except Exception as e:
    print('ERROR:', e)
    try:
        if hasattr(e, 'read'):
            print('ERR BODY:')
            print(e.read().decode())
    except Exception:
        pass
