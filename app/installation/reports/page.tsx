'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const delayReasonData = [
  { reason: 'Heavy Rain / Monsoon', count: 7 },
  { reason: 'Customer Postponed', count: 4 },
  { reason: 'Grid Shutdown Wait', count: 3 },
  { reason: 'Civil Roof Work', count: 2 },
  { reason: 'Material Logistics', count: 1 },
];

export default function InstallationReportPage() {
  return (
    <DashboardLayout requiredDepartment="installation">
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
            Execution Velocity & Bottleneck Analysis
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
            Installation Department Reports
          </h1>
        </div>

        <Card>
          <CardHeader title="Root Cause Breakdown of Installation Delays" subtitle="Incident frequency analysis across field deployment teams" />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayReasonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis dataKey="reason" type="category" width={160} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '0.75rem' }} />
                <Bar dataKey="count" name="Delayed Sites" fill="#B5552F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
