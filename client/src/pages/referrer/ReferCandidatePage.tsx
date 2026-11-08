import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { getCompanyLogo } from '@/utils/companyLogos';
import { Send, Building2, Briefcase, Plus, X } from 'lucide-react';

export const ReferCandidatePage: React.FC = () => {
  const { currentUser, addJob, addToast } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: currentUser?.company || 'Stripe',
    location: 'Bengaluru, India',
    workMode: 'Hybrid' as 'Remote' | 'Hybrid' | 'On-site',
    jobType: 'Full-time' as 'Full-time' | 'Contract' | 'Part-time' | 'Internship',
    experienceLevel: 'Senior' as 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead / Staff',
    experienceRange: '4 - 7 years',
    salary: '₹35L – ₹50L / yr',
    department: 'Engineering',
    description: '',
    aboutCompany: 'Leading global payments infrastructure platform.',
    requisitionUrl: '',
  });

  const [skills, setSkills] = useState<string[]>(['TypeScript', 'React', 'Node.js']);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      addToast('Please fill in all required job fields.', 'error');
      return;
    }

    addJob({
      title: formData.title,
      company: formData.company,
      companyLogo: getCompanyLogo(formData.company),
      location: formData.location,
      workMode: formData.workMode,
      jobType: formData.jobType,
      experienceLevel: formData.experienceLevel,
      experienceRange: formData.experienceRange,
      salary: formData.salary,
      department: formData.department,
      description: formData.description,
      responsibilities: [
        'Deliver high-reliability software features matching enterprise quality requirements.',
        'Collaborate with product and design to ensure seamless user experiences.',
        'Participate in architectural discussions and code reviews.',
      ],
      skills,
      benefits: [
        'Competitive equity and market compensation',
        'Comprehensive health insurance for dependents',
        'Home office setup reimbursement',
      ],
      aboutCompany: formData.aboutCompany,
      featured: true,
      openPositions: 2,
    });

    navigate('/jobs');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageMeta
        title="Post Referral Opening"
        description="List an active opening at your company with direct employee referral sponsorship."
      />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Post a Referral Opportunity</h1>
        <p className="text-xs text-slate-500 mt-1">
          Create an open referral requisition for an open role at your organization to attract verified talent.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
          <h2 className="text-base font-bold text-slate-900">Position Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Job Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Backend Engineer (Distributed Systems)"
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Core Platform Engineering"
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Mode</label>
              <select
                value={formData.workMode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    workMode: e.target.value as 'Remote' | 'Hybrid' | 'On-site',
                  })
                }
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Seniority Level
              </label>
              <select
                value={formData.experienceLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experienceLevel: e.target.value as any,
                  })
                }
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Entry-level">Entry-level (1-3y)</option>
                <option value="Mid-level">Mid-level (3-5y)</option>
                <option value="Senior">Senior (5-8y)</option>
                <option value="Lead / Staff">Lead / Staff (8y+)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Estimated Salary Range
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="₹30L – ₹45L / yr"
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role Description & Key Focus
              </label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide a comprehensive summary of what the role entails and what ideal candidate profiles look like..."
                className="w-full text-xs rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Skills Tag Management */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
          <h3 className="text-base font-bold text-slate-900">Required Skills & Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-violet-400 hover:text-violet-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 max-w-sm">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g. Go, Kubernetes, Kafka"
              className="flex-1 text-xs rounded-lg border border-slate-200 p-2 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Publish Referral Opportunity</span>
          </button>
        </div>
      </form>
    </div>
  );
};
