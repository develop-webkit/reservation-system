import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getAccountingEntries(params) {
  const response = await http.get('/accounting', { params });
  return unwrapResponse(response);
}

export async function updateAccountingEntry(id, payload) {
  const response = await http.patch(`/accounting/${id}`, payload);
  return unwrapResponse(response);
}
