'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Filter } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { DepartmentPerformanceChart } from '@/components/charts/DepartmentPerformanceChart';
import { PipelineFunnelChart } from '@/components/charts/PipelineFunnelChart';
import { AdminKpiCards } from '@/components/admin/AdminKpiCards';
import { salesService } from '@/lib/services/salesService';
import { registrationService } from '@/lib/services/registrationService';
import { financeService } from '@/lib/services/financeService';
import { inventoryService } from '@/lib/services/inventoryService';
import { installationService } from '@/lib/services/installationService';
import { subsidyService } from '@/lib/services/subsidyService';
import { auditService } from '@/lib/services/auditService';

export default function SuperAdminDashboard() {
  const [dateRange, setDateRange] = useState('This Quarter');

  const leads = useMemo(() => salesService.getLeads(), []);
  const projects = useMemo(() => registrationService.getProjects(), []);
  const payments = useMemo(() => financeService.getPayments(), []);
  const stock = useMemo(() => inventoryService.getStockItems(), []);
  const installations = useMemo(() => installationService.getTasks(), []);
  const subsidies = useMemo(() => subsidyService.getSubsidies(), []);
  const recentLogs = useMemo(() => auditService.getAll().slice(0, 5), []);

  const totalCollected = useMemo(() => payments.reduce((acc, p) => acc + p.totalReceived, 0), [payments]);
  const totalOutstanding = useMemo(() => payments.reduce((acc, p) => acc + p.outstandingBalance, 0), [payments]);
  const lowStockCount = useMemo(() => stock.filter((s) => s.isLowStock).length, [stock]);
  const delayedInstallations = useMemo(() => installations.filter((i) => i.isDelayed).length, [installations]);

  return (
    <DashboardLayout superAdminOnly>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">Executive Central Overview</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">Company-Wide Solar Operations</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-xs">
              <Filter className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-transparent text-[var(--text-main)] font-medium focus:outline-none cursor-pointer">
                <option value="This Month">This Month</option>
                <option value="This Quarter">This Quarter (Q3 2026)</option>
                <option value="Fiscal 2026">Fiscal Year 2026-27</option>
              </select>
            </div>
            <Link href="/sales">
              <Button size="sm" variant="primary">
                New Sales Lead
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        <AdminKpiCards
          leadsCount={leads.length}
          projectsCount={projects.length}
          totalCollected={totalCollected}
          totalOutstanding={totalOutstanding}
          stockTotal={stock.length}
          lowStockCount={lowStockCount}
          installationsCount={installations.length}
          delayedInstallations={delayedInstallations}
          subsidiesCount={subsidies.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Revenue & Cash Collections Trend" subtitle="Contracted pipeline value vs received bank transfers" />
            <RevenueChart />
          </Card>
          <Card>
            <CardHeader title="Departmental Milestone Fulfillment" subtitle="Target vs actual throughput across divisions" />
            <DepartmentPerformanceChart />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader title="Company-Wide Conversion Funnel" subtitle="Lead to subsidy disbursement stages" />
            <PipelineFunnelChart />
          </Card>

          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <CardHeader title="Live System Audit Log" subtitle="Real-time actions across all 7 departments" />
              <Link href="/admin/audit" className="text-xs text-[var(--primary)] hover:underline font-medium">
                View All Trail →
              </Link>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {recentLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-[var(--text-main)]">{log.userName}</span>{' '}
                    <span className="text-[var(--text-muted)]">({log.department})</span>
                    <p className="text-[var(--text-muted)] mt-0.5">{log.summary}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border-color)]">
                      {log.action}
                    </span>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
