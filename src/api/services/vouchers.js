import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getVouchers() {
  const response = await http.get('/vouchers');
  return unwrapResponse(response);
}

export async function createVoucher(payload) {
  const response = await http.post('/vouchers', payload);
  return unwrapResponse(response);
}

export async function updateVoucher(id, payload) {
  const response = await http.patch(`/vouchers/${id}`, payload);
  return unwrapResponse(response);
}
