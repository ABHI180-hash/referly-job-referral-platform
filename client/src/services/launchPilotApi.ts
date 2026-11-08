import axios from 'axios';
import { IWebsite, IScanResult, ILaunchNotification } from '../types/launchpilot';

const API_BASE = '/api/v1/launchpilot';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const launchPilotApi = {
  // Websites
  getWebsites: async (): Promise<IWebsite[]> => {
    const res = await client.get('/websites');
    return res.data?.data || [];
  },

  createWebsite: async (payload: { name: string; url: string; category?: string; environment?: string }): Promise<IWebsite> => {
    const res = await client.post('/websites', payload);
    return res.data?.data;
  },

  updateWebsite: async (id: string, payload: Partial<IWebsite>): Promise<IWebsite> => {
    const res = await client.put(`/websites/${id}`, payload);
    return res.data?.data;
  },

  deleteWebsite: async (id: string): Promise<void> => {
    await client.delete(`/websites/${id}`);
  },

  // Scans
  triggerScan: async (payload: { websiteId?: string; url?: string }): Promise<{ scanResult: IScanResult; website: IWebsite }> => {
    const res = await client.post('/scans/trigger', payload);
    return res.data?.data;
  },

  getLatestScan: async (websiteId: string): Promise<IScanResult | null> => {
    try {
      const res = await client.get(`/scans/latest/${websiteId}`);
      return res.data?.data || null;
    } catch {
      return null;
    }
  },

  getScanHistory: async (websiteId?: string): Promise<IScanResult[]> => {
    const res = await client.get('/scans/history', { params: { websiteId } });
    return res.data?.data || [];
  },

  compareScans: async (id1: string, id2: string) => {
    const res = await client.get('/scans/compare', { params: { id1, id2 } });
    return res.data?.data;
  },

  manualVerifyCheck: async (scanId: string, checkId: number, note: string, status: 'passed' | 'warning' = 'passed'): Promise<IScanResult> => {
    const res = await client.post(`/scans/verify/${scanId}`, { checkId, note, status });
    return res.data?.data;
  },

  // Analytics
  getAnalytics: async (websiteId?: string) => {
    const res = await client.get('/analytics', { params: { websiteId } });
    return res.data?.data;
  },

  // Notifications
  getNotifications: async (): Promise<ILaunchNotification[]> => {
    const res = await client.get('/notifications');
    return res.data?.data || [];
  },

  markNotificationRead: async (id: string): Promise<void> => {
    await client.patch(`/notifications/${id}/read`);
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await client.post('/notifications/read-all');
  },
};
