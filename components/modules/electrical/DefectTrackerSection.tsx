'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { DefectItem } from '@/types/electrical';

interface DefectTrackerSectionProps {
  inspectionId: string;
  defects: DefectItem[];
  onAddDefect: (inspectionId: string, defect: { description: string; severity: 'Critical' | 'Major' | 'Minor'; correctiveActionRequired: string }) => void;
  onResolveDefect: (inspectionId: string, defectId: string) => void;
}

export function DefectTrackerSection({
  inspectionId,
  defects,
  onAddDefect,
  onResolveDefect,
}: DefectTrackerSectionProps) {
  const [defectDesc, setDefectDesc] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');

  const handleCreateDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defectDesc) return;
    onAddDefect(inspectionId, {
      description: defectDesc,
      severity: 'Critical',
      correctiveActionRequired: correctiveAction || 'Re-test with calibrated earth meter',
    });
    setDefectDesc('');
    setCorrectiveAction('');
  };

  return (
    <div>
      <h4 className="font-serif font-bold text-sm mb-2">Defect Rectification Tracker ({defects.length})</h4>
      <form onSubmit={handleCreateDefect} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
        <input
          type="text"
          placeholder="Defect description (e.g. Earth resistance > 5 Ohms)"
          value={defectDesc}
          onChange={(e) => setDefectDesc(e.target.value)}
          className="px-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs sm:col-span-2"
          required
        />
        <Button type="submit" variant="danger" size="sm">
          <AlertCircle className="w-3.5 h-3.5 mr-1" /> Log Defect
        </Button>
      </form>

      {defects.map((def) => (
        <div key={def.id} className="p-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/30 flex items-center justify-between mb-2 text-xs">
          <div>
            <span className="font-bold text-rose-700 dark:text-rose-300">{def.description}</span>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Required: {def.correctiveActionRequired}</div>
          </div>
          {def.resolved ? (
            <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Rectified
            </span>
          ) : (
            <Button size="sm" variant="outline" onClick={() => onResolveDefect(inspectionId, def.id)}>
              Mark Resolved
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
