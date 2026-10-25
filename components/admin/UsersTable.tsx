'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Edit2, UserX } from 'lucide-react';
import { User } from '@/types/auth';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export function UsersTable({ users, onEdit, onToggleStatus }: UsersTableProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--surface-raised)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider">
            <tr>
              <th className="p-3.5 font-semibold">User</th>
              <th className="p-3.5 font-semibold">Department</th>
              <th className="p-3.5 font-semibold">Role</th>
              <th className="p-3.5 font-semibold">Status</th>
              <th className="p-3.5 font-semibold">Joined</th>
              <th className="p-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[var(--surface-raised)]/50 transition-colors">
                <td className="p-3.5">
                  <div className="font-semibold text-[var(--text-main)]">{u.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">{u.email}</div>
                </td>
                <td className="p-3.5">
                  <Badge variant="neutral">{u.department ? u.department.toUpperCase() : 'GLOBAL'}</Badge>
                </td>
                <td className="p-3.5 capitalize font-medium text-[var(--text-main)]">
                  {u.role.replace('_', ' ')}
                </td>
                <td className="p-3.5">
                  <Badge variant={u.status === 'active' ? 'success' : 'danger'}>{u.status}</Badge>
                </td>
                <td className="p-3.5 font-mono text-[var(--text-muted)]">{u.joinedDate}</td>
                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={() => onEdit(u)}
                    className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--surface-raised)] text-[var(--text-main)]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {u.role !== 'super_admin' && (
                    <button
                      onClick={() => onToggleStatus(u)}
                      className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-rose-50 text-rose-600"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
