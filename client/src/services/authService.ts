import apiClient from './api';

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'seeker' | 'referrer' | 'admin';
    avatar?: string;
  };
  token: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: 'seeker' | 'referrer';
  }) {
    const res = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/register', data);
    if (res.data.data?.token) {
      localStorage.setItem('referly_token', res.data.data.token);
    }
    return res.data;
  },

  async login(email: string, password: string) {
    const res = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/login', {
      email,
      password,
    });
    if (res.data.data?.token) {
      localStorage.setItem('referly_token', res.data.data.token);
    }
    return res.data;
  },

  async getMe() {
    const res = await apiClient.get<{ success: boolean; data: { user: any } }>('/auth/me');
    return res.data.data.user;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore if offline
    } finally {
      localStorage.removeItem('referly_token');
    }
  },
};
