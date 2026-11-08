import { Request, Response, NextFunction } from 'express';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { getIO } from '../sockets/socketHandler';

export const getConversations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate('participants', 'name email avatar role')
      .populate('relatedJob', 'title company')
      .sort({ lastMessageAt: -1 });

    // Format for client UI
    const formatted = conversations.map((conv: any) => {
      const otherParticipant =
        conv.participants.find((p: any) => p._id.toString() !== userId) ||
        conv.participants[0];

      return {
        id: conv._id,
        contactId: otherParticipant?._id,
        contactName: otherParticipant?.name || 'Contact',
        contactRole: otherParticipant?.role || 'User',
        contactCompany: (conv.relatedJob as any)?.company || 'Corporate Partner',
        contactAvatar: otherParticipant?.avatar,
        online: true,
        lastMessage: conv.lastMessage || 'Start a conversation...',
        lastMessageTime: new Date(conv.lastMessageAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        unreadCount: conv.unreadCount?.get(userId || '') || 0,
      };
    });

    sendSuccess(res, 200, 'Conversations retrieved.', formatted);
  } catch (error) {
    next(error);
  }
};

export const getMessagesByConversation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      sendError(res, 404, 'Conversation not found.');
      return;
    }

    // Verify participation
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId
    );
    if (!isParticipant && req.user?.role !== 'admin') {
      sendError(res, 403, 'Unauthorized access to this conversation.');
      return;
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read for this user
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: userId }, isRead: false },
      { $set: { isRead: true } }
    );

    const formattedMessages = messages.map((m: any) => ({
      id: m._id,
      conversationId: m.conversation,
      senderId: m.sender?._id,
      senderName: m.sender?.name,
      senderAvatar: m.sender?.avatar,
      text: m.content,
      timestamp: new Date(m.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isOwn: m.sender?._id.toString() === userId,
    }));

    sendSuccess(res, 200, 'Messages retrieved.', formattedMessages);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const senderId = req.user?.userId;
    const { conversationId, content } = req.body;

    if (!conversationId || !content || !content.trim()) {
      sendError(res, 400, 'Conversation ID and message content are required.');
      return;
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      sendError(res, 404, 'Conversation not found.');
      return;
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === senderId
    );
    if (!isParticipant) {
      sendError(res, 403, 'You are not a participant in this conversation.');
      return;
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      content: content.trim(),
      messageType: 'text',
      isRead: false,
    });

    conversation.lastMessage = content.trim();
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const senderUser = await User.findById(senderId);

    // Identify recipient
    const recipientId = conversation.participants.find(
      (p) => p.toString() !== senderId
    );

    // Real-time Socket.IO emission
    try {
      const io = getIO();
      if (io) {
        io.to(`conv_${conversationId}`).emit('new_message', {
          id: message._id,
          conversationId,
          senderId,
          senderName: senderUser?.name,
          senderAvatar: senderUser?.avatar,
          text: message.content,
          timestamp: 'Just now',
          isOwn: false,
        });

        if (recipientId) {
          io.to(recipientId.toString()).emit('message_received', {
            conversationId,
            senderName: senderUser?.name,
            text: message.content,
          });
        }
      }
    } catch (socketErr) {}

    sendSuccess(res, 201, 'Message sent successfully.', {
      id: message._id,
      conversationId,
      senderId,
      senderName: senderUser?.name,
      senderAvatar: senderUser?.avatar,
      text: message.content,
      timestamp: 'Just now',
      isOwn: true,
    });
  } catch (error) {
    next(error);
  }
};

export const startConversation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const senderId = req.user?.userId;
    const { contactId, jobId } = req.body;

    if (!contactId) {
      sendError(res, 400, 'Contact ID is required.');
      return;
    }

    // Check if conversation already exists between these 2 users
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, contactId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, contactId],
        relatedJob: jobId,
        lastMessage: 'Conversation initiated.',
        lastMessageAt: new Date(),
      });
    }

    sendSuccess(res, 201, 'Conversation initialized.', conversation);
  } catch (error) {
    next(error);
  }
};
