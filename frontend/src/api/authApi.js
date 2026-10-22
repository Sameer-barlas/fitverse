import client from './client.js';

export async function registerUser(payload) {
  const res = await client.post('/auth/register', payload);
  return res.data;
}

export async function loginUser(payload) {
  const res = await client.post('/auth/login', payload);
  return res.data;
}

export async function logoutUser() {
  const res = await client.post('/auth/logout');
  return res.data;
}

export async function fetchCurrentUser() {
  const res = await client.get('/auth/me');
  return res.data;
}
