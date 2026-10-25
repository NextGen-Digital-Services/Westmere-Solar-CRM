'use client';

import React from 'react';

const funnelStages = [
  { stage: 'Inquiries & Leads', count: 42, pct: '100%', color: 'bg-[#1F4D3A]' },
  { stage: 'Verified KYC Registrations', count: 25, pct: '59.5%', color: 'bg-[#2D664E]' },
  { stage: 'Advance Payments Collected', count: 22, pct: '52.3%', color: 'bg-[#B8945A]' },
  { stage: 'Site Installations Done', count: 18, pct: '42.8%', color: 'bg-[#B5552F]' },
  { stage: 'Safety Passed & Grid Sync', count: 16, pct: '38.0%', color: 'bg-[#8F3F1F]' },
  { stage: 'Subsidy Disbursed', count: 12, pct: '28.5%', color: 'bg-[#6FAE8D]' },
];

export function PipelineFunnelChart() {
  return (
    <div className="space-y-3 py-2">
      {funnelStages.map((item) => (
        <div key={item.stage} className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-[var(--text-main)]">{item.stage}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[var(--text-main)]">{item.count}</span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">({item.pct})</span>
            </div>
          </div>
          <div className="w-full h-3 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-full overflow-hidden">
            <div
              className={`h-full ${item.color} rounded-full transition-all duration-500`}
              style={{ width: item.pct }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
