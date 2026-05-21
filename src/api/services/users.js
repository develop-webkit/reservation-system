import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getUsers(params) {
  const response = await http.get('/user', { params });
  return unwrapResponse(response);
}

export async function getUserById(id) {
  const response = await http.get(`/user/${id}`);
  return unwrapResponse(response);
}

export async function createUser(userData) {
  const response = await http.post('/user', userData);
  return unwrapResponse(response);
}

export async function updateUser(id, userData) {
  const response = await http.put(`/user/${id}`, userData);
  return unwrapResponse(response);
}

export async function deleteUser(id) {
  const response = await http.delete(`/user/${id}`);
  return unwrapResponse(response);
}

const usersApi = {
  getAll: getUsers,
  getById: getUserById,
  create: createUser,
  update: updateUser,
  delete: deleteUser,
};

export default usersApi;
