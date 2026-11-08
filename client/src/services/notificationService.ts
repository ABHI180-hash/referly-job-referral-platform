import apiClient from './api';
import { NotificationItem } from '@/types';

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await apiClient.get('/notifications');
    const list = res.data.data || [];
    return list.map((n: any) => ({
      id: n._id || n.id,
      title: n.title,
      description: n.message,
      category: n.category || 'system',
      timestamp: n.createdAt?.split('T')[0] || 'Today',
      read: n.isRead ?? false,
      actionUrl: n.actionUrl,
    }));
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch('/notifications/read-all');
  },
};
