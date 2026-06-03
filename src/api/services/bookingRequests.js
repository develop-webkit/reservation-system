import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getBookingRequests() {
  const response = await http.get('/booking-requests');
  return unwrapResponse(response);
}

export async function createBookingRequest(payload) {
  const response = await http.post('/booking-requests', payload);
  return unwrapResponse(response);
}

export async function approveBookingRequest(id, adminNotes) {
  const response = await http.patch(`/booking-requests/${id}/approve`, { adminNotes });
  return unwrapResponse(response);
}

export async function rejectBookingRequest(id, adminNotes) {
  const response = await http.patch(`/booking-requests/${id}/reject`, { adminNotes });
  return unwrapResponse(response);
}

export async function cancelBookingRequest(id) {
  const response = await http.patch(`/booking-requests/${id}/cancel`);
  return unwrapResponse(response);
}
