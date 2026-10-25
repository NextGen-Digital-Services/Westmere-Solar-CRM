'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const subsidyDisbursedData = [
  { month: 'Jun', claimed: 4.8, disbursed: 3.2 },
  { month: 'Jul', claimed: 6.4, disbursed: 4.8 },
  { month: 'Aug', claimed: 8.2, disbursed: 6.0 },
  { month: 'Sep', claimed: 10.5, disbursed: 7.8 },
  { month: 'Oct', claimed: 12.8, disbursed: 9.6 },
];

export default function SubsidyReportPage() {
  return (
    <DashboardLayout requiredDepartment="subsidy">
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
            National Portal Throughput
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
            PM Surya Ghar Subsidy Disbursement Reports
          </h1>
        </div>

        <Card>
          <CardHeader title="Cumulative Subsidy Claimed vs Direct Bank Transfer (₹ Lakhs)" subtitle="Direct benefit transfer (DBT) turnaround velocity" />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subsidyDisbursedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '0.75rem' }} />
                <Bar dataKey="claimed" name="Claims Submitted" fill="#B8945A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="disbursed" name="Disbursed to Beneficiary" fill="#1F4D3A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
