import api from './api'

export const authService = {
  login: (data) => api.post('/vault/auth/login', data),
  register: (data) => api.post('/vault/auth/register', data),
  logout: () => api.post('/vault/auth/logout'),
  getMe: () => api.get('/vault/auth/me'),
}
