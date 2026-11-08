import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Link2,
  Plus,
  X,
  CheckCircle2,
  Save,
} from 'lucide-react';

export const SeekerProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Arjun Mehta',
    headline: currentUser?.headline || 'Senior Frontend Engineer | React, TypeScript, Next.js',
    email: currentUser?.email || 'arjun.mehta@example.com',
    location: currentUser?.location || 'Bengaluru, India',
    bio:
      currentUser?.bio ||
      'Product-focused frontend engineer with 5+ years of experience crafting high-performance design systems and SaaS interfaces.',
    education:
      currentUser?.education ||
      'B.Tech in Computer Science & Engineering, National Institute of Technology Karnataka (2019)',
    experienceYears: currentUser?.experienceYears || 5,
    linkedinUrl: currentUser?.linkedinUrl || 'https://linkedin.com/in/arjun-mehta-dev',
    githubUrl: currentUser?.githubUrl || 'https://github.com/arjunmehta',
    profileVisibility: currentUser?.profileVisibility ?? true,
  });

  const [skills, setSkills] = useState<string[]>(
    currentUser?.skills || ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'GraphQL']
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (!skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      skills,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageMeta
        title="Candidate Profile"
        description="Manage your professional candidate profile, skills, and portfolio on Referly."
      />
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">My Professional Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          This information is presented to employees reviewing your referral requests.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
              }
              alt="Profile"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs flex-shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{formData.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Referly Verified
                </span>
              </div>
              <p className="text-xs text-slate-600">{formData.headline}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {formData.location}
                </span>
                <span>•</span>
                <span>{formData.experienceYears} Years Exp</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Professional Headline
              </label>
              <input
                type="text"
                required
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={formData.experienceYears}
                onChange={(e) =>
                  setFormData({ ...formData, experienceYears: Number(e.target.value) })
                }
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Professional Summary / Bio
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Highest Education
              </label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                GitHub / Portfolio URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Skills Tag Manager */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
          <h3 className="text-base font-bold text-slate-900">Core Technical Skills</h3>
          <p className="text-xs text-slate-500">
            Add skills so referrers can easily evaluate match requirements.
          </p>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-indigo-400 hover:text-indigo-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add skill input */}
          <div className="flex items-center gap-2 pt-2 max-w-sm">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="e.g. Docker, Rust, System Design"
              className="flex-1 text-xs rounded-lg border border-slate-200 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
