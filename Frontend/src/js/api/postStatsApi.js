/**
 * PostStats API Endpoints
 */
import { api } from './client.js';

export const postStatsApi = {
  getAll: (page = 1, pageSize = 10, search = '', campaignId = '', bloggerId = '') => {
    let url = `/api/PostStats?page=${page}&pageSize=${pageSize}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (campaignId) url += `&campaignId=${encodeURIComponent(campaignId)}`;
    if (bloggerId) url += `&bloggerId=${encodeURIComponent(bloggerId)}`;
    return api.get(url);
  },

  getById: (id) =>
    api.get(`/api/PostStats/${id}`),

  create: (data) =>
    api.post('/api/PostStats', data),

  update: (id, data) =>
    api.put(`/api/PostStats/${id}`, data),

  delete: (id) =>
    api.delete(`/api/PostStats/${id}`),
};
