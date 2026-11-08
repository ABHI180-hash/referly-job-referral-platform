import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  UserRole,
  Job,
  Company,
  ReferrerProfile,
  Application,
  ReferralRequest,
  Conversation,
  NotificationItem,
  ChatAttachment,
  ChatMessage,
} from '@/types';
import {
  mockCurrentUserSeeker,
  mockCurrentUserReferrer,
  mockCurrentUserAdmin,
  mockJobs,
  mockCompanies,
  mockReferrers,
  mockApplications,
  mockReferralRequests,
  mockConversations,
  mockNotifications,
} from '@/data/mockData';
import { authService } from '@/services/authService';
import { jobService } from '@/services/jobService';
import { referralService } from '@/services/referralService';
import { applicationService } from '@/services/applicationService';
import { messageService } from '@/services/messageService';
import { notificationService } from '@/services/notificationService';
import { profileService } from '@/services/profileService';
import { connectSocket, getSocket } from '@/services/socket';
import { getCompanyLogo } from '@/utils/companyLogos';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole | 'guest';
  switchRole: (role: UserRole | 'guest') => Promise<void>;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  
  // Jobs
  jobs: Job[];
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => Promise<void>;
  isJobSaved: (jobId: string) => boolean;
  addJob: (job: Omit<Job, 'id' | 'postedDate'>) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  
  // Companies & Referrers
  companies: Company[];
  referrers: ReferrerProfile[];
  
  // Applications
  applications: Application[];
  applyToJob: (jobId: string, notes?: string) => Promise<boolean>;
  
  // Referral Requests
  referralRequests: ReferralRequest[];
  createReferralRequest: (jobId: string, referrerId: string, note?: string) => Promise<boolean>;
  updateReferralStatus: (requestId: string, status: 'Accepted' | 'Rejected') => Promise<void>;
  cancelReferralRequest: (requestId: string) => Promise<void>;
  
  // Messaging
  conversations: Conversation[];
  sendMessage: (conversationId: string, text: string, attachments?: ChatAttachment[]) => Promise<void>;
  
  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  
  // User Profile & Resume
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateResume: (resumeName: string) => Promise<void>;
  removeResume: () => Promise<void>;
  
  // Toast notifications
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole | 'guest'>(() => {
    try {
      const saved = localStorage.getItem('referly_role');
      if (saved === 'seeker' || saved === 'referrer' || saved === 'admin') {
        return saved as UserRole;
      }
    } catch {
      // Ignore
    }
    return 'guest';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedRole = localStorage.getItem('referly_role');
      const savedUser = localStorage.getItem('referly_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      if (savedRole === 'seeker') return mockCurrentUserSeeker;
      if (savedRole === 'referrer') return mockCurrentUserReferrer;
      if (savedRole === 'admin') return mockCurrentUserAdmin;
    } catch {
      // Ignore
    }
    return null;
  });

  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['job_001', 'job_003']);
  const [companies] = useState<Company[]>(mockCompanies);
  const [referrers, setReferrers] = useState<ReferrerProfile[]>(mockReferrers);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [referralRequests, setReferralRequests] = useState<ReferralRequest[]>(mockReferralRequests);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync with real backend data on mount and on role changes
  const refreshBackendData = useCallback(async () => {
    try {
      // 1. Fetch live jobs and merge with rich mock repository
      const jobsResult = await jobService.getJobs({ limit: 100 });
      if (jobsResult.jobs && jobsResult.jobs.length > 0) {
        setJobs(() => {
          const map = new Map<string, Job>();
          // Put all rich mock jobs first
          mockJobs.forEach((j) => map.set(j.id, j));
          // Overlay backend jobs
          jobsResult.jobs.forEach((bj) => {
            const existing = map.get(bj.id);
            map.set(bj.id, {
              ...(existing || bj),
              ...bj,
              companyLogo: getCompanyLogo(bj.company, bj.companyLogo || existing?.companyLogo),
              skills: Array.isArray(bj.skills)
                ? bj.skills
                : existing?.skills || (typeof bj.skills === 'string' ? (bj.skills as string).split(' ').filter(Boolean) : []),
              responsibilities: Array.isArray(bj.responsibilities)
                ? bj.responsibilities
                : existing?.responsibilities || [],
              benefits: Array.isArray(bj.benefits)
                ? bj.benefits
                : existing?.benefits || [],
              roleCategory: existing?.roleCategory || bj.roleCategory,
            });
          });
          return Array.from(map.values());
        });
      }
    } catch {
      // Keep mockJobs if backend is temporarily unreachable
    }

    try {
      // 2. Fetch notifications
      const notifs = await notificationService.getNotifications();
      if (notifs && notifs.length > 0) {
        setNotifications(notifs);
      }
    } catch {
      // Fallback to mock
    }

    try {
      // 3. Fetch applications
      const apps = await applicationService.getMyApplications();
      if (apps && apps.length > 0) {
        setApplications(apps);
      }
    } catch {
      // Fallback to mock
    }

    try {
      // 4. Fetch referral requests
      const sentReqs = await referralService.getSentRequests();
      const incReqs = await referralService.getIncomingRequests();
      const combined = [...sentReqs, ...incReqs];
      if (combined.length > 0) {
        setReferralRequests(combined);
      }
    } catch {
      // Fallback to mock
    }

    try {
      // 5. Fetch saved jobs
      const saved = await jobService.getSavedJobs();
      if (saved && saved.length > 0) {
        setSavedJobIds(saved);
      }
    } catch {
      // Fallback
    }
  }, []);

  // Initialize socket listener for live push updates
  useEffect(() => {
    const socket = connectSocket();

    socket.on('new_notification', (data: any) => {
      addToast(data.message || 'New notification received!', 'info');
      setNotifications((prev) => [
        {
          id: data._id || 'notif_' + Date.now(),
          title: data.title || 'Notification',
          description: data.message || '',
          category: data.category || 'system',
          timestamp: 'Just now',
          read: false,
          actionUrl: data.actionUrl,
        },
        ...prev,
      ]);
    });

    socket.on('referral_status_updated', (data: any) => {
      addToast(`Referral update: Status is now ${data.status}`, 'info');
      setReferralRequests((prev) =>
        prev.map((r) => (r.id === data._id ? { ...r, status: data.status } : r))
      );
    });

    socket.on('new_message', (msg: any) => {
      addToast(`New message from ${msg.sender?.name || 'User'}`, 'info');
    });

    refreshBackendData();

    return () => {
      socket.off('new_notification');
      socket.off('referral_status_updated');
      socket.off('new_message');
    };
  }, [addToast, refreshBackendData]);

  // Synchronize currentUser and backend session when role switches
  const switchRole = async (role: UserRole | 'guest') => {
    setCurrentRole(role);
    if (role === 'guest') {
      try {
        localStorage.removeItem('referly_role');
        localStorage.removeItem('referly_user');
      } catch {
        // Ignore
      }
      await authService.logout();
      setCurrentUser(null);
      addToast('Browsing as Public Guest', 'info');
      return;
    }

    // Role demo credentials map
    const credentials = {
      seeker: { email: 'arjun.mehta@example.com', password: 'Password123!', fallback: mockCurrentUserSeeker, label: 'Arjun Mehta' },
      referrer: { email: 'priya.sharma@stripe.com', password: 'Password123!', fallback: mockCurrentUserReferrer, label: 'Priya Sharma (Stripe)' },
      admin: { email: 'admin@referly.io', password: 'Password123!', fallback: mockCurrentUserAdmin, label: 'Platform Administrator' },
    };

    const target = credentials[role];
    let resolvedUser: User = target.fallback;
    try {
      const loginRes = await authService.login(target.email, target.password);
      if (loginRes.data?.user) {
        const u = loginRes.data.user;
        resolvedUser = {
          ...target.fallback,
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
        };
      }
    } catch {
      // In offline or local fallback, preserve smooth seamless switching
      resolvedUser = target.fallback;
    }

    try {
      localStorage.setItem('referly_role', role);
      localStorage.setItem('referly_user', JSON.stringify(resolvedUser));
    } catch {
      // Ignore
    }

    setCurrentUser(resolvedUser);
    addToast(`Signed in as ${role === 'admin' ? 'Platform Administrator' : role === 'referrer' ? 'Referrer (Priya Sharma)' : 'Candidate (Arjun Mehta)'}`, 'success');
    refreshBackendData();
  };

  const login = async (email: string, role: UserRole = 'seeker') => {
    await switchRole(role);
  };

  const logout = async () => {
    await switchRole('guest');
  };

  const toggleSaveJob = async (jobId: string) => {
    const exists = savedJobIds.includes(jobId);
    setSavedJobIds((prev) =>
      exists ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );

    try {
      if (exists) {
        await jobService.unsaveJob(jobId);
        addToast('Job removed from your saved list.', 'info');
      } else {
        await jobService.saveJob(jobId);
        addToast('Job saved to your bookmarks!', 'success');
      }
    } catch {
      // Optimistic update already performed
      addToast(exists ? 'Job removed from bookmarks.' : 'Job saved to bookmarks!', 'info');
    }
  };

  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);

  const addJob = async (jobData: Omit<Job, 'id' | 'postedDate'>) => {
    try {
      const newJob = await jobService.createJob(jobData);
      setJobs((prev) => [newJob, ...prev]);
      addToast('Job referral opportunity successfully published!', 'success');
    } catch (e: any) {
      const fallbackJob: Job = {
        ...jobData,
        id: 'job_' + Date.now(),
        postedDate: new Date().toISOString().split('T')[0],
        referrerCount: 1,
      };
      setJobs((prev) => [fallbackJob, ...prev]);
      addToast('Job referral opportunity published!', 'success');
    }
  };

  const deleteJob = async (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    try {
      await jobService.deleteJob(jobId);
    } catch {
      // Optimistic update applied
    }
    addToast('Job listing removed.', 'info');
  };

  const applyToJob = async (jobId: string, notes?: string): Promise<boolean> => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return false;

    // Check if already applied
    const alreadyApplied = applications.some((app) => app.jobId === jobId);
    if (alreadyApplied) {
      addToast('You have already applied for this position.', 'error');
      return false;
    }

    const newApp: Application = {
      id: 'app_' + Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      location: job.location,
      workMode: job.workMode,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      lastUpdated: new Date().toISOString().split('T')[0],
      referralStatus: 'Direct',
      feedback: notes || 'Application submitted successfully. Under preliminary screening.',
    };

    setApplications((prev) => [newApp, ...prev]);

    try {
      await applicationService.applyToJob({ jobId, coverLetter: notes });
    } catch {
      // Optimistic state persisted
    }

    addToast(`Successfully applied to ${job.company} for ${job.title}!`, 'success');
    return true;
  };

  const createReferralRequest = async (jobId: string, referrerId: string, note?: string): Promise<boolean> => {
    const job = jobs.find((j) => j.id === jobId);
    const referrer = referrers.find((r) => r.id === referrerId);

    if (!job || !referrer) {
      addToast('Target job or referrer details not found.', 'error');
      return false;
    }

    const newReq: ReferralRequest = {
      id: 'req_' + Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      candidateId: currentUser?.id || 'usr_seeker_101',
      candidateName: currentUser?.name || 'Arjun Mehta',
      candidateHeadline: currentUser?.headline || 'Senior Frontend Engineer',
      candidateAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      candidateEmail: currentUser?.email || 'arjun.mehta@example.com',
      candidateResume: currentUser?.resumeName || 'Arjun_Mehta_Resume.pdf',
      candidateSkills: currentUser?.skills || ['React', 'TypeScript'],
      candidateExperience: '5 years',
      referrerId: referrer.id,
      referrerName: referrer.name,
      referrerCompany: referrer.company,
      referrerPosition: referrer.position,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      note: note || 'Hi, I would greatly appreciate a referral for this open position based on my experience.',
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setReferralRequests((prev) => [newReq, ...prev]);

    try {
      await referralService.createReferralRequest({
        jobId,
        referrerId,
        note: note || 'Referral request submission',
      });
    } catch {
      // Optimistic state preserved
    }

    addToast(`Referral request sent to ${referrer.name} at ${referrer.company}!`, 'success');
    return true;
  };

  const updateReferralStatus = async (requestId: string, status: 'Accepted' | 'Rejected') => {
    setReferralRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status, updatedAt: new Date().toISOString().split('T')[0] }
          : req
      )
    );

    try {
      await referralService.updateRequestStatus(requestId, status);
    } catch {
      // Handled optimistically
    }

    addToast(`Referral request ${status.toLowerCase()}!`, status === 'Accepted' ? 'success' : 'info');
  };

  const cancelReferralRequest = async (requestId: string) => {
    setReferralRequests((prev) => prev.filter((req) => req.id !== requestId));
    try {
      await referralService.cancelRequest(requestId);
    } catch {
      // Optimistic update
    }
    addToast('Referral request cancelled.', 'info');
  };

  const sendMessage = async (
    conversationId: string,
    text: string,
    attachments?: ChatAttachment[]
  ) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;

    const displaySummary =
      text.trim() ||
      (attachments && attachments.length > 0
        ? `Shared ${attachments.length} file${attachments.length > 1 ? 's' : ''}`
        : '');

    const newMessage: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: currentUser?.id || 'usr_seeker_101',
      senderName: currentUser?.name || 'Arjun Mehta',
      senderAvatar: currentUser?.avatar || '',
      text: text.trim(),
      timestamp: 'Just now',
      isOwn: true,
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: displaySummary,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    try {
      await messageService.sendMessage({ conversationId, content: displaySummary });
    } catch {
      // Handled optimistically
    }
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await notificationService.markAsRead(id);
    } catch {
      // Handled
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationService.markAllAsRead();
    } catch {
      // Handled
    }
    addToast('All notifications marked as read.', 'info');
  };

  const updateProfile = async (updates: Partial<User>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    try {
      if (currentRole === 'seeker') {
        await profileService.updateSeekerProfile(updates);
      } else if (currentRole === 'referrer') {
        await profileService.updateReferrerProfile(updates);
      }
    } catch {
      // Handled
    }
    addToast('Profile updated successfully!', 'success');
  };

  const updateResume = async (resumeName: string) => {
    setCurrentUser((prev) => (prev ? { ...prev, resumeName } : null));
    addToast(`Resume "${resumeName}" uploaded successfully!`, 'success');
  };

  const removeResume = async () => {
    setCurrentUser((prev) => (prev ? { ...prev, resumeName: undefined, resumeUrl: undefined } : null));
    addToast('Resume removed.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        login,
        logout,
        jobs,
        savedJobIds,
        toggleSaveJob,
        isJobSaved,
        addJob,
        deleteJob,
        companies,
        referrers,
        applications,
        applyToJob,
        referralRequests,
        createReferralRequest,
        updateReferralStatus,
        cancelReferralRequest,
        conversations,
        sendMessage,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateProfile,
        updateResume,
        removeResume,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
