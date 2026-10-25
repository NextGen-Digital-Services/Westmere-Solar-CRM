'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { PermissionAction, Department, User } from '@/types/auth';

interface ModuleConfig {
  key: Department | 'users' | 'reports';
  label: string;
}

interface RbacMatrixTableProps {
  modules: ModuleConfig[];
  actions: PermissionAction[];
  selectedUser: User;
  hasAction: (module: string, action: PermissionAction) => boolean;
  toggleAction: (module: any, action: PermissionAction) => void;
}

export function RbacMatrixTable({
  modules,
  actions,
  selectedUser,
  hasAction,
  toggleAction,
}: RbacMatrixTableProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--surface-raised)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">CRM System Module</th>
              {actions.map((act) => (
                <th key={act} className="p-4 font-semibold text-center uppercase">
                  {act}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {modules.map((m) => (
              <tr key={m.key} className="hover:bg-[var(--surface-raised)]/40 transition-colors">
                <td className="p-4 font-semibold text-[var(--text-main)]">{m.label}</td>
                {actions.map((action) => {
                  const enabled = hasAction(m.key, action);
                  return (
                    <td key={action} className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleAction(m.key, action)}
                        disabled={selectedUser.role === 'super_admin'}
                        className={`w-8 h-8 rounded-lg border transition-all inline-flex items-center justify-center ${
                          enabled
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-[var(--surface-raised)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--primary)]'
                        } disabled:opacity-70 disabled:cursor-not-allowed`}
                        title={`${action.toUpperCase()} permission for ${m.label}`}
                      >
                        {enabled ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5 opacity-40" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
