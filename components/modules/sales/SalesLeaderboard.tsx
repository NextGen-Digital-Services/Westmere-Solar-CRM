'use client';

import React from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Trophy, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { Lead } from '@/types/sales';

interface SalesLeaderboardProps {
  leads: Lead[];
}

export function SalesLeaderboard({ leads }: SalesLeaderboardProps) {
  const reps = [
    { id: 'user-sales-emp1', name: 'Amit Verma' },
    { id: 'user-sales-emp2', name: 'Priya Nair' },
    { id: 'user-sales-mgr', name: 'Rahul Sharma' },
  ];

  const stats = reps.map((rep, idx) => {
    const repLeads = leads.filter((l) => l.assignedToId === rep.id);
    const converted = repLeads.filter((l) => l.status === 'Converted').length;
    const rate = repLeads.length > 0 ? Math.round((converted / repLeads.length) * 100) : 0;
    const totalKW = repLeads.filter((l) => l.status === 'Converted').reduce((acc, l) => acc + l.capacityKW, 0);
    const estValue = totalKW * 45000;

    return {
      ...rep,
      totalLeads: repLeads.length,
      converted,
      conversionRate: rate,
      totalKW,
      estValue,
      rank: idx + 1,
    };
  }).sort((a, b) => b.estValue - a.estValue);

  return (
    <Card>
      <CardHeader
        title="Sales Team Leaderboard"
        subtitle="Rep performance: conversion velocity and booked pipeline value"
        action={<Trophy className="w-5 h-5 text-amber-500" />}
      />

      <div className="space-y-3 mt-2">
        {stats.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)] text-xs"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  index === 0
                    ? 'bg-amber-400 text-stone-900'
                    : index === 1
                    ? 'bg-slate-300 text-stone-800'
                    : 'bg-amber-700/60 text-white'
                }`}
              >
                {index + 1}
              </span>
              <div>
                <span className="font-bold text-[var(--text-main)] text-sm">{item.name}</span>
                <div className="text-[11px] text-[var(--text-muted)]">
                  {item.totalLeads} inquiries assigned • {item.converted} converted
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono font-bold text-sm text-[var(--primary)]">
                ₹{(item.estValue / 100000).toFixed(1)}L booked
              </div>
              <div className="text-[10px] font-mono text-[var(--gold)]">
                {item.conversionRate}% conversion rate ({item.totalKW} kW)
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
