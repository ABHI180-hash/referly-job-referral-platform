export type LaunchStatus = 'GO' | 'NO-GO' | 'CONDITIONAL' | 'NOT_SCANNED';
export type CheckStatus = 'passed' | 'failed' | 'warning' | 'not_checked' | 'scanning';
export type EnvironmentType = 'production' | 'staging' | 'preview';
export type CheckCategory = 'performance' | 'seo' | 'security' | 'content' | 'integrations' | 'compliance';

export interface ICheckItem {
  checkId: number;
  name: string;
  category: CheckCategory;
  isMandatory: boolean;
  status: CheckStatus;
  score: number; // 0 to 100
  details: string;
  fixSuggestion: string;
  meta?: Record<string, any>;
  lastChecked: string | Date;
  isManualVerified?: boolean;
  verificationNote?: string;
}

export interface IWebsite {
  _id: string;
  id?: string;
  userId: string;
  name: string;
  url: string;
  domain: string;
  category: string;
  environment: EnvironmentType;
  readinessScore: number;
  launchStatus: LaunchStatus;
  lastScanAt?: string;
  totalScans: number;
  isStarred: boolean;
  sslValid: boolean;
  responseTimeMs: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IScanResult {
  _id: string;
  id?: string;
  websiteId: string;
  userId: string;
  url: string;
  domain: string;
  readinessScore: number;
  launchStatus: LaunchStatus;
  passedCount: number;
  failedCount: number;
  warningCount: number;
  durationMs: number;
  checks: ICheckItem[];
  createdAt: string;
}

export interface ILaunchNotification {
  _id: string;
  userId: string;
  websiteId?: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  read: boolean;
  createdAt: string;
}
