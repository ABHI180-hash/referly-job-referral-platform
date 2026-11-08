import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType = 'critical' | 'warning' | 'success' | 'info';

export interface ILaunchNotification extends Document {
  userId: mongoose.Types.ObjectId | string;
  websiteId?: mongoose.Types.ObjectId | string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}

const launchNotificationSchema = new Schema<ILaunchNotification>(
  {
    userId: {
      type: Schema.Types.Mixed,
      required: true,
      index: true,
    },
    websiteId: {
      type: Schema.Types.Mixed,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['critical', 'warning', 'success', 'info'],
      default: 'info',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const LaunchNotification = mongoose.model<ILaunchNotification>(
  'LaunchNotification',
  launchNotificationSchema
);
