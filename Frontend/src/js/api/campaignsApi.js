/**
 * Campaigns API Endpoints
 */
import { api } from './client.js';

export const campaignsApi = {
  getAll: (page = 1, pageSize = 10, search = '', businessId = '') => {
    let url = `/api/Campaigns?page=${page}&pageSize=${pageSize}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (businessId) url += `&businessId=${encodeURIComponent(businessId)}`;
    return api.get(url);
  },

  getById: (id) =>
    api.get(`/api/Campaigns/${id}`),

  create: (data) =>
    api.post('/api/Campaigns', data),

  update: (id, data) =>
    api.put(`/api/Campaigns/${id}`, data),

  delete: (id) =>
    api.delete(`/api/Campaigns/${id}`),
};
