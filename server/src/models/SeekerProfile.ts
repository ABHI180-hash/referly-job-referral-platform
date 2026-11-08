import mongoose, { Document, Schema } from 'mongoose';

export interface ISeekerProfile extends Document {
  user: mongoose.Types.ObjectId;
  headline: string;
  bio: string;
  phoneNumber?: string;
  location: string;
  education: string;
  skills: string[];
  experienceYears: number;
  linkedinUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
  resumeName?: string;
  profileCompletion: number;
  visibilityPreferences: {
    allowDiscovery: boolean;
    showContactInfo: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SeekerProfileSchema = new Schema<ISeekerProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    headline: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      default: 'Bengaluru, India',
      trim: true,
    },
    education: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
    },
    resumeName: {
      type: String,
    },
    profileCompletion: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    visibilityPreferences: {
      allowDiscovery: {
        type: Boolean,
        default: true,
      },
      showContactInfo: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

SeekerProfileSchema.index({ skills: 1 });
SeekerProfileSchema.index({ location: 1 });

export const SeekerProfile = mongoose.model<ISeekerProfile>(
  'SeekerProfile',
  SeekerProfileSchema
);
