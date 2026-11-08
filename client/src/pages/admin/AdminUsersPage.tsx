import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { mockAdminUsers } from '@/data/mockData';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import { Search, UserCheck, Shield, Users, Edit2, Ban, CheckCircle2 } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { addToast } = useApp();
  const [users, setUsers] = useState(mockAdminUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesTerm =
      !term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);

    const matchesRole = selectedRole === 'all' || u.role.toLowerCase() === selectedRole.toLowerCase();

    return matchesTerm && matchesRole;
  });

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          addToast(`User ${u.name} status updated to ${newStatus}.`, 'info');
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageMeta
        title="Admin User Management"
        description="Review, verify, and govern candidates and referrer accounts across the platform."
      />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">User Management Directory</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review, authenticate, and manage candidate and corporate employee referrer accounts.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="seeker">Job Seekers</option>
            <option value="referrer">Referrers</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredUsers.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
              <tr>
                <th className="py-3.5 px-5">User</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5">Plan</th>
                <th className="py-3.5 px-5">Joined</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div>
                      <span className="font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-[11px] text-slate-400">{u.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 capitalize">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-800">{u.plan}</td>
                  <td className="py-3.5 px-5 text-slate-500">{u.dateJoined}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        title="Edit user"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          u.status === 'Active'
                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={u.status === 'Active' ? 'Suspend user' : 'Reactivate user'}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try adjusting your role filter or search query."
        />
      )}

      {/* Edit User Modal */}
      {selectedUser && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit User: ${selectedUser.name}`}
          description={`ID: ${selectedUser.id}`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue={selectedUser.name}
                className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Status
              </label>
              <select
                defaultValue={selectedUser.status}
                className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-800 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  addToast(`User profile for ${selectedUser.name} saved!`, 'success');
                }}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
