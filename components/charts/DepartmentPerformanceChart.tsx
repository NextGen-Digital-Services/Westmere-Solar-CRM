'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { dept: 'Sales', completed: 42, target: 50 },
  { dept: 'Reg', completed: 25, target: 30 },
  { dept: 'Finance', completed: 28, target: 30 },
  { dept: 'Inventory', completed: 38, target: 40 },
  { dept: 'Install', completed: 18, target: 20 },
  { dept: 'Electrical', completed: 17, target: 20 },
  { dept: 'Subsidy', completed: 16, target: 20 },
];

export function DepartmentPerformanceChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-64 flex items-center justify-center text-xs text-[var(--text-muted)]">Loading chart...</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
          <XAxis dataKey="dept" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border-color)',
              borderRadius: '0.75rem',
              color: 'var(--text-main)',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="completed" name="Completed Units" fill="#1F4D3A" radius={[6, 6, 0, 0]} />
          <Bar dataKey="target" name="Monthly Target" fill="#B8945A" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
