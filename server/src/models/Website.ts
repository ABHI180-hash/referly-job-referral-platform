import mongoose, { Document, Schema } from 'mongoose';

export type LaunchStatus = 'GO' | 'NO-GO' | 'CONDITIONAL' | 'NOT_SCANNED';
export type EnvironmentType = 'production' | 'staging' | 'preview';

export interface IWebsite extends Document {
  userId: mongoose.Types.ObjectId | string;
  name: string;
  url: string;
  domain: string;
  category: string;
  environment: EnvironmentType;
  readinessScore: number;
  launchStatus: LaunchStatus;
  lastScanAt?: Date;
  totalScans: number;
  isStarred: boolean;
  sslValid: boolean;
  responseTimeMs: number;
  createdAt: Date;
  updatedAt: Date;
}

const websiteSchema = new Schema<IWebsite>(
  {
    userId: {
      type: Schema.Types.Mixed,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Website name is required'],
      trim: true,
      maxlength: [100, 'Website name cannot exceed 100 characters'],
    },
    url: {
      type: String,
      required: [true, 'Website URL is required'],
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      default: 'SaaS',
      trim: true,
    },
    environment: {
      type: String,
      enum: ['production', 'staging', 'preview'],
      default: 'production',
    },
    readinessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    launchStatus: {
      type: String,
      enum: ['GO', 'NO-GO', 'CONDITIONAL', 'NOT_SCANNED'],
      default: 'NOT_SCANNED',
    },
    lastScanAt: {
      type: Date,
    },
    totalScans: {
      type: Number,
      default: 0,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    sslValid: {
      type: Boolean,
      default: false,
    },
    responseTimeMs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Website = mongoose.model<IWebsite>('Website', websiteSchema);
