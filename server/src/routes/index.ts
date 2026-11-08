import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import profileRoutes from './profileRoutes';
import jobRoutes from './jobRoutes';
import companyRoutes from './companyRoutes';
import referralRoutes from './referralRoutes';
import applicationRoutes from './applicationRoutes';
import savedJobRoutes from './savedJobRoutes';
import messageRoutes from './messageRoutes';
import notificationRoutes from './notificationRoutes';
import resumeRoutes from './resumeRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import adminRoutes from './adminRoutes';
import contactRoutes from './contactRoutes';
import launchWebsiteRoutes from './launchWebsiteRoutes';
import launchScanRoutes from './launchScanRoutes';
import launchAnalyticsRoutes from './launchAnalyticsRoutes';
import launchNotificationRoutes from './launchNotificationRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profiles', profileRoutes);
router.use('/jobs', jobRoutes);
router.use('/companies', companyRoutes);
router.use('/referrals', referralRoutes);
router.use('/applications', applicationRoutes);
router.use('/saved-jobs', savedJobRoutes);
router.use('/messages', messageRoutes);
router.use('/notifications', notificationRoutes);
router.use('/resumes', resumeRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/admin', adminRoutes);
router.use('/contact', contactRoutes);

// LaunchPilot - Website Launch Control Center API Routes
router.use('/launchpilot/websites', launchWebsiteRoutes);
router.use('/launchpilot/scans', launchScanRoutes);
router.use('/launchpilot/analytics', launchAnalyticsRoutes);
router.use('/launchpilot/notifications', launchNotificationRoutes);

// Convenience aliases
router.use('/websites', launchWebsiteRoutes);
router.use('/scans', launchScanRoutes);

export default router;
