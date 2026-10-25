'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const discomApprovalData = [
  { discom: 'MSEDCL', submitted: 18, approved: 14, rejected: 2 },
  { discom: 'Tata Power', submitted: 8, approved: 7, rejected: 1 },
  { discom: 'Adani Elec', submitted: 6, approved: 5, rejected: 0 },
  { discom: 'Torrent', submitted: 5, approved: 4, rejected: 1 },
  { discom: 'BESCOM', submitted: 4, approved: 3, rejected: 0 },
];

export default function RegistrationReportPage() {
  return (
    <DashboardLayout requiredDepartment="registration">
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
            Sanction Metrics & DISCOM Timelines
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
            Registration & Net Metering Reports
          </h1>
        </div>

        <Card>
          <CardHeader
            title="DISCOM-Wise Application Status"
            subtitle="Approvals vs corrections across regional electricity distribution companies"
          />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={discomApprovalData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="discom" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '0.75rem' }} />
                <Bar dataKey="submitted" name="Submitted Dossiers" fill="#B8945A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Sanctioned" fill="#1F4D3A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" name="Corrections Required" fill="#B5552F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
