import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getTwoFactorRequests() {
  const response = await http.get('/two-factor-requests');
  return unwrapResponse(response);
}

export async function createTwoFactorRequest() {
  const response = await http.post('/two-factor-requests');
  return unwrapResponse(response);
}

export async function approveTwoFactorRequest(id, adminNotes) {
  const response = await http.patch(`/two-factor-requests/${id}/approve`, { adminNotes });
  return unwrapResponse(response);
}

export async function rejectTwoFactorRequest(id, adminNotes) {
  const response = await http.patch(`/two-factor-requests/${id}/reject`, { adminNotes });
  return unwrapResponse(response);
}
