import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getTasks() {
  const response = await http.get('/tasks');
  return unwrapResponse(response);
}

export async function getAvailableTasks(params) {
  const response = await http.get('/tasks/available', { params });
  return unwrapResponse(response);
}

export async function createTask(payload) {
  const response = await http.post('/tasks', payload);
  return unwrapResponse(response);
}

export async function updateTask(id, payload) {
  const response = await http.patch(`/tasks/${id}`, payload);
  return unwrapResponse(response);
}

export async function bulkUpdateTasks(ids, updates) {
  const response = await http.patch('/tasks/bulk', { ids, updates });
  return unwrapResponse(response);
}
