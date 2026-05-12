import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function login(payload) {
  const response = await http.post('/auth/login', payload);
  return unwrapResponse(response) || response.data;
}

export async function forgotPassword(payload) {
  const response = await http.post('/auth/forgot-password', payload);
  return unwrapResponse(response) || response.data;
}
