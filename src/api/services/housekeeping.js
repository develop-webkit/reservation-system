import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getRoster(date) {
  const response = await http.get('/housekeeping/roster', {
    params: { date },
  });
  return unwrapResponse(response);
}

export async function getAssignments(params) {
  const response = await http.get('/housekeeping/assignments', { params });
  return unwrapResponse(response);
}

export async function allocateHousekeeping(payload) {
  const response = await http.post('/housekeeping/allocate', payload);
  return unwrapResponse(response);
}

export async function completeHousekeepingTask(id, payload) {
  const response = await http.patch(`/housekeeping/tasks/${id}/complete`, payload);
  return unwrapResponse(response);
}
