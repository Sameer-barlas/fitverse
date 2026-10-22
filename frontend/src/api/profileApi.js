import client from './client.js';

export async function fetchProfile() {
  const res = await client.get('/profile');
  return res.data;
}

export async function saveProfile(payload) {
  const res = await client.put('/profile', payload);
  return res.data;
}
