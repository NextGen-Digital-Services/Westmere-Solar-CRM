'use client';

import React from 'react';
import { NavItem } from './SidebarNavGroup';
import { Department } from '@/types/auth';
import {
  LayoutDashboard,
  TrendingUp,
  FileSpreadsheet,
  FolderOpen,
  DollarSign,
  Package,
  Wrench,
  Zap,
  Award,
} from 'lucide-react';

export function DepartmentNavList({ dept, pathname }: { dept?: Department; pathname: string }) {
  if (dept === 'sales') {
    return (
      <div className="space-y-1">
        <NavItem href="/sales" label="Sales Dashboard" icon={LayoutDashboard} active={pathname === '/sales'} />
        <NavItem href="/sales/leads" label="Leads Pipeline" icon={TrendingUp} active={pathname === '/sales/leads'} />
        <NavItem href="/sales/quotations" label="Quotations" icon={FileSpreadsheet} active={pathname === '/sales/quotations'} />
        <NavItem href="/sales/reports" label="Department Report" icon={FolderOpen} active={pathname === '/sales/reports'} />
      </div>
    );
  }
  if (dept === 'registration') {
    return (
      <div className="space-y-1">
        <NavItem href="/registration" label="Registration Dashboard" icon={LayoutDashboard} active={pathname === '/registration'} />
        <NavItem href="/registration/projects" label="Project Dossiers" icon={FolderOpen} active={pathname === '/registration/projects'} />
        <NavItem href="/registration/reports" label="Department Report" icon={FileSpreadsheet} active={pathname === '/registration/reports'} />
      </div>
    );
  }
  if (dept === 'finance') {
    return (
      <div className="space-y-1">
        <NavItem href="/finance" label="Finance Dashboard" icon={LayoutDashboard} active={pathname === '/finance'} />
        <NavItem href="/finance/payments" label="Payment Records" icon={DollarSign} active={pathname === '/finance/payments'} />
        <NavItem href="/finance/reports" label="Department Report" icon={FileSpreadsheet} active={pathname === '/finance/reports'} />
      </div>
    );
  }
  if (dept === 'inventory') {
    return (
      <div className="space-y-1">
        <NavItem href="/inventory" label="Inventory Dashboard" icon={LayoutDashboard} active={pathname === '/inventory'} />
        <NavItem href="/inventory/stock" label="Stock Items" icon={Package} active={pathname === '/inventory/stock'} />
        <NavItem href="/inventory/reports" label="Department Report" icon={FileSpreadsheet} active={pathname === '/inventory/reports'} />
      </div>
    );
  }
  if (dept === 'installation') {
    return (
      <div className="space-y-1">
        <NavItem href="/installation" label="Installation Dashboard" icon={LayoutDashboard} active={pathname === '/installation'} />
        <NavItem href="/installation/schedule" label="Job Schedule" icon={Wrench} active={pathname === '/installation/schedule'} />
        <NavItem href="/installation/reports" label="Department Report" icon={FileSpreadsheet} active={pathname === '/installation/reports'} />
      </div>
    );
  }
  if (dept === 'electrical') {
    return (
      <div className="space-y-1">
        <NavItem href="/electrical" label="Electrical Dashboard" icon={LayoutDashboard} active={pathname === '/electrical'} />
        <NavItem href="/electrical/inspections" label="Safety Inspections" icon={Zap} active={pathname === '/electrical/inspections'} />
        <NavItem href="/electrical/reports" label="Department Report" icon={FileSpreadsheet} active={pathname === '/electrical/reports'} />
      </div>
    );
  }
  if (dept === 'subsidy') {
    return (
      <div className="space-y-1">
        <NavItem href="/subsidy" label="Subsidy Dashboard" icon={LayoutDashboard} active={pathname === '/subsidy'} />
        <NavItem href="/subsidy/claims" label="Surya Ghar Claims" icon={Award} active={pathname === '/subsidy/claims'} />
        <NavItem href="/subsidy/reports" label="Department Report" icon={FileSpreadsheet} active={pathname === '/subsidy/reports'} />
      </div>
    );
  }
  return null;
}
