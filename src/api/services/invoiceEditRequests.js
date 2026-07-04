import http from '../http.js';
import { unwrapResponse } from '../utils.js';

export async function getInvoiceEditRequests() {
  const response = await http.get('/invoice-edit-requests');
  return unwrapResponse(response);
}

export async function createInvoiceEditRequest(invoiceId) {
  const response = await http.post('/invoice-edit-requests', { invoiceId });
  return unwrapResponse(response);
}

export async function approveInvoiceEditRequest(id, adminNotes) {
  const response = await http.patch(`/invoice-edit-requests/${id}/approve`, { adminNotes });
  return unwrapResponse(response);
}

export async function rejectInvoiceEditRequest(id, adminNotes) {
  const response = await http.patch(`/invoice-edit-requests/${id}/reject`, { adminNotes });
  return unwrapResponse(response);
}
