import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getPortalStats() {
  const response = await http.get('/dashboard/portal-stats');
  return unwrapResponse(response);
}
