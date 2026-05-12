import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getClients(params) {
  const response = await http.get('/clients', { params });
  return unwrapResponse(response);
}

export async function createClient(payload) {
  const response = await http.post('/clients', payload);
  return unwrapResponse(response);
}

export async function updateClient(id, payload) {
  const response = await http.patch(`/clients/${id}`, payload);
  return unwrapResponse(response);
}
