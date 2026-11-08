import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedJob extends Document {
  user: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  createdAt: Date;
}

const SavedJobSchema = new Schema<ISavedJob>(
  {
    user: {
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
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound unique index ensuring a user cannot save the same job multiple times
SavedJobSchema.index({ user: 1, job: 1 }, { unique: true });

export const SavedJob = mongoose.model<ISavedJob>('SavedJob', SavedJobSchema);
