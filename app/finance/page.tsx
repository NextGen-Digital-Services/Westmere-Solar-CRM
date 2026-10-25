'use client';

import React, { useState, useMemo } from 'react';
import { Download, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PaymentModal } from '@/components/modules/finance/PaymentModal';
import { PrintableReceiptModal } from '@/components/ui/PrintableReceiptModal';
import { FinanceTable } from '@/components/modules/finance/FinanceTable';
import { financeService } from '@/lib/services/financeService';
import { useToast } from '@/components/providers/ToastProvider';
import { PaymentRecord, PaymentReceipt } from '@/types/finance';

export default function FinancePage() {
  const [payments, setPayments] = useState<PaymentRecord[]>(() => financeService.getPayments());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PaymentRecord | null>(null);

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [previewReceipt, setPreviewReceipt] = useState<PaymentReceipt | null>(null);

  const { success } = useToast();

  const totalBilled = useMemo(() => payments.reduce((acc, p) => acc + p.totalProjectCost, 0), [payments]);
  const totalCollected = useMemo(() => payments.reduce((acc, p) => acc + p.totalReceived, 0), [payments]);
  const totalDue = useMemo(() => payments.reduce((acc, p) => acc + p.outstandingBalance, 0), [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch = p.customerName.toLowerCase().includes(search.toLowerCase()) || p.projectId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || (statusFilter === 'Overdue' ? p.isOverdue : p.status === statusFilter);
      return matchSearch && matchStatus;
    });
  }, [payments, search, statusFilter]);

  const handleSavePayment = (recordId: string, data: any) => {
    const updated = financeService.addPaymentReceipt(recordId, data);
    setPayments(financeService.getPayments());
    if (updated && updated.receipts.length > 0) {
      setPreviewReceipt(updated.receipts[0]);
      setReceiptModalOpen(true);
    }
    success('Payment transaction successfully posted to ledger.');
  };

  return (
    <DashboardLayout requiredDepartment="finance">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">Treasury & Accounts Receivable</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">Project Instalments & Cash Receipts</h1>
          </div>
          <Button size="sm" variant="outline" onClick={() => financeService.exportToCSV(filteredPayments)}>
            <Download className="w-4 h-4 mr-1.5" /> Export Ledger CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase">Total Contracted Cost</span>
            <div className="text-2xl font-bold font-serif text-[var(--text-main)] mt-1">₹{(totalBilled / 100000).toFixed(1)} Lakhs</div>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-emerald-600 font-semibold uppercase">Realized Collections</span>
            <div className="text-2xl font-bold font-serif text-emerald-700 dark:text-emerald-400 mt-1">₹{(totalCollected / 100000).toFixed(1)} Lakhs</div>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-rose-600 font-semibold uppercase">Outstanding Receivable</span>
            <div className="text-2xl font-bold font-serif text-rose-700 dark:text-rose-400 mt-1">₹{(totalDue / 100000).toFixed(1)} Lakhs</div>
          </Card>
        </div>

        <Card className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            <input type="text" placeholder="Search by customer or Project ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] cursor-pointer">
            <option value="ALL">All Accounts</option>
            <option value="Overdue">Overdue Alerts Only</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid in Full">Paid in Full</option>
          </select>
        </Card>

        <FinanceTable
          payments={filteredPayments}
          onOpenReceipt={(r) => { setPreviewReceipt(r); setReceiptModalOpen(true); }}
          onOpenPaymentModal={(p) => { setSelectedRecord(p); setPaymentModalOpen(true); }}
        />
      </div>

      <PaymentModal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} onSavePayment={handleSavePayment} record={selectedRecord} />
      <PrintableReceiptModal isOpen={receiptModalOpen} onClose={() => setReceiptModalOpen(false)} receipt={previewReceipt} />
    </DashboardLayout>
  );
}
