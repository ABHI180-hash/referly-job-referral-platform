export type UserRole = 'seeker' | 'referrer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  headline?: string;
  company?: string;
  position?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  education?: string;
  experienceYears?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  resumeName?: string;
  resumeUrl?: string;
  plan?: 'free' | 'pro' | 'enterprise';
  billingInterval?: 'monthly' | 'yearly';
  profileVisibility?: boolean;
  createdAt: string;
}

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type JobType = 'Full-time' | 'Contract' | 'Part-time' | 'Internship';
export type ExperienceLevel = 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead / Staff';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  workMode: WorkMode;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  experienceRange: string;
  salary: string;
  minSalary?: number;
  maxSalary?: number;
  description: string;
  responsibilities: string[];
  skills: string[];
  benefits: string[];
  aboutCompany: string;
  postedDate: string;
  department: string;
  roleCategory?: string;
  featured?: boolean;
  openPositions?: number;
  referrerCount?: number;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  employeeCount: string;
  openPositions: number;
  description: string;
  website: string;
  featured?: boolean;
  hiringRoles?: string[];
  techStack?: string[];
}

export interface ReferrerProfile {
  id: string;
  name: string;
  avatar: string;
  company: string;
  companyLogo: string;
  position: string;
  department: string;
  roleCategory?: string;
  experienceYears: number;
  skills: string[];
  bio: string;
  availability: 'Available' | 'Busy' | 'Unavailable';
  totalReferrals: number;
  successRate: number;
  linkedinUrl: string;
  featured?: boolean;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  workMode: string;
  appliedDate: string;
  status: ApplicationStatus;
  lastUpdated: string;
  referralStatus?: 'Direct' | 'Referred' | 'Pending Referral';
  referrerName?: string;
  feedback?: string;
}

export type ReferralRequestStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Completed';

export interface ReferralRequest {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateId: string;
  candidateName: string;
  candidateHeadline: string;
  candidateAvatar: string;
  candidateEmail: string;
  candidateResume?: string;
  candidateSkills?: string[];
  candidateExperience?: string;
  referrerId: string;
  referrerName: string;
  referrerCompany: string;
  referrerPosition?: string;
  requestDate: string;
  status: ReferralRequestStatus;
  note?: string;
  updatedAt?: string;
}

export interface ChatAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  category?: 'resume' | 'document' | 'image' | 'code';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  attachments?: ChatAttachment[];
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactRole: string;
  contactCompany: string;
  contactAvatar: string;
  online: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: 'referral' | 'application' | 'message' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface PricingPlan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
  ctaText: string;
  limits: {
    referralsPerMonth: number | 'Unlimited';
    applicationTracking: string;
    profileBadge: boolean;
    priorityMatching: boolean;
  };
}
