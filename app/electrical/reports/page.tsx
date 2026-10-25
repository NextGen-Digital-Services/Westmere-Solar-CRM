'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const electricalAuditData = [
  { item: 'Earth Pit <5Ω', passRate: 85 },
  { item: 'DC Isolator', passRate: 98 },
  { item: 'AC/DC SPD', passRate: 92 },
  { item: 'Anti-Islanding', passRate: 95 },
  { item: 'Cable Conduit', passRate: 90 },
];

export default function ElectricalReportPage() {
  return (
    <DashboardLayout requiredDepartment="electrical">
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
            High Voltage Safety Compliance Rates
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
            Electrical Safety Checklist Pass Rates
          </h1>
        </div>

        <Card>
          <CardHeader title="First-Time Pass Rate by Safety Inspection Category (%)" subtitle="CEA and DISCOM mandatory test compliance" />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={electricalAuditData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="item" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} domain={[60, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '0.75rem' }} />
                <Bar dataKey="passRate" name="Pass Rate %" fill="#1F4D3A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
