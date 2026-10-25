'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Edit2 } from 'lucide-react';
import { InstallationTask } from '@/types/installation';

interface InstallationTableProps {
  tasks: InstallationTask[];
  onOpenDetail: (task: InstallationTask) => void;
  onEditTask: (task: InstallationTask) => void;
}

export function InstallationTable({
  tasks,
  onOpenDetail,
  onEditTask,
}: InstallationTableProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xs">
      <table className="w-full text-xs text-left">
        <thead className="bg-[var(--surface-raised)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider">
          <tr>
            <th className="p-3.5 font-semibold">Project ID</th>
            <th className="p-3.5 font-semibold">Customer & Site</th>
            <th className="p-3.5 font-semibold">Capacity</th>
            <th className="p-3.5 font-semibold">Lead Tech</th>
            <th className="p-3.5 font-semibold">Scheduled</th>
            <th className="p-3.5 font-semibold">Status</th>
            <th className="p-3.5 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {tasks.map((t) => (
            <tr key={t.id} className="hover:bg-[var(--surface-raised)]/40 transition-colors">
              <td className="p-3.5 font-mono font-bold text-sm text-[var(--primary)]">{t.projectId}</td>
              <td className="p-3.5">
                <div className="font-semibold text-sm text-[var(--text-main)]">{t.customerName}</div>
                <div className="text-[11px] text-[var(--text-muted)] truncate max-w-xs">{t.siteAddress}</div>
              </td>
              <td className="p-3.5 font-mono font-bold">{t.systemCapacityKW} kW</td>
              <td className="p-3.5 font-medium">{t.leadTechnician}</td>
              <td className="p-3.5 font-mono text-[var(--gold)]">{t.scheduledDate}</td>
              <td className="p-3.5">
                <Badge variant={t.status === 'Commissioned' ? 'success' : t.isDelayed ? 'danger' : 'info'}>{t.status}</Badge>
                {t.isDelayed && (
                  <span className="block text-[10px] text-rose-600 font-bold mt-1">
                    DELAYED +{t.delayDays}d: {t.delayReason}
                  </span>
                )}
              </td>
              <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                <Button size="sm" variant="outline" onClick={() => onOpenDetail(t)}>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Checklist ({t.checklist.filter((c) => c.completed).length}/6)
                </Button>
                <button onClick={() => onEditTask(t)} className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--surface-raised)]">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
