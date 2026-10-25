'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { NotificationDrawer } from './NotificationDrawer';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { AccessDenied } from '@/components/ui/AccessDenied';
import { Department } from '@/types/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredDepartment?: Department;
  superAdminOnly?: boolean;
}

export function DashboardLayout({
  children,
  requiredDepartment,
  superAdminOnly = false,
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm font-medium text-[var(--text-muted)]">
            Loading Solar CRM Environment...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Check department isolation:
  if (superAdminOnly && user.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-[var(--background)] p-6">
        <AccessDenied departmentName="Executive Super Admin" />
      </div>
    );
  }

  if (requiredDepartment && user.role !== 'super_admin' && user.department !== requiredDepartment) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        <AppHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          onOpenCommand={() => setCommandOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
        />
        <div className="flex-1 p-6">
          <AccessDenied departmentName={requiredDepartment.toUpperCase()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col flex-1 pb-16 lg:pb-0">
        <AppHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          onOpenCommand={() => setCommandOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in-0 duration-200">
          {children}
        </main>

        <MobileBottomNav
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenMenu={() => setSidebarOpen(true)}
        />
      </div>

      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
      <NotificationDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  );
}
