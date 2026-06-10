import { apiRequest } from './apiService.js';

export const getSettings = () => apiRequest('/settings');
export const updateSettings = (settings) => apiRequest('/settings', { method: 'PUT', body: JSON.stringify(settings) });
