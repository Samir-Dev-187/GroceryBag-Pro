// Use Vite env or fallback to empty string; avoid using `process` in browser
const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function login(phone: string, password: string) {
  const resp = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  return resp.json();
}

export async function requestOtp(phone: string) {
  const resp = await fetch(`/api/auth/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return resp.json();
}

export async function verifyOtp(phone: string, code: string) {
  const resp = await fetch(`/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code }),
  });
  return resp.json();
}

export async function register(phone: string, password: string, role: string) {
  const resp = await fetch(`/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password, role }),
  });
  return resp.json();
}

export default { login, requestOtp, verifyOtp, register };
