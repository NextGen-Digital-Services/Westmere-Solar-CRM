'use client';

import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from 'next-themes';
import { PasswordChangeForm } from '@/components/settings/PasswordChangeForm';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [overdueAlerts, setOverdueAlerts] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
            Preferences & Security
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
            Account Profile & System Settings
          </h1>
        </div>

        {/* Profile Details */}
        <Card>
          <CardHeader title="Operator Identity" subtitle="System credentials and departmental assignment" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[var(--text-muted)]">Full Name:</span>
              <p className="font-semibold text-sm text-[var(--text-main)] mt-0.5">{user?.name}</p>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Email Address:</span>
              <p className="font-semibold text-sm text-[var(--text-main)] mt-0.5 font-mono">{user?.email}</p>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Assigned Department:</span>
              <p className="font-semibold text-sm text-[var(--text-main)] mt-0.5 uppercase">
                {user?.department || 'Executive Super Admin'}
              </p>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Designated Role:</span>
              <p className="font-semibold text-sm text-[var(--text-main)] mt-0.5 capitalize">
                {user?.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </Card>

        {/* Visual Appearance & Notification Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Editorial Palette" subtitle="Switch between Italian Warm Ivory & Dark Obsidian" />
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex-1 p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                  theme === 'light'
                    ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] font-bold'
                    : 'border-[var(--border-color)] bg-[var(--surface-raised)]'
                }`}
              >
                <Sun className="w-4 h-4 mx-auto mb-1.5 text-amber-500" />
                Warm Ivory (Light)
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex-1 p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                  theme === 'dark'
                    ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] font-bold'
                    : 'border-[var(--border-color)] bg-[var(--surface-raised)]'
                }`}
              >
                <Moon className="w-4 h-4 mx-auto mb-1.5 text-slate-300" />
                Dark Obsidian
              </button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Alert Subscriptions" subtitle="Departmental notifications routing" />
            <div className="space-y-3 mt-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Immediate Critical Task Alerts</span>
                <input
                  type="checkbox"
                  checked={overdueAlerts}
                  onChange={(e) => setOverdueAlerts(e.target.checked)}
                  className="rounded text-[var(--primary)]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Email Summary of Daily Actions</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-[var(--primary)]"
                />
              </label>
            </div>
          </Card>
        </div>

        <PasswordChangeForm />
      </div>
    </DashboardLayout>
  );
}
