import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getRooms() {
  const response = await http.get('/rooms');
  return unwrapResponse(response);
}
