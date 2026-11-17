/**
 * Businesses API Endpoints
 */
import { api } from './client.js';

export const businessesApi = {
  getAll: (page = 1, pageSize = 10, search = '', status = '') => {
    let url = `/api/Businesses?page=${page}&pageSize=${pageSize}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status !== '' && status !== null && status !== undefined) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    return api.get(url);
  },

  getById: (id) =>
    api.get(`/api/Businesses/${id}`),

  create: (data) =>
    api.post('/api/Businesses', data),

  update: (id, data) =>
    api.put(`/api/Businesses/${id}`, data),

  delete: (id) =>
    api.delete(`/api/Businesses/${id}`),
};
