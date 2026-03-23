import api from './api'

export const resumeService = {
  getPublicFiles: () => api.get('/vault/resume'),
  uploadResume: (formData) => api.post('/vault/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteResume: (id) => api.delete(`/vault/resume/${id}`),
  getPublicUrl: (id) => api.get(`/vault/resume/${id}/url`),
}
