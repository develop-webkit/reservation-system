import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getBookings(params) {
  const response = await http.get('/bookings', { params });
  return unwrapResponse(response);
}

export async function updateBookingStatus(id, payload) {
  const response = await http.patch(`/bookings/${id}/status`, payload);
  return unwrapResponse(response);
}

export async function updateBooking(id, payload) {
  const response = await http.patch(`/bookings/${id}`, payload);
  return unwrapResponse(response);
}
