'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { User } from '@/types/auth';

interface UserProfileMenuProps {
  user: User | null;
  logout: () => void;
}

export function UserProfileMenu({ user, logout }: UserProfileMenuProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative">
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 min-h-[44px] rounded-xl border border-[var(--border-color)] hover:bg-[var(--surface-raised)] transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xs uppercase">
          {user?.name.slice(0, 2) || 'US'}
        </div>
        <div className="hidden sm:block text-xs">
          <div className="font-semibold text-[var(--text-main)] leading-tight">{user?.name}</div>
          <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            {user?.role === 'super_admin' ? 'Super Admin' : `${user?.department} manager`}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] hidden sm:block" />
      </button>

      {profileOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] shadow-xl py-2 z-50 text-xs animate-in fade-in-0 duration-150"
          onClick={() => setProfileOpen(false)}
        >
          <div className="px-4 py-2 border-b border-[var(--border-color)]">
            <div className="font-bold text-[var(--text-main)]">{user?.name}</div>
            <div className="text-[var(--text-muted)] truncate">{user?.email}</div>
            <div className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-[var(--surface-raised)] border border-[var(--border-color)] text-[var(--gold)]">
              {user?.role.replace('_', ' ')}
            </div>
          </div>
          <button
            onClick={() => router.push('/settings')}
            className="w-full px-4 py-2.5 text-left text-[var(--text-main)] hover:bg-[var(--surface-raised)] flex items-center gap-2"
          >
            <UserIcon className="w-4 h-4 text-[var(--text-muted)]" />
            Settings & Preferences
          </button>
          <button
            onClick={logout}
            className="w-full px-4 py-2.5 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-[#2D1616] flex items-center gap-2 border-t border-[var(--border-color)]"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
