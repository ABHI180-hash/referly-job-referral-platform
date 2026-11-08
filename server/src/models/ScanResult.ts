import mongoose, { Document, Schema } from 'mongoose';
import { LaunchStatus } from './Website';

export type CheckStatus = 'passed' | 'failed' | 'warning' | 'not_checked' | 'scanning';

export interface ICheckItem {
  checkId: number;
  name: string;
  category: 'performance' | 'seo' | 'security' | 'content' | 'integrations' | 'compliance';
  isMandatory: boolean;
  status: CheckStatus;
  score: number; // 0 to 100
  details: string;
  fixSuggestion: string;
  meta?: Record<string, any>;
  lastChecked: Date;
  isManualVerified?: boolean;
  verificationNote?: string;
}

export interface IScanResult extends Document {
  websiteId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  url: string;
  domain: string;
  readinessScore: number; // 0 to 100%
  launchStatus: LaunchStatus;
  passedCount: number;
  failedCount: number;
  warningCount: number;
  durationMs: number;
  checks: ICheckItem[];
  createdAt: Date;
}

const checkItemSchema = new Schema<ICheckItem>(
  {
    checkId: { type: Number, required: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['performance', 'seo', 'security', 'content', 'integrations', 'compliance'],
      required: true,
    },
    isMandatory: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['passed', 'failed', 'warning', 'not_checked', 'scanning'],
      default: 'not_checked',
    },
    score: { type: Number, default: 0 },
    details: { type: String, default: '' },
    fixSuggestion: { type: String, default: '' },
    meta: { type: Schema.Types.Mixed, default: {} },
    lastChecked: { type: Date, default: Date.now },
    isManualVerified: { type: Boolean, default: false },
    verificationNote: { type: String, default: '' },
  },
  { _id: false }
);

const scanResultSchema = new Schema<IScanResult>(
  {
    websiteId: {
      type: Schema.Types.Mixed,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.Mixed,
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
      index: true,
    },
    readinessScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    launchStatus: {
      type: String,
      enum: ['GO', 'NO-GO', 'CONDITIONAL'],
      required: true,
    },
    passedCount: {
      type: Number,
      default: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
    },
    warningCount: {
      type: Number,
      default: 0,
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    checks: [checkItemSchema],
  },
  {
    timestamps: true,
  }
);

export const ScanResult = mongoose.model<IScanResult>('ScanResult', scanResultSchema);
