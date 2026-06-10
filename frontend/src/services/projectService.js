import { apiRequest } from './apiService.js';

export const getProjects = () => apiRequest('/projects');
export const createProject = (project) => apiRequest('/projects', { method: 'POST', body: JSON.stringify(project) });
export const updateProject = (id, project) => apiRequest(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(project) });
export const deleteProject = (id) => apiRequest(`/projects/${id}`, { method: 'DELETE' });
