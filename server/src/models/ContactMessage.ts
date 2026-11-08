import mongoose, { Document, Schema } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'resolved'],
      default: 'unread',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ContactMessage = mongoose.model<IContactMessage>(
  'ContactMessage',
  ContactMessageSchema
);
