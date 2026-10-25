'use client';

import React, { useState } from 'react';
import { Shield, Save } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RbacMatrixTable } from '@/components/admin/RbacMatrixTable';
import { authService } from '@/lib/services/authService';
import { useToast } from '@/components/providers/ToastProvider';
import { PermissionAction, Department, UserPermission } from '@/types/auth';

const MODULES: Array<{ key: Department | 'users' | 'reports'; label: string }> = [
  { key: 'sales', label: 'Sales & Inquiries' },
  { key: 'registration', label: 'Registration & KYC' },
  { key: 'finance', label: 'Banking & Finance' },
  { key: 'inventory', label: 'Inventory & Materials' },
  { key: 'installation', label: 'Site Installation' },
  { key: 'electrical', label: 'Electrical Safety' },
  { key: 'subsidy', label: 'Subsidy Claims' },
  { key: 'users', label: 'User Directory' },
  { key: 'reports', label: 'Executive Reports' },
];

const ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete', 'approve'];

export default function RbacMatrixPage() {
  const users = authService.getUsers();
  const [selectedUserId, setSelectedUserId] = useState(users[1]?.id || users[0]?.id);
  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  const [permissions, setPermissions] = useState<UserPermission[]>(() => {
    return selectedUser?.permissions || [];
  });

  const { success } = useToast();

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    const u = users.find((x) => x.id === userId);
    setPermissions(u?.permissions || []);
  };

  const hasAction = (module: string, action: PermissionAction): boolean => {
    if (selectedUser.role === 'super_admin') return true;
    const mod = permissions.find((p) => p.module === module);
    return mod ? mod.actions.includes(action) : false;
  };

  const toggleAction = (module: any, action: PermissionAction) => {
    if (selectedUser.role === 'super_admin') return;

    setPermissions((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((p) => p.module === module);
      if (idx === -1) {
        copy.push({ module, actions: [action] });
      } else {
        const currentActions = copy[idx].actions;
        if (currentActions.includes(action)) {
          copy[idx].actions = currentActions.filter((a) => a !== action);
        } else {
          copy[idx].actions = [...currentActions, action];
        }
      }
      return copy;
    });
  };

  const handleSave = () => {
    authService.updateUserPermissions(selectedUserId, permissions);
    success(`Updated access matrix permissions for ${selectedUser.name}.`);
  };

  return (
    <DashboardLayout superAdminOnly>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
              RBAC Governance Matrix
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
              Granular Role & Module Permissions
            </h1>
          </div>
          <Button size="sm" variant="primary" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1.5" />
            Apply Permission Matrix
          </Button>
        </div>

        <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Configuring Access For:</div>
              <div className="font-bold text-sm text-[var(--text-main)]">
                {selectedUser.name} ({selectedUser.role.replace('_', ' ')})
              </div>
            </div>
          </div>
          <select
            value={selectedUserId}
            onChange={(e) => handleUserChange(e.target.value)}
            className="px-3.5 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] cursor-pointer"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.department ? `${u.department.toUpperCase()} (${u.role})` : 'SUPER ADMIN'}
              </option>
            ))}
          </select>
        </Card>

        <RbacMatrixTable
          modules={MODULES}
          actions={ACTIONS}
          selectedUser={selectedUser}
          hasAction={hasAction}
          toggleAction={toggleAction}
        />
      </div>
    </DashboardLayout>
  );
}
