import apiClient from './api';
import { Job } from '@/types';

export const jobService = {
  async getJobs(params?: Record<string, any>): Promise<{ jobs: Job[]; total: number }> {
    const res = await apiClient.get('/jobs', { params });
    const data = res.data.data;
    // Map backend _id to id if necessary
    const jobs = (Array.isArray(data) ? data : data.jobs || []).map((j: any) => ({
      ...j,
      id: j._id || j.id,
    }));
    const total = res.data.meta?.total || jobs.length;
    return { jobs, total };
  },

  async getJobById(id: string): Promise<Job> {
    const res = await apiClient.get(`/jobs/${id}`);
    const j = res.data.data.job || res.data.data;
    return { ...j, id: j._id || j.id };
  },

  async createJob(jobData: any): Promise<Job> {
    const res = await apiClient.post('/jobs', jobData);
    const j = res.data.data;
    return { ...j, id: j._id || j.id };
  },

  async updateJob(id: string, updates: any): Promise<Job> {
    const res = await apiClient.put(`/jobs/${id}`, updates);
    const j = res.data.data;
    return { ...j, id: j._id || j.id };
  },

  async deleteJob(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  },

  // Saved Jobs / Bookmarks
  async getSavedJobs(): Promise<string[]> {
    const res = await apiClient.get('/saved-jobs');
    const list = res.data.data || [];
    return list.map((item: any) => item.job?._id || item.job?.id || item.job);
  },

  async saveJob(jobId: string): Promise<void> {
    await apiClient.post('/saved-jobs', { jobId });
  },

  async unsaveJob(jobId: string): Promise<void> {
    await apiClient.delete(`/saved-jobs/${jobId}`);
  },
};
