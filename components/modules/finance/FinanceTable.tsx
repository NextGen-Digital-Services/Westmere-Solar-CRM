'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Printer, CreditCard } from 'lucide-react';
import { PaymentRecord, PaymentReceipt } from '@/types/finance';

interface FinanceTableProps {
  payments: PaymentRecord[];
  onOpenReceipt: (receipt: PaymentReceipt) => void;
  onOpenPaymentModal: (record: PaymentRecord) => void;
}

export function FinanceTable({
  payments,
  onOpenReceipt,
  onOpenPaymentModal,
}: FinanceTableProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xs">
      <table className="w-full text-xs text-left">
        <thead className="bg-[var(--surface-raised)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider">
          <tr>
            <th className="p-3.5 font-semibold">Project & Client</th>
            <th className="p-3.5 font-semibold">Stage</th>
            <th className="p-3.5 font-semibold">Total Cost</th>
            <th className="p-3.5 font-semibold">Paid vs Due</th>
            <th className="p-3.5 font-semibold">Next Due Date</th>
            <th className="p-3.5 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {payments.map((p) => {
            const pct = Math.round((p.totalReceived / p.totalProjectCost) * 100);
            return (
              <tr key={p.id} className="hover:bg-[var(--surface-raised)]/40 transition-colors">
                <td className="p-3.5">
                  <div className="font-mono font-bold text-sm text-[var(--primary)]">{p.projectId}</div>
                  <div className="font-semibold text-xs text-[var(--text-main)]">{p.customerName}</div>
                </td>
                <td className="p-3.5 font-medium">{p.stage}</td>
                <td className="p-3.5 font-mono font-bold">₹{p.totalProjectCost.toLocaleString('en-IN')}</td>
                <td className="p-3.5 w-44">
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-emerald-600 font-bold">₹{p.totalReceived.toLocaleString('en-IN')}</span>
                    <span className="text-[var(--text-muted)]">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--surface-raised)] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </td>
                <td className="p-3.5 font-mono">
                  <span className={p.isOverdue ? 'text-rose-600 font-bold' : 'text-[var(--text-main)]'}>{p.nextDueDate}</span>
                  {p.isOverdue && <span className="block text-[10px] text-rose-600 font-bold">OVERDUE</span>}
                </td>
                <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                  {p.receipts.length > 0 && (
                    <Button size="sm" variant="outline" onClick={() => onOpenReceipt(p.receipts[0])}>
                      <Printer className="w-3.5 h-3.5 mr-1" /> Receipt
                    </Button>
                  )}
                  {p.outstandingBalance > 0 && (
                    <Button size="sm" variant="primary" onClick={() => onOpenPaymentModal(p)}>
                      <CreditCard className="w-3.5 h-3.5 mr-1" /> Receive
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
