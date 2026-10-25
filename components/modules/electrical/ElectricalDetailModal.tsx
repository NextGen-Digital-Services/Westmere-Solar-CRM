'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Printer } from 'lucide-react';
import { ElectricalInspection } from '@/types/electrical';
import { usePermission } from '@/hooks/usePermission';
import { DefectTrackerSection } from './DefectTrackerSection';

interface ElectricalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: ElectricalInspection | null;
  onCheckItem: (inspectionId: string, itemId: string, status: 'Pass' | 'Fail') => void;
  onApprove: (inspectionId: string) => void;
  onAddDefect: (inspectionId: string, defect: { description: string; severity: 'Critical' | 'Major' | 'Minor'; correctiveActionRequired: string }) => void;
  onResolveDefect: (inspectionId: string, defectId: string) => void;
  onOpenReport: (inspection: ElectricalInspection) => void;
}

export function ElectricalDetailModal({
  isOpen,
  onClose,
  inspection,
  onCheckItem,
  onApprove,
  onAddDefect,
  onResolveDefect,
  onOpenReport,
}: ElectricalDetailModalProps) {
  const { can, isManager, isSuperAdmin } = usePermission();
  if (!inspection) return null;

  const canApprove = isSuperAdmin || (isManager && can('approve', 'electrical'));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Electrical Safety Audit: ${inspection.projectId}`} maxWidth="3xl">
      <div className="space-y-6 text-xs text-[var(--text-main)]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)]">
          <div>
            <div className="font-bold text-sm">{inspection.customerName} ({inspection.capacityKW} kW)</div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono">
              Inspector: {inspection.inspectorName} • Earth Pit: <strong>{inspection.earthingResistanceOhms} Ω</strong> (Limit: &lt;5.0 Ω)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={inspection.status === 'Passed' ? 'success' : inspection.status === 'Failed' ? 'danger' : 'warning'}>
              {inspection.status}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => onOpenReport(inspection)}>
              <Printer className="w-3.5 h-3.5 mr-1" /> Safety Certificate
            </Button>
          </div>
        </div>

        {/* Manager Approval Box */}
        <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] flex items-center justify-between">
          <div>
            <div className="font-bold text-sm text-[var(--text-main)]">Managerial Sign-Off & CEA Grid Sanction</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {inspection.managerApproval.isApproved ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Approved by {inspection.managerApproval.approvedBy} on {inspection.managerApproval.approvedAt}
                </span>
              ) : (
                'Pending final engineering manager sign-off'
              )}
            </div>
          </div>
          {!inspection.managerApproval.isApproved && (
            <Button
              size="sm"
              variant="primary"
              disabled={!canApprove}
              title={!canApprove ? 'Restricted to Electrical Department Manager' : undefined}
              onClick={() => onApprove(inspection.id)}
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" /> Approve Safety
            </Button>
          )}
        </div>

        {/* Safety Checklist */}
        <div>
          <h4 className="font-serif font-bold text-sm mb-3">CEA Technical Compliance Points</h4>
          <div className="space-y-2">
            {inspection.checklist.map((item) => (
              <div key={item.id} className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] flex items-center justify-between">
                <div>
                  <span className="font-bold uppercase text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border-color)] mr-2">
                    {item.category}
                  </span>
                  <span className="font-medium">{item.description}</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onCheckItem(inspection.id, item.id, 'Pass')}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                      item.status === 'Pass' ? 'bg-emerald-600 text-white' : 'border border-[var(--border-color)] hover:bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    Pass
                  </button>
                  <button
                    onClick={() => onCheckItem(inspection.id, item.id, 'Fail')}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                      item.status === 'Fail' ? 'bg-rose-600 text-white' : 'border border-[var(--border-color)] hover:bg-rose-50 text-rose-700'
                    }`}
                  >
                    Fail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DefectTrackerSection
          inspectionId={inspection.id}
          defects={inspection.defects}
          onAddDefect={onAddDefect}
          onResolveDefect={onResolveDefect}
        />
      </div>
    </Modal>
  );
}
