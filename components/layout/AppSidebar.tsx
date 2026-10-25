'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sun,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Settings,
  RefreshCw,
  FolderOpen,
  DollarSign,
  Package,
  Wrench,
  Zap,
  Award,
  History,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { dbResetService } from '@/lib/services/dbResetService';
import { NavItem } from './SidebarNavGroup';
import { DepartmentNavList } from './DepartmentNavList';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';
  const dept = user?.department;

  const handleResetData = () => {
    if (confirm('Reset all mock data in localStorage to default seeds?')) {
      dbResetService.resetAllData();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[var(--surface)] border-r border-[var(--border-color)] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-6 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold">
              <Sun className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-[var(--text-main)]">ELIOS</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] block -mt-1">SOLAR CRM</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {isSuperAdmin && (
            <div>
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Executive Control
              </div>
              <div className="space-y-1">
                <NavItem href="/admin" label="Super Dashboard" icon={LayoutDashboard} active={pathname === '/admin'} />
                <NavItem href="/admin/users" label="Users & Managers" icon={Users} active={pathname === '/admin/users'} />
                <NavItem href="/admin/rbac" label="Roles & Permissions" icon={ShieldCheck} active={pathname === '/admin/rbac'} />
                <NavItem href="/admin/audit" label="Activity Audit Trail" icon={History} active={pathname === '/admin/audit'} />
              </div>

              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mt-5 mb-2">
                Operational Divisions
              </div>
              <div className="space-y-1">
                <NavItem href="/sales" label="Sales & Leads" icon={TrendingUp} active={pathname.startsWith('/sales')} />
                <NavItem href="/registration" label="Registration & KYC" icon={FolderOpen} active={pathname.startsWith('/registration')} />
                <NavItem href="/finance" label="Banking & Finance" icon={DollarSign} active={pathname.startsWith('/finance')} />
                <NavItem href="/inventory" label="Inventory & Stock" icon={Package} active={pathname.startsWith('/inventory')} />
                <NavItem href="/installation" label="Site Installation" icon={Wrench} active={pathname.startsWith('/installation')} />
                <NavItem href="/electrical" label="Electrical Safety" icon={Zap} active={pathname.startsWith('/electrical')} />
                <NavItem href="/subsidy" label="PM Surya Ghar Subsidy" icon={Award} active={pathname.startsWith('/subsidy')} />
              </div>
            </div>
          )}

          {!isSuperAdmin && (
            <div>
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                {dept?.toUpperCase()} DIVISION
              </div>
              <DepartmentNavList dept={dept} pathname={pathname} />
            </div>
          )}

          <div className="pt-4 border-t border-[var(--border-color)] space-y-1">
            <NavItem href="/settings" label="Account Settings" icon={Settings} active={pathname === '/settings'} />
            {isSuperAdmin && (
              <button
                onClick={handleResetData}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-[#2D1616] transition-colors"
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                Reset Demo Data
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
