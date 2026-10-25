'use client';

import React, { useState } from 'react';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { Department } from '@/types/auth';

interface DemoCred {
  label: string;
  email: string;
  role: string;
  department?: Department | 'super';
}

const DEMO_ACCOUNTS: DemoCred[] = [
  { label: 'Super Admin', email: 'superadmin@solarcrm.demo', role: 'Full Access', department: 'super' },
  { label: 'Sales Manager', email: 'sales.manager@solarcrm.demo', role: 'Manager', department: 'sales' },
  { label: 'Sales Rep 1', email: 'sales.emp1@solarcrm.demo', role: 'Employee', department: 'sales' },
  { label: 'Registration Mgr', email: 'reg.manager@solarcrm.demo', role: 'Manager', department: 'registration' },
  { label: 'Registration Rep', email: 'reg.emp1@solarcrm.demo', role: 'Employee', department: 'registration' },
  { label: 'Finance Manager', email: 'finance.manager@solarcrm.demo', role: 'Manager', department: 'finance' },
  { label: 'Finance Officer', email: 'finance.emp1@solarcrm.demo', role: 'Employee', department: 'finance' },
  { label: 'Inventory Manager', email: 'inventory.manager@solarcrm.demo', role: 'Manager', department: 'inventory' },
  { label: 'Inventory Officer', email: 'inventory.emp1@solarcrm.demo', role: 'Employee', department: 'inventory' },
  { label: 'Installation Mgr', email: 'install.manager@solarcrm.demo', role: 'Manager', department: 'installation' },
  { label: 'Lead Technician', email: 'install.emp1@solarcrm.demo', role: 'Employee', department: 'installation' },
  { label: 'Electrical Mgr', email: 'electrical.manager@solarcrm.demo', role: 'Manager', department: 'electrical' },
  { label: 'Electrical Inspector', email: 'electrical.emp1@solarcrm.demo', role: 'Employee', department: 'electrical' },
  { label: 'Subsidy Manager', email: 'subsidy.manager@solarcrm.demo', role: 'Manager', department: 'subsidy' },
  { label: 'Subsidy Officer', email: 'subsidy.emp1@solarcrm.demo', role: 'Employee', department: 'subsidy' },
];

export function DemoCredentialsPanel({
  onSelect,
}: {
  onSelect: (email: string, pass: string) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'managers' | 'employees'>('all');

  const filtered = DEMO_ACCOUNTS.filter((acc) => {
    if (filter === 'managers') return acc.role === 'Manager' || acc.department === 'super';
    if (filter === 'employees') return acc.role === 'Employee';
    return true;
  });

  return (
    <div className="bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--gold)]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
            One-Click Demo Credentials
          </h4>
        </div>
        <div className="flex gap-1 text-[10px]">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded-md ${filter === 'all' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]'}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('managers')}
            className={`px-2 py-0.5 rounded-md ${filter === 'managers' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]'}`}
          >
            Managers
          </button>
          <button
            type="button"
            onClick={() => setFilter('employees')}
            className={`px-2 py-0.5 rounded-md ${filter === 'employees' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]'}`}
          >
            Employees
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
        {filtered.map((acc) => (
          <button
            key={acc.email}
            type="button"
            onClick={() => onSelect(acc.email, 'Demo@123')}
            className="flex flex-col text-left p-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/20 transition-all text-[11px]"
          >
            <span className="font-semibold text-[var(--text-main)] truncate">{acc.label}</span>
            <span className="text-[10px] text-[var(--text-muted)] truncate">{acc.role}</span>
          </button>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-[var(--text-muted)] text-center">
        Universal Demo Password: <span className="font-mono font-semibold text-[var(--text-main)]">Demo@123</span>
      </div>
    </div>
  );
}
