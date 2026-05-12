import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getUsers(params) {
  const response = await http.get('/user', { params });
  return unwrapResponse(response);
}
