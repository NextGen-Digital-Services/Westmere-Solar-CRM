'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'May', revenue: 1450000, collections: 1200000 },
  { month: 'Jun', revenue: 1980000, collections: 1650000 },
  { month: 'Jul', revenue: 2450000, collections: 2100000 },
  { month: 'Aug', revenue: 3200000, collections: 2800000 },
  { month: 'Sep', revenue: 3900000, collections: 3400000 },
  { month: 'Oct', revenue: 4750000, collections: 4120000 },
];

export function RevenueChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-64 flex items-center justify-center text-xs text-[var(--text-muted)]">Loading chart...</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1F4D3A" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#1F4D3A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B5552F" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#B5552F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
          <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `₹${val / 100000}L`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border-color)',
              borderRadius: '0.75rem',
              color: 'var(--text-main)',
              fontSize: '12px',
            }}
            formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
          />
          <Area type="monotone" dataKey="revenue" name="Contracted Value" stroke="#1F4D3A" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
          <Area type="monotone" dataKey="collections" name="Collected Cash" stroke="#B5552F" strokeWidth={2} fillOpacity={1} fill="url(#colorCol)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
