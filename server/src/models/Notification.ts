import mongoose, { Document, Schema } from 'mongoose';

export type NotificationCategory = 'referral' | 'application' | 'message' | 'system';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  category: NotificationCategory;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityId?: mongoose.Types.ObjectId;
  relatedEntityType?: string;
  actionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['referral', 'application', 'message', 'system'],
      default: 'system',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedEntityId: {
      type: Schema.Types.ObjectId,
    },
    relatedEntityType: {
      type: String,
    },
    actionUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>(
  'Notification',
  NotificationSchema
);
