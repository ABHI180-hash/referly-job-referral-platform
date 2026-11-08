import apiClient from './api';
import { ReferralRequest } from '@/types';

export const referralService = {
  async createReferralRequest(data: {
    jobId: string;
    referrerId: string;
    note: string;
    resumeUrl?: string;
    resumeName?: string;
  }): Promise<ReferralRequest> {
    const res = await apiClient.post('/referrals', data);
    const r = res.data.data;
    return {
      ...r,
      id: r._id || r.id,
    };
  },

  async getSentRequests(): Promise<ReferralRequest[]> {
    const res = await apiClient.get('/referrals/sent');
    const list = res.data.data || [];
    return list.map((r: any) => ({
      id: r._id || r.id,
      jobId: r.job?._id || r.job?.id || r.job,
      jobTitle: r.job?.title || 'Position',
      company: r.job?.company || 'Company',
      candidateId: r.seeker?._id || r.seeker?.id || r.seeker,
      candidateName: r.seeker?.name || 'Applicant',
      candidateHeadline: 'Job Seeker',
      candidateAvatar: r.seeker?.avatar || '',
      candidateEmail: r.seeker?.email || '',
      candidateResume: r.resumeName || 'Resume.pdf',
      referrerId: r.referrer?._id || r.referrer?.id || r.referrer,
      referrerName: r.referrer?.name || 'Employee',
      referrerCompany: r.job?.company || '',
      referrerPosition: 'Staff Member',
      requestDate: r.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      status: r.status,
      note: r.note,
      updatedAt: r.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    }));
  },

  async getIncomingRequests(): Promise<ReferralRequest[]> {
    const res = await apiClient.get('/referrals/incoming');
    const list = res.data.data || [];
    return list.map((r: any) => ({
      id: r._id || r.id,
      jobId: r.job?._id || r.job?.id || r.job,
      jobTitle: r.job?.title || 'Position',
      company: r.job?.company || 'Company',
      candidateId: r.seeker?._id || r.seeker?.id || r.seeker,
      candidateName: r.seeker?.name || 'Applicant',
      candidateHeadline: 'Candidate',
      candidateAvatar: r.seeker?.avatar || '',
      candidateEmail: r.seeker?.email || '',
      candidateResume: r.resumeName || 'Resume.pdf',
      referrerId: r.referrer?._id || r.referrer?.id || r.referrer,
      referrerName: r.referrer?.name || 'You',
      referrerCompany: r.job?.company || '',
      requestDate: r.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      status: r.status,
      note: r.note,
      updatedAt: r.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    }));
  },

  async updateRequestStatus(
    id: string,
    status: 'Accepted' | 'Rejected',
    responseMessage?: string
  ): Promise<any> {
    const res = await apiClient.patch(`/referrals/${id}/status`, {
      status,
      responseMessage,
    });
    return res.data.data;
  },

  async cancelRequest(id: string): Promise<void> {
    await apiClient.delete(`/referrals/${id}`);
  },
};
