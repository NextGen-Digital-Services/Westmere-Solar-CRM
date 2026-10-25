'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, CheckCircle2, AlertCircle, FileCheck, DollarSign } from 'lucide-react';
import { SubsidyApplication, SubsidyStatus } from '@/types/subsidy';

interface SubsidyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: SubsidyApplication | null;
  onUpdateStatus: (id: string, status: SubsidyStatus) => void;
}

export function SubsidyDetailModal({
  isOpen,
  onClose,
  application,
  onUpdateStatus,
}: SubsidyDetailModalProps) {
  if (!application) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`PM Surya Ghar Dossier: ${application.nationalPortalRef}`} maxWidth="3xl">
      <div className="space-y-6 text-xs text-[var(--text-main)]">
        {/* Header summary */}
        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-bold text-sm">{application.customerName}</div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono">
              Consumer No: {application.consumerNumber} • {application.systemCapacityKW} kW Rooftop System
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[var(--text-muted)] uppercase">Sanctioned Subsidy</span>
            <div className="text-xl font-bold font-mono text-[var(--primary)]">
              ₹{application.eligibleSubsidyAmountINR.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Workflow Action Bar */}
        <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text-muted)]">Portal Lifecycle Status:</span>
            <Badge variant={application.status === 'Disbursed' ? 'success' : application.status === 'Approved' ? 'gold' : application.status === 'Rejected' ? 'danger' : 'info'}>
              {application.status}
            </Badge>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {application.status !== 'Approved' && application.status !== 'Disbursed' && (
              <Button size="sm" variant="outline" onClick={() => onUpdateStatus(application.id, 'Approved')}>
                Mark Approved
              </Button>
            )}
            {application.status !== 'Disbursed' && (
              <Button size="sm" variant="primary" onClick={() => onUpdateStatus(application.id, 'Disbursed')}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Disbursed to Bank
              </Button>
            )}
            {application.status !== 'Rejected' && (
              <Button size="sm" variant="danger" onClick={() => onUpdateStatus(application.id, 'Rejected')}>
                Reject Claim
              </Button>
            )}
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div>
          <h4 className="font-serif font-bold text-sm mb-3">Portal Mandatory Verification Checklist</h4>
          <div className="space-y-2">
            {application.checklist.map((c) => (
              <div key={c.id} className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${c.isAvailable ? 'text-emerald-600' : 'text-[var(--text-muted)]'}`} />
                  <span className="font-medium">{c.name}</span>
                </div>
                <Badge variant={c.isAvailable ? 'success' : 'neutral'}>
                  {c.isAvailable ? 'Uploaded & Verified' : 'Missing'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Disbursement Details */}
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-[#182B21] border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 flex items-center justify-between">
          <div>
            <div className="font-bold">Customer Direct Bank Transfer (DBT)</div>
            <div className="text-[11px] opacity-80 mt-0.5">
              NPCI Aadhaar Linked Account ending with •••• {application.bankAccountLast4 || '8812'}
            </div>
          </div>
          <span className="font-bold text-sm uppercase px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700">
            {application.disbursementStatus}
          </span>
        </div>
      </div>
    </Modal>
  );
}
