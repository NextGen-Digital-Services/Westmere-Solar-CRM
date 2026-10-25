'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PrintableQuotationModal } from '@/components/ui/PrintableQuotationModal';
import { salesService } from '@/lib/services/salesService';
import { FileText, Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Quotation } from '@/types/sales';

export default function QuotationsPage() {
  const [quotations] = useState<Quotation[]>(() => salesService.getQuotations());
  const [previewQuote, setPreviewQuote] = useState<Quotation | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <DashboardLayout requiredDepartment="sales">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/sales" className="p-2 rounded-xl border border-[var(--border-color)] hover:bg-[var(--surface-raised)]">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">Proposal Repository</span>
              <h1 className="font-serif text-2xl font-bold text-[var(--text-main)]">Formal Solar Quotations ({quotations.length})</h1>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-[var(--surface-raised)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 font-semibold">Proposal No</th>
                <th className="p-3.5 font-semibold">Capacity (kW)</th>
                <th className="p-3.5 font-semibold">Panel & Inverter Spec</th>
                <th className="p-3.5 font-semibold">Grand Total</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Valid Until</th>
                <th className="p-3.5 font-semibold text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {quotations.map((q) => (
                <tr key={q.id} className="hover:bg-[var(--surface-raised)]/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[var(--primary)]">{q.quotationNumber}</td>
                  <td className="p-3.5 font-bold">{q.systemCapacityKW} kW</td>
                  <td className="p-3.5">
                    <div className="font-medium">{q.panelModel} ({q.panelCount}x)</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{q.inverterModel}</div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-sm text-[var(--text-main)]">
                    ₹{q.grandTotal.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5">
                    <Badge variant={q.status === 'Accepted' ? 'success' : q.status === 'Sent' ? 'info' : 'neutral'}>
                      {q.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-mono text-[var(--text-muted)]">{q.validUntil}</td>
                  <td className="p-3.5 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPreviewQuote(q);
                        setPreviewOpen(true);
                      }}
                    >
                      <Printer className="w-3.5 h-3.5 mr-1" /> View PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PrintableQuotationModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        quotation={previewQuote}
      />
    </DashboardLayout>
  );
}
