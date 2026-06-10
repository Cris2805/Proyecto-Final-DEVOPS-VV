import { apiRequest } from './apiService.js';

export const getUsers = () => apiRequest('/users');
export const createUser = (user) => apiRequest('/users', { method: 'POST', body: JSON.stringify(user) });
export const updateUser = (id, user) => apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) });
export const deleteUser = (id) => apiRequest(`/users/${id}`, { method: 'DELETE' });
