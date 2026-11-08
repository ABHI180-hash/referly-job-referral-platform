import { Request, Response } from 'express';
import { LaunchNotification, ILaunchNotification, NotificationType } from '../models/LaunchNotification';
import { sendSuccess, sendError } from '../utils/response';

export class LaunchNotificationController {
  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id || 'demo_user_001';
      let notifications = await LaunchNotification.find({ userId }).sort({ createdAt: -1 }).limit(30);

      // Seed initial telemetry alerts if empty
      if (notifications.length === 0) {
        const seedNotifs = [
          {
            userId,
            title: 'Scan Complete: LaunchPilot App',
            message: 'All 15 checks verified. Readiness is at 92%. Launch system Armed.',
            type: 'success' as NotificationType,
            read: false,
          },
          {
            userId,
            title: 'Warning: Missing OpenGraph Meta',
            message: 'Acme SaaS Cloud Platform is missing og:image social preview banner.',
            type: 'warning' as NotificationType,
            read: false,
          },
          {
            userId,
            title: 'SSL Expiration Notice',
            message: 'Apex Commerce SSL certificate is valid for 74 more days.',
            type: 'info' as NotificationType,
            read: true,
          },
        ];
        await LaunchNotification.create(seedNotifs);
        notifications = await LaunchNotification.find({ userId }).sort({ createdAt: -1 });
      }

      sendSuccess(res, 200, 'Notifications retrieved.', notifications);
    } catch (err: any) {
      sendError(res, 500, `Failed to retrieve notifications: ${err.message}`);
    }
  }

  public static async markRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await LaunchNotification.findByIdAndUpdate(id, { read: true });
      sendSuccess(res, 200, 'Notification marked as read.');
    } catch (err: any) {
      sendError(res, 500, `Failed to update notification: ${err.message}`);
    }
  }

  public static async markAllRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id || 'demo_user_001';
      await LaunchNotification.updateMany({ userId }, { read: true });
      sendSuccess(res, 200, 'All notifications marked as read.');
    } catch (err: any) {
      sendError(res, 500, `Failed to update notifications: ${err.message}`);
    }
  }
}
