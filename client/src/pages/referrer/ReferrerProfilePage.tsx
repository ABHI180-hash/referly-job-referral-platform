import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { Building2, Briefcase, MapPin, Globe, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ReferrerProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Priya Sharma',
    company: currentUser?.company || 'Stripe',
    position: currentUser?.position || 'Staff Software Engineer',
    location: currentUser?.location || 'Bengaluru / Remote',
    experienceYears: currentUser?.experienceYears || 8,
    bio:
      currentUser?.bio ||
      'Passionate about mentoring engineers and bridging top engineering talent into Stripe.',
    linkedinUrl: currentUser?.linkedinUrl || 'https://linkedin.com/in/priyasharma-tech',
    profileVisibility: currentUser?.profileVisibility ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageMeta
        title="Referrer Profile"
        description="Manage your verified employer referrer profile and referral preferences on Referly."
      />
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Referrer Corporate Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Your public referrer profile visible to candidates seeking endorsements at your employer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250'
              }
              alt="Profile"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-violet-100 shadow-xs flex-shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{formData.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Corporate Referrer
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {formData.position} at <strong>{formData.company}</strong>
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                <span>{formData.location}</span>
                <span>•</span>
                <span>{formData.experienceYears} Years Exp</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Employer
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Job Title
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Years of Industry Experience
              </label>
              <input
                type="number"
                value={formData.experienceYears}
                onChange={(e) =>
                  setFormData({ ...formData, experienceYears: Number(e.target.value) })
                }
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Referral Bio / Note to Candidates
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Update Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
