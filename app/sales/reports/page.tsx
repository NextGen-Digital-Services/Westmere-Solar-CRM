'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const monthlyLeadsData = [
  { month: 'Jun', leads: 24, converted: 8 },
  { month: 'Jul', leads: 32, converted: 12 },
  { month: 'Aug', leads: 40, converted: 16 },
  { month: 'Sep', leads: 45, converted: 20 },
  { month: 'Oct', leads: 52, converted: 24 },
];

const sourceData = [
  { name: 'Website', value: 40, color: '#1F4D3A' },
  { name: 'Referral', value: 25, color: '#B8945A' },
  { name: 'Social Media', value: 15, color: '#B5552F' },
  { name: 'Walk-in', value: 10, color: '#6FAE8D' },
  { name: 'Partners', value: 10, color: '#A99F93' },
];

export default function SalesReportPage() {
  return (
    <DashboardLayout requiredDepartment="sales">
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">Analytics & Performance</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">Sales Department Reports</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Lead Intake vs Converted Projects" subtitle="Monthly conversion throughput" />
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyLeadsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '0.75rem' }} />
                  <Bar dataKey="leads" name="Total Inquiries" fill="#B8945A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="converted" name="Converted" fill="#1F4D3A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Lead Generation Channel Distribution" subtitle="Customer acquisition channel breakdown" />
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '0.75rem' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
