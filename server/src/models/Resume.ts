import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  user: mongoose.Types.ObjectId;
  originalFilename: string;
  cloudStorageUrl: string;
  fileType: string;
  fileSize: number;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalFilename: {
      type: String,
      required: true,
      trim: true,
    },
    cloudStorageUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      default: 'application/pdf',
    },
    fileSize: {
      type: Number,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
