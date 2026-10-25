'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Printer, Download, Sun, CheckCircle } from 'lucide-react';
import { Quotation } from '@/types/sales';

export function PrintableQuotationModal({
  isOpen,
  onClose,
  quotation,
  customerName,
}: {
  isOpen: boolean;
  onClose: () => void;
  quotation: Quotation | null;
  customerName?: string;
}) {
  if (!quotation) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quotation Proposal Preview" maxWidth="3xl">
      <div className="space-y-6 text-[var(--text-main)] print:p-0">
        {/* Actions */}
        <div className="flex justify-end gap-2 print:hidden pb-3 border-b border-[var(--border-color)]">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print / Save PDF
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>

        {/* Formal Proposal Sheet */}
        <div className="bg-white dark:bg-[#1E1A17] p-6 sm:p-8 rounded-xl border border-[var(--border-color)] shadow-xs font-sans">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-[var(--primary)] font-serif text-2xl font-bold tracking-tight">
                <Sun className="w-6 h-6 text-amber-500" />
                ELIOS SOLARIS
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Italian Engineered Photovoltaic Systems & Solutions
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                GSTIN: 27AABCS1429M1ZP | CIN: U40106MH2025PTC11234
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase font-semibold text-[var(--accent)] tracking-wider">
                Formal Solar Proposal
              </span>
              <h2 className="text-lg font-mono font-bold mt-0.5">{quotation.quotationNumber}</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">Date: {quotation.createdAt}</p>
              <p className="text-xs text-[var(--text-muted)]">Valid Until: {quotation.validUntil}</p>
            </div>
          </div>

          {/* Customer & Technical Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)] text-xs">
            <div>
              <span className="font-semibold text-[var(--text-muted)] uppercase">Client Information:</span>
              <p className="text-sm font-bold text-[var(--text-main)] mt-1">{customerName || 'Valued Customer'}</p>
              <p className="text-[var(--text-muted)]">Rooftop Solar Grid-Tied System</p>
            </div>
            <div>
              <span className="font-semibold text-[var(--text-muted)] uppercase">System Specifications:</span>
              <p className="text-sm font-bold text-[var(--text-main)] mt-1">{quotation.systemCapacityKW} kW Peak Capacity</p>
              <p className="text-[var(--text-muted)]">{quotation.panelCount}x {quotation.panelModel}</p>
              <p className="text-[var(--text-muted)]">Inverter: {quotation.inverterModel}</p>
            </div>
          </div>

          {/* Line items table */}
          <table className="w-full text-xs text-left border-collapse mb-6">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider">
                <th className="py-2.5 font-semibold">Item & Specification</th>
                <th className="py-2.5 font-semibold text-center">Qty</th>
                <th className="py-2.5 font-semibold text-right">Unit Rate (₹)</th>
                <th className="py-2.5 font-semibold text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {quotation.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-2.5 font-medium">{item.description}</td>
                  <td className="py-2.5 text-center font-mono">{item.quantity} {item.unit}</td>
                  <td className="py-2.5 text-right font-mono tabular-nums">{item.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 text-right font-mono tabular-nums font-semibold">{item.totalPrice.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Calculation */}
          <div className="flex justify-end border-t border-[var(--border-color)] pt-4">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Subtotal:</span>
                <span className="font-mono tabular-nums">₹{quotation.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {quotation.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Special Discount:</span>
                  <span className="font-mono tabular-nums">-₹{quotation.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Solar Composite GST ({quotation.gstPercent}%):</span>
                <span className="font-mono tabular-nums">₹{quotation.gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-[var(--border-color)] pt-2 text-[var(--text-main)]">
                <span>Net Total:</span>
                <span className="font-mono tabular-nums text-[var(--primary)]">₹{quotation.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
