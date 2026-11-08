import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscriptionPlan extends Document {
  planId: 'free' | 'pro' | 'enterprise';
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular: boolean;
  ctaText: string;
  features: string[];
  limits: {
    referralsPerMonth: number;
    applicationTracking: string;
    profileBadge: boolean;
    priorityMatching: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    planId: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    monthlyPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    yearlyPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    ctaText: {
      type: String,
      default: 'Select Plan',
    },
    features: {
      type: [String],
      default: [],
    },
    limits: {
      referralsPerMonth: { type: Number, default: 2 },
      applicationTracking: { type: String, default: 'Basic' },
      profileBadge: { type: Boolean, default: false },
      priorityMatching: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SubscriptionPlan = mongoose.model<ISubscriptionPlan>(
  'SubscriptionPlan',
  SubscriptionPlanSchema
);
