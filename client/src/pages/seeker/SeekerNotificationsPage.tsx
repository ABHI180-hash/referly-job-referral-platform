import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { EmptyState } from '@/components/common/EmptyState';
import {
  Bell,
  CheckCircle2,
  FileCheck2,
  Send,
  MessageSquare,
  Sparkles,
  Check,
} from 'lucide-react';

export const SeekerNotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredNotifs = notifications.filter(
    (n) => selectedCategory === 'all' || n.category === selectedCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'referral':
        return <Send className="w-4 h-4 text-indigo-600" />;
      case 'application':
        return <FileCheck2 className="w-4 h-4 text-emerald-600" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageMeta
        title="Notifications"
        description="Stay updated on referral responses, interview invites, and application progress."
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Notifications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding referrals, application reviews, and direct messages.
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors self-start shadow-xs"
        >
          <Check className="w-3.5 h-3.5 text-indigo-600" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['all', 'referral', 'application', 'message', 'system'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifs.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden">
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                notif.read ? 'hover:bg-slate-50/70' : 'bg-indigo-50/30 hover:bg-indigo-50/50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-slate-100 border border-slate-200/80 flex-shrink-0 mt-0.5">
                  {getCategoryIcon(notif.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{notif.title}</h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notif.description}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              {!notif.read && (
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 flex-shrink-0">
                  New
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications in this category"
          description="You're all caught up! New alerts will appear here as soon as referrers take action."
        />
      )}
    </div>
  );
};
