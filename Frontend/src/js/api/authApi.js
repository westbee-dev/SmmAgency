/**
 * Authorization & Registration API Endpoints
 */
import { api } from './client.js';

export const authApi = {
  login: (login, password) =>
    api.post('/api/Authorization/authorization', { login, password }),

  register: (login, password, role) =>
    api.post('/api/Authorization/registration', { login, password, role }),

  getUsers: () =>
    api.get('/api/Authorization/users'),

  deleteUser: (id) =>
    api.delete(`/api/Users/${id}`),
};
