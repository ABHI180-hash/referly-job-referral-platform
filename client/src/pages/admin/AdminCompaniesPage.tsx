import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Company } from '@/types';
import { PageMeta } from '@/components/common/PageMeta';
import { Modal } from '@/components/common/Modal';
import { Building2, Plus, Trash2, Edit2, Search } from 'lucide-react';

export const AdminCompaniesPage: React.FC = () => {
  const { companies, addToast } = useApp();
  const [companyList, setCompanyList] = useState<Company[]>(companies);
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: 'Financial Technology',
    location: 'Bengaluru, India',
    employeeCount: '1,000+ employees',
    openPositions: 5,
    description: '',
    website: 'https://example.com',
  });

  const filtered = companyList.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setCompanyList((prev) => prev.filter((c) => c.id !== id));
    addToast('Company profile removed.', 'info');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name) return;
    const added: Company = {
      ...newCompany,
      id: 'comp_' + Date.now(),
      logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=120',
      featured: true,
    };
    setCompanyList([added, ...companyList]);
    setAddModalOpen(false);
    addToast(`Added ${newCompany.name} to company directory!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageMeta
        title="Admin Companies"
        description="Manage verified partner employers and directory company profiles on Referly."
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Partner Companies Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure partner organizations and manage employee referral verification gates.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Employer</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-card flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company name..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
          />
        </div>
        <span className="text-xs text-slate-500">
          Total: <strong className="text-slate-900">{companyList.length}</strong>
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
            <tr>
              <th className="py-3.5 px-5">Company</th>
              <th className="py-3.5 px-5">Industry</th>
              <th className="py-3.5 px-5">Headquarters</th>
              <th className="py-3.5 px-5">Employees</th>
              <th className="py-3.5 px-5">Open Roles</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.logo}
                      alt={c.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-100 p-0.5 bg-slate-50"
                    />
                    <span className="font-bold text-slate-900">{c.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 font-medium text-slate-600">{c.industry}</td>
                <td className="py-3.5 px-5 text-slate-500">{c.location}</td>
                <td className="py-3.5 px-5 text-slate-600">{c.employeeCount}</td>
                <td className="py-3.5 px-5 font-bold text-indigo-600">{c.openPositions}</td>
                <td className="py-3.5 px-5 text-right">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register New Partner Employer"
        description="Add company profile to enable verified employee matching."
      >
        <form onSubmit={handleAdd} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
            <input
              type="text"
              required
              value={newCompany.name}
              onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
            <input
              type="text"
              value={newCompany.industry}
              onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={newCompany.description}
              onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-800 resize-none"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Save Company
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
