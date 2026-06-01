import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function createRoom(payload) {
  const response = await http.post('/rooms', payload);
  return unwrapResponse(response);
}

export async function getRooms(params) {
  const response = await http.get('/rooms', { params });
  return unwrapResponse(response);
}

export async function getRoomById(id) {
  const response = await http.get(`/rooms/${id}`);
  return unwrapResponse(response);
}

export async function updateRoomStatus(id, payload) {
  const response = await http.patch(`/rooms/${id}/status`, payload);
  return unwrapResponse(response);
}

export async function updateRoom(id, payload) {
  const response = await http.patch(`/rooms/${id}`, payload);
  return unwrapResponse(response);
}

export async function deleteRoom(id) {
  const response = await http.delete(`/rooms/${id}`);
  return unwrapResponse(response);
}

export async function updateRoomServiceStatus(id, type, description, startDate, endDate) {
  const response = await http.patch(`/rooms/${id}/service-status`, { type, description, startDate, endDate });
  return unwrapResponse(response);
}

const roomsApi = {
  create: createRoom,
  getAll: getRooms,
  getById: getRoomById,
  updateStatus: updateRoomStatus,
  updateServiceStatus: updateRoomServiceStatus,
  update: updateRoom,
  delete: deleteRoom,
};

export default roomsApi;
