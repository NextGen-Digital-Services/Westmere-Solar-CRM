'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Zap } from 'lucide-react';
import { ElectricalInspection } from '@/types/electrical';

interface ElectricalTableProps {
  inspections: ElectricalInspection[];
  onOpenAudit: (inspection: ElectricalInspection) => void;
}

export function ElectricalTable({ inspections, onOpenAudit }: ElectricalTableProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xs">
      <table className="w-full text-xs text-left">
        <thead className="bg-[var(--surface-raised)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider">
          <tr>
            <th className="p-3.5 font-semibold">Project & Customer</th>
            <th className="p-3.5 font-semibold">Capacity</th>
            <th className="p-3.5 font-semibold">Earth Resistance</th>
            <th className="p-3.5 font-semibold">Inspector</th>
            <th className="p-3.5 font-semibold">Sign-off</th>
            <th className="p-3.5 font-semibold">Status</th>
            <th className="p-3.5 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {inspections.map((i) => (
            <tr key={i.id} className="hover:bg-[var(--surface-raised)]/40 transition-colors">
              <td className="p-3.5">
                <div className="font-mono font-bold text-sm text-[var(--primary)]">{i.projectId}</div>
                <div className="font-semibold text-xs text-[var(--text-main)]">{i.customerName}</div>
              </td>
              <td className="p-3.5 font-mono font-bold">{i.capacityKW} kW</td>
              <td className="p-3.5 font-mono font-semibold">
                <span className={i.earthingResistanceOhms > 5 ? 'text-rose-600 font-bold' : 'text-emerald-700 dark:text-emerald-400'}>
                  {i.earthingResistanceOhms} Ω
                </span>
                {i.earthingResistanceOhms > 5 && <span className="block text-[10px] text-rose-600">HIGH</span>}
              </td>
              <td className="p-3.5 font-medium">{i.inspectorName}</td>
              <td className="p-3.5">
                {i.managerApproval.isApproved ? (
                  <Badge variant="success">Approved</Badge>
                ) : (
                  <Badge variant="neutral">Pending Approval</Badge>
                )}
              </td>
              <td className="p-3.5">
                <Badge variant={i.status === 'Passed' ? 'success' : i.status === 'Failed' ? 'danger' : 'warning'}>{i.status}</Badge>
              </td>
              <td className="p-3.5 text-right whitespace-nowrap">
                <Button size="sm" variant="outline" onClick={() => onOpenAudit(i)}>
                  <Zap className="w-3.5 h-3.5 mr-1" /> Audit Checklist
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
