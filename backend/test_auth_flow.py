import requests
base='http://127.0.0.1:5000'
print('login:')
r = requests.post(base+'/auth/login', json={'phone':'9000000000','password':'admin123'})
print(r.status_code, r.json())
print('request otp:')
r2 = requests.post(base+'/auth/request-otp', json={'phone':'9000000000'})
print(r2.status_code, r2.json())
code = r2.json().get('otp')
print('verify otp using code:', code)
r3 = requests.post(base+'/auth/verify-otp', json={'phone':'9000000000','code':code})
print(r3.status_code, r3.json())
