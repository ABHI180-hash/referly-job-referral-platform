import mongoose, { Document, Schema } from 'mongoose';

export type ReferralStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Cancelled';

export interface IReferralRequest extends Document {
  seeker: mongoose.Types.ObjectId;
  referrer: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  note: string;
  resumeUrl?: string;
  resumeName?: string;
  status: ReferralStatus;
  referrerResponse?: string;
  statusHistory: Array<{
    status: ReferralStatus;
    changedAt: Date;
    comment?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralRequestSchema = new Schema<IReferralRequest>(
  {
    seeker: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    referrer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    note: {
      type: String,
      required: [true, 'Introductory note is required'],
      trim: true,
    },
    resumeUrl: {
      type: String,
    },
    resumeName: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    referrerResponse: {
      type: String,
      default: '',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        comment: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ReferralRequestSchema.index({ seeker: 1, referrer: 1, job: 1, status: 1 });

export const ReferralRequest = mongoose.model<IReferralRequest>(
  'ReferralRequest',
  ReferralRequestSchema
);
