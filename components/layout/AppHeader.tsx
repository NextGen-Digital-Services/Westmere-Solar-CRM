'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Bell, Building2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { UserProfileMenu } from './UserProfileMenu';
import { notificationService } from '@/lib/services/notificationService';
import { ALL_DEPARTMENTS } from '@/lib/mock-data/users.seed';
import { Department } from '@/types/auth';

interface AppHeaderProps {
  onToggleSidebar: () => void;
  onOpenCommand: () => void;
  onOpenNotifications: () => void;
}

export function AppHeader({ onToggleSidebar, onOpenCommand, onOpenNotifications }: AppHeaderProps) {
  const { user, logout, switchDepartment } = useAuth();
  const router = useRouter();

  const unreadCount = user
    ? notificationService.getUnreadCount(user.role === 'super_admin' ? undefined : user.department)
    : 0;

  const handleDeptSelect = (dept: string) => {
    if (dept === 'all') {
      switchDepartment(undefined);
      router.push('/admin');
    } else {
      switchDepartment(dept as Department);
      router.push(`/${dept}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[var(--surface)] border-b border-[var(--border-color)] px-4 flex items-center justify-between gap-3 shadow-xs">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl border border-[var(--border-color)] hover:bg-[var(--surface-raised)] text-[var(--text-main)]"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenCommand}
          className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-xl border border-[var(--border-color)] bg-[var(--surface-raised)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--primary)] transition-all w-36 sm:w-64"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="truncate">Quick search...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border-color)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Dept Switcher (Super Admin) + Notifications + Theme + Profile */}
      <div className="flex items-center gap-2">
        {user?.role === 'super_admin' && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface-raised)] text-xs">
            <Building2 className="w-3.5 h-3.5 text-[var(--gold)]" />
            <select
              value={user.department || 'all'}
              onChange={(e) => handleDeptSelect(e.target.value)}
              className="bg-transparent text-[var(--text-main)] font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">Super Admin (All Departments)</option>
              {ALL_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  View as: {d.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={onOpenNotifications}
          className="relative min-w-[44px] min-h-[44px] p-2.5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--surface-raised)] text-[var(--text-main)] transition-colors flex items-center justify-center"
          aria-label="Open notifications"
        >
          <Bell className="w-4 h-4 text-[var(--text-main)]" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          )}
        </button>

        <ThemeToggle />
        <UserProfileMenu user={user} logout={logout} />
      </div>
    </header>
  );
}
