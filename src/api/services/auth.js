import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function login(payload) {
  const response = await http.post('/auth/login', payload);
  return unwrapResponse(response) || response.data;
}

export async function verify2FALogin(pendingToken, token) {
  const response = await http.post('/auth/2fa/verify-login', { pendingToken, token });
  return unwrapResponse(response) || response.data;
}

export async function setup2FA() {
  const response = await http.post('/auth/2fa/setup');
  return unwrapResponse(response) || response.data;
}

export async function verifySetup2FA(secret, token) {
  const response = await http.post('/auth/2fa/verify-setup', { secret, token });
  return unwrapResponse(response) || response.data;
}

export async function disable2FA(token) {
  const response = await http.post('/auth/2fa/disable', { token });
  return unwrapResponse(response) || response.data;
}

export async function logout() {
  const response = await http.post('/auth/logout');
  return unwrapResponse(response) || response.data;
}

export async function refreshAccessToken() {
  const response = await http.post('/auth/refresh');
  return response.data;
}

export async function forgotPassword(payload) {
  const response = await http.post('/auth/forgot-password', payload);
  return unwrapResponse(response) || response.data;
}

export async function resetPassword(token, newPassword) {
  const response = await http.post('/auth/reset-password', { token, newPassword });
  return unwrapResponse(response) || response.data;
}
