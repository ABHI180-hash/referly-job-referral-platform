import apiClient from './api';

export const adminService = {
  async getDashboardStats() {
    const res = await apiClient.get('/admin/stats');
    return res.data.data;
  },

  async getUsers(params?: any) {
    const res = await apiClient.get('/admin/users', { params });
    return res.data.data;
  },

  async updateUserStatus(id: string, status: 'active' | 'suspended') {
    const res = await apiClient.patch(`/admin/users/${id}/status`, { status });
    return res.data.data;
  },

  async getAuditLogs(params?: any) {
    const res = await apiClient.get('/admin/audit-logs', { params });
    return res.data.data;
  },
};
