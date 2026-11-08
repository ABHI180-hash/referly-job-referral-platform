import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { Modal } from '@/components/common/Modal';
import { Shield, Bell, Eye, Lock, Trash2, CheckCircle2 } from 'lucide-react';

export const SeekerSettingsPage: React.FC = () => {
  const { currentUser, addToast } = useApp();

  const [profileVisible, setProfileVisible] = useState(currentUser?.profileVisibility ?? true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [referralAlerts, setReferralAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Preferences saved successfully!', 'success');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      addToast('Please complete all password fields.', 'error');
      return;
    }
    if (passwords.next.length < 6) {
      addToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    addToast('Security password updated successfully!', 'success');
    setPasswords({ current: '', next: '', confirm: '' });
  };

  const handleDeleteAccount = () => {
    setDeleteModalOpen(false);
    addToast('Account deletion confirmed in demo mode.', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageMeta
        title="Account Settings"
        description="Configure your Referly candidate account preferences, privacy, and security."
      />
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Account Settings & Security</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your privacy, communication channels, and security credentials.
        </p>
      </div>

      {/* Privacy & Visibility */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Eye className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Profile Visibility & Discovery</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-900 block">
                Allow Verified Employees to Discover My Profile
              </span>
              <span className="text-xs text-slate-500">
                When enabled, verified referrers can proactively reach out to you with relevant open roles.
              </span>
            </div>
            <input
              type="checkbox"
              checked={profileVisible}
              onChange={(e) => setProfileVisible(e.target.checked)}
              className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
        </div>

        <div className="space-y-4 text-xs">
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-900 block">Referral Status Updates</span>
              <span className="text-slate-500">
                Receive notifications when referrers accept, review, or submit your referral request.
              </span>
            </div>
            <input
              type="checkbox"
              checked={referralAlerts}
              onChange={(e) => setReferralAlerts(e.target.checked)}
              className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
          </label>

          <label className="flex items-start justify-between gap-4 cursor-pointer pt-3 border-t border-slate-100">
            <div>
              <span className="font-semibold text-slate-900 block">Direct Message Alerts</span>
              <span className="text-slate-500">
                Receive real-time alerts whenever an employee messages you.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Lock className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-rose-50/60 rounded-2xl border border-rose-200 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-rose-900">Danger Zone</h3>
        <p className="text-xs text-rose-700 leading-relaxed max-w-xl">
          Permanently delete your Referly candidate profile, submitted applications, and ongoing referral dialogues. This action is irreversible.
        </p>

        <button
          onClick={() => setDeleteModalOpen(true)}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
        >
          Delete My Account
        </button>
      </div>

      {/* Confirmation Dialog */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Your Referly Account?"
        description="This action cannot be undone."
      >
        <div className="space-y-4 text-xs text-slate-600">
          <p>
            Are you sure you want to delete your candidate profile? All active referral requests and application histories will be permanently removed.
          </p>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700"
            >
              Yes, Delete Account
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
