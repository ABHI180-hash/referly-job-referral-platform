import apiClient from './api';
import { Conversation } from '@/types';

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    const res = await apiClient.get('/messages/conversations');
    const list = res.data.data || [];
    return list.map((c: any) => ({
      id: c._id || c.id,
      contactId: c.participants?.[0]?._id || 'contact_001',
      contactName: c.participants?.[0]?.name || 'Referly User',
      contactRole: c.participants?.[0]?.role === 'referrer' ? 'Verified Employee' : 'Candidate',
      contactCompany: 'Tech Partner',
      contactAvatar: c.participants?.[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      online: true,
      lastMessage: c.lastMessage?.content || 'Started conversation',
      lastMessageTime: 'Recently',
      unreadCount: 0,
      messages: [],
    }));
  },

  async getMessages(conversationId: string): Promise<any[]> {
    const res = await apiClient.get(`/messages/${conversationId}`);
    return res.data.data || [];
  },

  async sendMessage(data: {
    receiverId?: string;
    conversationId?: string;
    content: string;
  }): Promise<any> {
    const res = await apiClient.post('/messages', data);
    return res.data.data;
  },
};
