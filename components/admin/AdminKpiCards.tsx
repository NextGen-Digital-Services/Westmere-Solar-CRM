'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { TrendingUp, Users, DollarSign, Package, Wrench, Award } from 'lucide-react';

interface AdminKpiCardsProps {
  leadsCount: number;
  projectsCount: number;
  totalCollected: number;
  totalOutstanding: number;
  stockTotal: number;
  lowStockCount: number;
  installationsCount: number;
  delayedInstallations: number;
  subsidiesCount: number;
}

export function AdminKpiCards({
  leadsCount,
  projectsCount,
  totalCollected,
  totalOutstanding,
  stockTotal,
  lowStockCount,
  installationsCount,
  delayedInstallations,
  subsidiesCount,
}: AdminKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      <KpiCard label="Total Inquiries" value={leadsCount} sub="40 active leads" icon={TrendingUp} />
      <KpiCard label="Registrations" value={projectsCount} sub="25 sanctioned" icon={Users} />
      <KpiCard label="Collections" value={`₹${(totalCollected / 100000).toFixed(1)}L`} sub={`₹${(totalOutstanding / 100000).toFixed(1)}L due`} icon={DollarSign} />
      <KpiCard label="Stock Health" value={`${stockTotal - lowStockCount}/${stockTotal}`} sub={`${lowStockCount} items low`} icon={Package} />
      <KpiCard label="Installations" value={installationsCount} sub={`${delayedInstallations} weather delay`} icon={Wrench} />
      <KpiCard label="Subsidy Claims" value={subsidiesCount} sub="PM Surya Ghar" icon={Award} />
    </div>
  );
}

function KpiCard({ label, value, sub, icon: Icon }: { label: string; value: string | number; sub: string; icon: any }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">{label}</span>
        <Icon className="w-4 h-4 text-[var(--gold)]" />
      </div>
      <div className="text-xl sm:text-2xl font-bold font-serif text-[var(--text-main)]">{value}</div>
      <div className="text-[11px] text-[var(--text-muted)] mt-1 truncate">{sub}</div>
    </Card>
  );
}
