import { Request, Response, NextFunction } from 'express';
import { Notification } from '../models/Notification';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { category } = req.query;

    const filter: any = { recipient: userId };
    if (category && category !== 'all') {
      filter.category = category;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    const formatted = notifications.map((n) => ({
      id: n._id,
      title: n.title,
      description: n.message,
      category: n.category,
      timestamp: new Date(n.createdAt).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      }),
      read: n.isRead,
      actionUrl: n.actionUrl,
    }));

    sendSuccess(res, 200, 'Notifications retrieved.', formatted, { unreadCount });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      sendError(res, 404, 'Notification not found.');
      return;
    }

    sendSuccess(res, 200, 'Notification marked as read.');
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
    sendSuccess(res, 200, 'All notifications marked as read.');
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    await Notification.findOneAndDelete({ _id: req.params.id, recipient: userId });
    sendSuccess(res, 200, 'Notification deleted.');
  } catch (error) {
    next(error);
  }
};
