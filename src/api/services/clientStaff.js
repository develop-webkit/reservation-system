import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getClientStaff() {
  const response = await http.get('/client-staff');
  return unwrapResponse(response);
}

export async function createClientStaff(payload) {
  const response = await http.post('/client-staff', payload);
  return unwrapResponse(response);
}

export async function updateClientStaff(id, payload) {
  const response = await http.patch(`/client-staff/${id}`, payload);
  return unwrapResponse(response);
}

export async function deactivateClientStaff(id) {
  const response = await http.patch(`/client-staff/${id}/deactivate`);
  return unwrapResponse(response);
}

export async function deleteClientStaff(id) {
  const response = await http.delete(`/client-staff/${id}`);
  return unwrapResponse(response);
}
