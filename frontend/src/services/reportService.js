import { apiRequest } from './apiService.js';

export const getReportSummary = (period = 'this_week') => apiRequest(`/reports/summary?period=${period}`);
