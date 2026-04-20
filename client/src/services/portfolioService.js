import api from './api'

export const portfolioService = {
  getProfile: () => api.get('/portfolio/profile'),
  updateProfile: (data) => api.put('/portfolio/profile', data),

  getEducation: () => api.get('/portfolio/education'),
  createEducation: (data) => api.post('/portfolio/education', data),
  updateEducation: (id, data) => api.put(`/portfolio/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/portfolio/education/${id}`),

  getExperience: () => api.get('/portfolio/experience'),
  createExperience: (data) => api.post('/portfolio/experience', data),
  updateExperience: (id, data) => api.put(`/portfolio/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/portfolio/experience/${id}`),

  getProjects: () => api.get('/portfolio/projects'),
  createProject: (data) => api.post('/portfolio/projects', data),
  updateProject: (id, data) => api.put(`/portfolio/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/portfolio/projects/${id}`),

  getSkills: () => api.get('/portfolio/skills'),
  updateSkills: (data) => api.put('/portfolio/skills', data),

  getCertifications: () => api.get('/portfolio/certifications'),
  createCertification: (data) => api.post('/portfolio/certifications', data),
  updateCertification: (id, data) => api.put(`/portfolio/certifications/${id}`, data),
  deleteCertification: (id) => api.delete(`/portfolio/certifications/${id}`),

  getInterests: () => api.get('/portfolio/interests'),
  updateInterests: (data) => api.put('/portfolio/interests', data),

  uploadImage: (formData) => api.post('/portfolio/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadResume: (formData) => api.post('/portfolio/upload/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteResume: () => api.delete('/portfolio/upload/resume'),
}
