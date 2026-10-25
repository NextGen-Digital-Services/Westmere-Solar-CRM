'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PaymentRecord, PaymentMode } from '@/types/finance';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (recordId: string, data: { amount: number; paymentMode: PaymentMode; transactionRef: string; notes?: string }) => void;
  record: PaymentRecord | null;
}

export function PaymentModal({ isOpen, onClose, onSavePayment, record }: PaymentModalProps) {
  const [amount, setAmount] = useState(50000);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('NEFT/RTGS');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');

  if (!record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePayment(record.id, {
      amount: Number(amount),
      paymentMode,
      transactionRef: transactionRef || `TXN${Math.floor(1000000 + Math.random() * 9000000)}`,
      notes,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Record Payment: ${record.projectId}`} maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)]">
          <div className="text-[var(--text-muted)]">Customer: <strong className="text-[var(--text-main)]">{record.customerName}</strong></div>
          <div className="flex justify-between mt-1">
            <span>Outstanding Balance:</span>
            <span className="font-mono font-bold text-rose-600">₹{record.outstandingBalance.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <Input
          label="Payment Amount Received (₹)"
          type="number"
          min="1000"
          max={record.outstandingBalance}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />

        <Select
          label="Banking Mode"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
          options={[
            { label: 'NEFT / RTGS Bank Transfer', value: 'NEFT/RTGS' },
            { label: 'UPI / QR Payment', value: 'UPI' },
            { label: 'Bank Cheque / DD', value: 'Cheque' },
            { label: 'Net Banking Direct', value: 'Net Banking' },
          ]}
        />

        <Input
          label="Bank Transaction Reference / UTR No"
          placeholder="e.g. UTR202610249811"
          value={transactionRef}
          onChange={(e) => setTransactionRef(e.target.value)}
          required
        />

        <Input
          label="Instalment Purpose / Notes"
          placeholder="e.g. 2nd instalment payment against dispatched materials"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Record & Generate Receipt
          </Button>
        </div>
      </form>
    </Modal>
  );
}
