import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getClients(params) {
  const response = await http.get('/clients', { params });
  return unwrapResponse(response);
}

export async function getClientById(id) {
  const response = await http.get(`/clients/${id}`);
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

export async function deleteClient(id) {
  const response = await http.delete(`/clients/${id}`);
  return unwrapResponse(response);
}

const clientsApi = {
  getAll: getClients,
  getById: getClientById,
  create: createClient,
  update: updateClient,
  delete: deleteClient,
};

export default clientsApi;
