import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '@/layouts/PublicLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';

// Public Pages
import { LandingPage } from '@/pages/public/LandingPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { JobsPage } from '@/pages/public/JobsPage';
import { JobDetailsPage } from '@/pages/public/JobDetailsPage';
import { ReferralsPage } from '@/pages/public/ReferralsPage';
import { CompaniesPage } from '@/pages/public/CompaniesPage';
import { PricingPage } from '@/pages/public/PricingPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { PrivacyPolicyPage } from '@/pages/public/PrivacyPolicyPage';
import { TermsOfServicePage } from '@/pages/public/TermsOfServicePage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';

// Seeker Pages
import { SeekerOverviewPage } from '@/pages/seeker/SeekerOverviewPage';
import { SeekerProfilePage } from '@/pages/seeker/SeekerProfilePage';
import { SeekerSavedJobsPage } from '@/pages/seeker/SeekerSavedJobsPage';
import { SeekerApplicationsPage } from '@/pages/seeker/SeekerApplicationsPage';
import { SeekerReferralRequestsPage } from '@/pages/seeker/SeekerReferralRequestsPage';
import { SeekerMessagesPage } from '@/pages/seeker/SeekerMessagesPage';
import { SeekerNotificationsPage } from '@/pages/seeker/SeekerNotificationsPage';
import { SeekerResumePage } from '@/pages/seeker/SeekerResumePage';
import { SeekerSubscriptionPage } from '@/pages/seeker/SeekerSubscriptionPage';
import { SeekerSettingsPage } from '@/pages/seeker/SeekerSettingsPage';

// Referrer Pages
import { ReferrerOverviewPage } from '@/pages/referrer/ReferrerOverviewPage';
import { ReferrerProfilePage } from '@/pages/referrer/ReferrerProfilePage';
import { ReferrerRequestsPage } from '@/pages/referrer/ReferrerRequestsPage';
import { ReferrerReferralsPage } from '@/pages/referrer/ReferrerReferralsPage';
import { ReferCandidatePage } from '@/pages/referrer/ReferCandidatePage';

// Admin Pages
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminJobsPage } from '@/pages/admin/AdminJobsPage';
import { AdminReferralsPage } from '@/pages/admin/AdminReferralsPage';
import { AdminCompaniesPage } from '@/pages/admin/AdminCompaniesPage';
import { AdminSubscriptionsPage } from '@/pages/admin/AdminSubscriptionsPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

// LaunchPilot - Website Launch Control Center
import { LaunchControlLayout } from '@/layouts/LaunchControlLayout';
import { LaunchDashboardPage } from '@/pages/launchpilot/LaunchDashboardPage';
import { LaunchChecklistPage } from '@/pages/launchpilot/LaunchChecklistPage';
import { MyWebsitesPage } from '@/pages/launchpilot/MyWebsitesPage';
import { LaunchAnalyticsPage } from '@/pages/launchpilot/LaunchAnalyticsPage';
import { ScanHistoryPage } from '@/pages/launchpilot/ScanHistoryPage';
import { LaunchSettingsPage } from '@/pages/launchpilot/LaunchSettingsPage';
import { LaunchProfilePage } from '@/pages/launchpilot/LaunchProfilePage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* PUBLIC REFERLY CAREER & NETWORKING PORTAL (PRIMARY WEBSITE) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/referly" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/referrals" element={<ReferralsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* LAUNCHPILOT - WEBSITE LAUNCH CONTROL CENTER */}
      <Route path="/launchpilot" element={<LaunchControlLayout />}>
        <Route index element={<LaunchDashboardPage />} />
        <Route path="checklist" element={<LaunchChecklistPage />} />
        <Route path="websites" element={<MyWebsitesPage />} />
        <Route path="analytics" element={<LaunchAnalyticsPage />} />
        <Route path="history" element={<ScanHistoryPage />} />
        <Route path="settings" element={<LaunchSettingsPage />} />
        <Route path="profile" element={<LaunchProfilePage />} />
      </Route>

      {/* JOB SEEKER DASHBOARD */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<SeekerOverviewPage />} />
        <Route path="profile" element={<SeekerProfilePage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="saved-jobs" element={<SeekerSavedJobsPage />} />
        <Route path="applications" element={<SeekerApplicationsPage />} />
        <Route path="referral-requests" element={<SeekerReferralRequestsPage />} />
        <Route path="messages" element={<SeekerMessagesPage />} />
        <Route path="notifications" element={<SeekerNotificationsPage />} />
        <Route path="resume" element={<SeekerResumePage />} />
        <Route path="subscription" element={<SeekerSubscriptionPage />} />
        <Route path="settings" element={<SeekerSettingsPage />} />
      </Route>

      {/* REFERRER DASHBOARD */}
      <Route path="/referrer-dashboard" element={<DashboardLayout />}>
        <Route index element={<ReferrerOverviewPage />} />
        <Route path="profile" element={<ReferrerProfilePage />} />
        <Route path="requests" element={<ReferrerRequestsPage />} />
        <Route path="referrals" element={<ReferrerReferralsPage />} />
        <Route path="refer-candidate" element={<ReferCandidatePage />} />
        <Route path="messages" element={<SeekerMessagesPage />} />
        <Route path="notifications" element={<SeekerNotificationsPage />} />
        <Route path="settings" element={<SeekerSettingsPage />} />
      </Route>

      {/* ADMIN DASHBOARD */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<AdminOverviewPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="jobs" element={<AdminJobsPage />} />
        <Route path="referrals" element={<AdminReferralsPage />} />
        <Route path="applications" element={<SeekerApplicationsPage />} />
        <Route path="companies" element={<AdminCompaniesPage />} />
        <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="notifications" element={<SeekerNotificationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 404 NOT FOUND ROUTE */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
