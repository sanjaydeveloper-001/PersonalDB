import api from './api'

export const itemService = {
  getItems: () => api.get('/vault/items'),
  getItem: (id) => api.get(`/vault/items/${id}`),
  createItem: (data) => api.post('/vault/items', data),
  updateItem: (id, data) => api.put(`/vault/items/${id}`, data),
  deleteItem: (id) => api.delete(`/vault/items/${id}`),
  verifyPassword: (id, password) => api.post(`/vault/items/${id}/verify`, { password }),
  uploadFile: (formData) => api.post('/vault/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getTrash: () => api.get('/vault/items/trash'),
  restoreItem: (id) => api.put(`/vault/items/${id}/restore`),
  permanentDelete: (id) => api.delete(`/vault/items/${id}/permanent`),
  emptyTrash: () => api.delete('/vault/items/trash/empty'),
}
