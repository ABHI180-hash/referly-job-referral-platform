import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  user: mongoose.Types.ObjectId;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  billingCycle: 'monthly' | 'yearly';
  startDate: Date;
  expiryDate: Date;
  amount: number;
  paymentReference?: string;
  referralsUsedThisMonth: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'past_due'],
      default: 'active',
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'yearly',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    amount: {
      type: Number,
      default: 0,
    },
    paymentReference: {
      type: String,
      default: 'sim_pay_initial',
    },
    referralsUsedThisMonth: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model<ISubscription>(
  'Subscription',
  SubscriptionSchema
);
