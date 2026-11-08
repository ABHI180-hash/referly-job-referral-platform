import mongoose, { Document, Schema } from 'mongoose';

export interface IReferrerProfile extends Document {
  user: mongoose.Types.ObjectId;
  company: string;
  position: string;
  experienceYears: number;
  skills: string[];
  bio: string;
  linkedinUrl?: string;
  department?: string;
  companyInfo?: string;
  availability: 'Available' | 'Busy' | 'Unavailable';
  totalReferrals: number;
  successRate: number;
  profileVisibility: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReferrerProfileSchema = new Schema<IReferrerProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Current company is required'],
      trim: true,
      index: true,
    },
    position: {
      type: String,
      required: [true, 'Current job position is required'],
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 3,
      min: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      default: 'Engineering',
      trim: true,
    },
    companyInfo: {
      type: String,
      default: '',
    },
    availability: {
      type: String,
      enum: ['Available', 'Busy', 'Unavailable'],
      default: 'Available',
      index: true,
    },
    totalReferrals: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      default: 85,
    },
    profileVisibility: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ReferrerProfileSchema.index({ company: 1, availability: 1 });
ReferrerProfileSchema.index({ skills: 1 });

export const ReferrerProfile = mongoose.model<IReferrerProfile>(
  'ReferrerProfile',
  ReferrerProfileSchema
);
