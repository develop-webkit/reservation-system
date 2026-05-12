import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getDashboardStats() {
  const response = await http.get('/dashboard/stats');
  return unwrapResponse(response);
}
