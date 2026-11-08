import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  companyRef?: mongoose.Types.ObjectId;
  companyLogo: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  jobType: 'Full-time' | 'Contract' | 'Part-time' | 'Internship';
  experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead / Staff';
  experienceRange: string;
  salary: string;
  minSalary?: number;
  maxSalary?: number;
  department: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  benefits: string[];
  aboutCompany: string;
  applicationUrl?: string;
  postedBy?: mongoose.Types.ObjectId;
  status: 'active' | 'closed' | 'draft';
  featured: boolean;
  openPositions: number;
  referrerCount: number;
  postedDate: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    companyRef: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyLogo: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120',
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
      index: true,
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Hybrid',
      index: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Contract', 'Part-time', 'Internship'],
      default: 'Full-time',
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Entry-level', 'Mid-level', 'Senior', 'Lead / Staff'],
      default: 'Mid-level',
      index: true,
    },
    experienceRange: {
      type: String,
      default: '3 - 6 years',
    },
    salary: {
      type: String,
      default: 'Competitive',
    },
    minSalary: {
      type: Number,
    },
    maxSalary: {
      type: Number,
    },
    department: {
      type: String,
      default: 'Engineering',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    benefits: {
      type: [String],
      default: [],
    },
    aboutCompany: {
      type: String,
      default: '',
    },
    applicationUrl: {
      type: String,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    openPositions: {
      type: Number,
      default: 1,
    },
    referrerCount: {
      type: Number,
      default: 1,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text search index for high-performance job discovery
JobSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
  skills: 'text',
});

export const Job = mongoose.model<IJob>('Job', JobSchema);
