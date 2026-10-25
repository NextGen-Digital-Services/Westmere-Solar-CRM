'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Bell, User, Layers } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

export function MobileBottomNav({
  onOpenNotifications,
  onOpenMenu,
}: {
  onOpenNotifications: () => void;
  onOpenMenu: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const baseDept = user?.role === 'super_admin' ? '/admin' : `/${user?.department || 'sales'}`;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-[var(--surface)] border-t border-[var(--border-color)] px-4 flex items-center justify-around shadow-lg">
      <Link
        href={baseDept}
        className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] ${
          pathname === baseDept ? 'text-[var(--primary)] font-bold' : 'text-[var(--text-muted)]'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px] mt-1">Dashboard</span>
      </Link>

      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] text-[var(--text-muted)] hover:text-[var(--text-main)]"
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] mt-1">Modules</span>
      </button>

      <button
        onClick={onOpenNotifications}
        className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] text-[var(--text-muted)] hover:text-[var(--text-main)]"
      >
        <Bell className="w-5 h-5" />
        <span className="text-[10px] mt-1">Alerts</span>
      </button>

      <Link
        href="/settings"
        className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] ${
          pathname === '/settings' ? 'text-[var(--primary)] font-bold' : 'text-[var(--text-muted)]'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-1">Profile</span>
      </Link>
    </div>
  );
}
