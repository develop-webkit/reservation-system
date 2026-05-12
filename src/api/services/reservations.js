import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getReservations(params) {
  const response = await http.get('/reservations', { params });
  return unwrapResponse(response);
}

export async function createReservation(payload) {
  const response = await http.post('/reservations', payload);
  return unwrapResponse(response);
}

export async function updateReservation(id, payload) {
  const response = await http.patch(`/reservations/${id}`, payload);
  return unwrapResponse(response);
}

export async function deleteReservation(id) {
  const response = await http.delete(`/reservations/${id}`);
  return unwrapResponse(response);
}
