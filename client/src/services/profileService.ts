import apiClient from './api';

export const profileService = {
  async getProfile(): Promise<any> {
    const res = await apiClient.get('/profile');
    return res.data.data;
  },

  async updateSeekerProfile(data: any): Promise<any> {
    const res = await apiClient.put('/profile/seeker', data);
    return res.data.data;
  },

  async updateReferrerProfile(data: any): Promise<any> {
    const res = await apiClient.put('/profile/referrer', data);
    return res.data.data;
  },

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await apiClient.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.avatarUrl;
  },

  async uploadResume(file: File): Promise<{ resumeUrl: string; resumeName: string }> {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await apiClient.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
};
