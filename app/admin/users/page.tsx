'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserModal } from '@/components/admin/UserModal';
import { UsersTable } from '@/components/admin/UsersTable';
import { authService } from '@/lib/services/authService';
import { useToast } from '@/components/providers/ToastProvider';
import { User } from '@/types/auth';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>(() => authService.getUsers());
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { success } = useToast();
  const managers = useMemo(() => users.filter((u) => u.role === 'department_manager'), [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.includes(search);
      const matchDept = selectedDept === 'ALL' || u.department === selectedDept;
      return matchSearch && matchDept;
    });
  }, [users, search, selectedDept]);

  const handleSave = (userData: Partial<User>) => {
    const saved = authService.saveUser(userData as any);
    setUsers(authService.getUsers());
    success(`Staff member ${saved.name} saved successfully.`);
  };

  const handleToggleStatus = (u: User) => {
    const nextStatus = u.status === 'active' ? 'inactive' : 'active';
    authService.saveUser({ ...u, status: nextStatus });
    setUsers(authService.getUsers());
    success(`Account for ${u.name} set to ${nextStatus}.`);
  };

  return (
    <DashboardLayout superAdminOnly>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
              Access Administration
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
              Personnel & User Credentials ({filteredUsers.length})
            </h1>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Provision Staff Account
          </Button>
        </div>

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search staff by name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none"
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {['sales', 'registration', 'finance', 'inventory', 'installation', 'electrical', 'subsidy'].map((d) => (
                <option key={d} value={d}>{d.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </Card>

        <UsersTable
          users={filteredUsers}
          onEdit={(u) => { setEditingUser(u); setIsModalOpen(true); }}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        user={editingUser}
        managers={managers}
      />
    </DashboardLayout>
  );
}
