'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const valuationByCategory = [
  { category: 'Solar Panels', value: 45.2 },
  { category: 'Inverters', value: 28.5 },
  { category: 'Structures', value: 14.8 },
  { category: 'DC Cables', value: 8.6 },
  { category: 'Protection', value: 6.4 },
  { category: 'Accessories', value: 4.1 },
];

export default function InventoryReportPage() {
  return (
    <DashboardLayout requiredDepartment="inventory">
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
            Warehousing Valuation & Stock Turn
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
            Inventory Asset Valuation Reports
          </h1>
        </div>

        <Card>
          <CardHeader title="Capital Valuation by Hardware Category (₹ Lakhs)" subtitle="Total asset lockup across warehouses" />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valuationByCategory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '0.75rem' }} />
                <Bar dataKey="value" name="Valuation (Lakhs)" fill="#1F4D3A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
