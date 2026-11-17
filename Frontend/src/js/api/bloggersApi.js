/**
 * Bloggers API Endpoints
 */
import { api } from './client.js';

export const bloggersApi = {
  getAll: (page = 1, pageSize = 10, search = '', status = '') => {
    let url = `/api/Bloggers?page=${page}&pageSize=${pageSize}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status !== '' && status !== null && status !== undefined) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    return api.get(url);
  },

  getById: (id) =>
    api.get(`/api/Bloggers/${id}`),

  create: (data) =>
    api.post('/api/Bloggers', data),

  update: (id, data) =>
    api.put(`/api/Bloggers/${id}`, data),

  delete: (id) =>
    api.delete(`/api/Bloggers/${id}`),
};
