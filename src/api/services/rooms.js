import http from '../http.js';
import { unwrapResponse } from '../utils.js';

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

const roomsApi = {
  getAll: getRooms,
  getById: getRoomById,
  updateStatus: updateRoomStatus,
  update: updateRoom,
  delete: deleteRoom,
};

export default roomsApi;
