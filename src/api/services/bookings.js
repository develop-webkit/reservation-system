import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getBookings(params) {
  const response = await http.get('/bookings', { params });
  return unwrapResponse(response);
}

export async function getBookingById(id) {
  const response = await http.get(`/bookings/${id}`);
  return unwrapResponse(response);
}

export async function getBookingChart(params) {
  const response = await http.get('/bookings/chart', { params });
  return unwrapResponse(response);
}

export async function createBooking(payload) {
  const response = await http.post('/bookings', payload);
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

export async function deleteBooking(id) {
  const response = await http.delete(`/bookings/${id}`);
  return unwrapResponse(response);
}

const bookingsApi = {
  getAll: getBookings,
  getById: getBookingById,
  getChart: getBookingChart,
  create: createBooking,
  update: updateBooking,
  updateChart: updateBooking,
  updateStatus: updateBookingStatus,
  delete: deleteBooking,
};

export default bookingsApi;
