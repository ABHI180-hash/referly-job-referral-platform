import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  relatedJob?: mongoose.Types.ObjectId;
  relatedReferral?: mongoose.Types.ObjectId;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    relatedJob: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
    },
    relatedReferral: {
      type: Schema.Types.ObjectId,
      ref: 'ReferralRequest',
    },
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

export const Conversation = mongoose.model<IConversation>(
  'Conversation',
  ConversationSchema
);
