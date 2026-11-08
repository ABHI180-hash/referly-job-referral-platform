import mongoose, { Document, Schema } from 'mongoose';

export type ApplicationStage =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export interface IApplication extends Document {
  seeker: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  referralRequest?: mongoose.Types.ObjectId;
  appliedDate: Date;
  status: ApplicationStage;
  notes?: string;
  feedback?: string;
  statusHistory: Array<{
    status: ApplicationStage;
    changedAt: Date;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    seeker: {
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
    referralRequest: {
      type: Schema.Types.ObjectId,
      ref: 'ReferralRequest',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview',
        'Selected',
        'Rejected',
      ],
      default: 'Applied',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
    feedback: {
      type: String,
      default: '',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active applications from the same seeker for the same job
ApplicationSchema.index({ seeker: 1, job: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>(
  'Application',
  ApplicationSchema
);
