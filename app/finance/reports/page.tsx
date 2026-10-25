'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const cashFlowData = [
  { month: 'May', invoiced: 2200000, collected: 1800000 },
  { month: 'Jun', invoiced: 2800000, collected: 2300000 },
  { month: 'Jul', invoiced: 3400000, collected: 3000000 },
  { month: 'Aug', invoiced: 4100000, collected: 3600000 },
  { month: 'Sep', invoiced: 4900000, collected: 4200000 },
  { month: 'Oct', invoiced: 5800000, collected: 5100000 },
];

export default function FinanceReportPage() {
  return (
    <DashboardLayout requiredDepartment="finance">
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
            Treasury Liquidity & Aging
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
            Financial Health & Collection Reports
          </h1>
        </div>

        <Card>
          <CardHeader title="Cumulative Billed vs Collected Cash Flow" subtitle="Monthly cash collection efficiency (May – Oct 2026)" />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={(v) => `₹${v / 100000}L`} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '0.75rem' }} />
                <Area type="monotone" dataKey="invoiced" name="Invoiced" stroke="#B8945A" fill="#B8945A" fillOpacity={0.2} />
                <Area type="monotone" dataKey="collected" name="Collected Cash" stroke="#1F4D3A" fill="#1F4D3A" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
