import apiClient from '../client';
import API_CONFIG from '../config';

const BASE = API_CONFIG.ENDPOINTS.CLIENT_GROUPS;

const clientGroupsApi = {
  getAll: async () => {
    const res = await apiClient.get(BASE);
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`${BASE}/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post(BASE, data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`${BASE}/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`${BASE}/${id}`);
    return res.data;
  },
  searchMembers: async (q, clientNo) => {
    const params = { q };
    if (clientNo) params.clientNo = clientNo;
    const res = await apiClient.get(`${BASE}/members/search`, { params });
    return res.data;
  },
};

export default clientGroupsApi;
