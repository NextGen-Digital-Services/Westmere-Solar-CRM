'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PaymentReceipt } from '@/types/finance';

export function PrintableReceiptModal({
  isOpen,
  onClose,
  receipt,
}: {
  isOpen: boolean;
  onClose: () => void;
  receipt: PaymentReceipt | null;
}) {
  if (!receipt) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Payment Receipt" maxWidth="xl">
      <div className="space-y-6">
        <div className="flex justify-end gap-2 print:hidden pb-3 border-b border-[var(--border-color)]">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>

        <div className="bg-white dark:bg-[#1E1A17] p-6 sm:p-8 rounded-xl border border-[var(--border-color)] font-sans">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">ELIOS SOLARIS</h2>
              <p className="text-xs text-[var(--text-muted)]">Official Payment Voucher & Acknowledgement</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[var(--accent)]">{receipt.receiptNumber}</span>
              <p className="text-xs text-[var(--text-muted)]">Date: {receipt.paymentDate}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs mb-6">
            <div className="flex justify-between py-1.5 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-muted)]">Project ID:</span>
              <span className="font-mono font-semibold">{receipt.projectId}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-muted)]">Customer Name:</span>
              <span className="font-semibold text-sm">{receipt.customerName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-muted)]">Payment Mode:</span>
              <span className="font-medium">{receipt.paymentMode}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-muted)]">Transaction Reference:</span>
              <span className="font-mono font-semibold">{receipt.transactionRef}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-muted)]">Received By:</span>
              <span>{receipt.receivedByName}</span>
            </div>
            {receipt.notes && (
              <div className="flex justify-between py-1.5 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-muted)]">Purpose / Notes:</span>
                <span>{receipt.notes}</span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-[#182B21] border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold uppercase text-emerald-800 dark:text-emerald-300">
                Amount Received in Full
              </span>
            </div>
            <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-300">
              ₹{receipt.amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
