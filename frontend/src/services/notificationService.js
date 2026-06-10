import { apiRequest } from './apiService.js';

export const getNotifications = () => apiRequest('/notifications');
export const markNotificationRead = (id) => apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
export const markAllNotificationsRead = () => apiRequest('/notifications/read-all', { method: 'PATCH' });
