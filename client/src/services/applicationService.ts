import apiClient from './api';
import { Application } from '@/types';

export const applicationService = {
  async applyToJob(data: {
    jobId: string;
    coverLetter?: string;
    referrerId?: string;
  }): Promise<Application> {
    const res = await apiClient.post('/applications', data);
    const a = res.data.data;
    return {
      ...a,
      id: a._id || a.id,
      jobId: a.job?._id || a.job?.id || a.job,
      jobTitle: a.job?.title || 'Job Opening',
      company: a.job?.company || 'Company',
      companyLogo: a.job?.companyLogo || '',
      location: a.job?.location || 'Remote',
      workMode: a.job?.workMode || 'Remote',
      appliedDate: a.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      lastUpdated: a.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    };
  },

  async getMyApplications(): Promise<Application[]> {
    const res = await apiClient.get('/applications/my');
    const list = res.data.data || [];
    return list.map((a: any) => ({
      id: a._id || a.id,
      jobId: a.job?._id || a.job?.id || a.job,
      jobTitle: a.job?.title || 'Job Opening',
      company: a.job?.company || 'Company',
      companyLogo: a.job?.companyLogo || '',
      location: a.job?.location || 'Remote',
      workMode: a.job?.workMode || 'Remote',
      appliedDate: a.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      status: a.status || 'Applied',
      lastUpdated: a.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      referralStatus: a.referral ? 'Referred' : 'Direct',
      feedback: a.timeline?.[a.timeline.length - 1]?.note || 'Application submitted.',
    }));
  },

  async updateApplicationStatus(id: string, status: string, note?: string): Promise<any> {
    const res = await apiClient.patch(`/applications/${id}/status`, { status, note });
    return res.data.data;
  },
};
