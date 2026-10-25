'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Printer, CheckCircle, ShieldCheck, Wrench } from 'lucide-react';

export function PrintableReportModal({
  isOpen,
  onClose,
  title,
  subtitle,
  projectId,
  customerName,
  dataItems,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  projectId: string;
  customerName: string;
  dataItems: { label: string; value: string | React.ReactNode }[];
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Technical Report Preview" maxWidth="2xl">
      <div className="space-y-6">
        <div className="flex justify-end gap-2 print:hidden pb-3 border-b border-[var(--border-color)]">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="bg-white dark:bg-[#1E1A17] p-6 sm:p-8 rounded-xl border border-[var(--border-color)] font-sans">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-5">
            <div>
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">ELIOS SOLARIS</h2>
              <p className="text-xs text-[var(--text-muted)]">{title}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[var(--gold)]">{projectId}</span>
              <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
            </div>
          </div>

          <div className="mb-4 text-xs font-semibold text-[var(--text-muted)] uppercase">
            Customer: <span className="text-[var(--text-main)] font-bold text-sm ml-1">{customerName}</span>
          </div>

          <div className="divide-y divide-[var(--border-color)] text-xs">
            {dataItems.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2.5">
                <span className="text-[var(--text-muted)]">{item.label}:</span>
                <span className="font-medium text-[var(--text-main)] text-right">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-[var(--border-color)] flex justify-between items-end text-xs text-[var(--text-muted)]">
            <div>
              <p>Inspector / Site Engineer</p>
              <div className="mt-6 border-t border-dashed border-[var(--border-color)] w-36 pt-1 text-[10px]">
                Authorized Signature
              </div>
            </div>
            <div>
              <p>Department Manager</p>
              <div className="mt-6 border-t border-dashed border-[var(--border-color)] w-36 pt-1 text-[10px]">
                Technical Seal & Approval
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
