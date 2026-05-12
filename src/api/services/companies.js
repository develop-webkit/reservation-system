import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getCompanies() {
  const response = await http.get('/companies');
  return unwrapResponse(response);
}
