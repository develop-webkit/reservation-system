import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getInvoices(params) {
  const response = await http.get('/invoices', { params });
  return unwrapResponse(response);
}

export async function getInvoiceById(id) {
  const response = await http.get(`/invoices/${id}`);
  return unwrapResponse(response);
}

export async function createInvoice(payload) {
  const response = await http.post('/invoices', payload);
  return unwrapResponse(response);
}

export async function updateInvoice(id, payload) {
  const response = await http.patch(`/invoices/${id}`, payload);
  return unwrapResponse(response);
}

export async function deleteInvoice(id) {
  const response = await http.delete(`/invoices/${id}`);
  return unwrapResponse(response);
}

const invoicesApi = {
  getAll: getInvoices,
  getById: getInvoiceById,
  create: createInvoice,
  update: updateInvoice,
  delete: deleteInvoice,
};

export default invoicesApi;
