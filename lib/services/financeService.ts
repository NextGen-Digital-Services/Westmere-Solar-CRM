import { PaymentRecord, PaymentReceipt, PaymentStage } from '@/types/finance';
import { INITIAL_PAYMENTS } from '@/lib/mock-data/payments.seed';
import { getStoredData, setStoredData } from './storage';
import { auditService } from './auditService';
import { authService } from './authService';

const PAYMENTS_KEY = 'solarcrm_payments';

export const financeService = {
  getPayments: (): PaymentRecord[] => {
    return getStoredData<PaymentRecord[]>(PAYMENTS_KEY, INITIAL_PAYMENTS);
  },

  getPaymentById: (id: string): PaymentRecord | undefined => {
    return financeService.getPayments().find((p) => p.id === id || p.projectId === id);
  },

  addPaymentReceipt: (
    recordId: string,
    receiptData: Omit<PaymentReceipt, 'receiptNumber' | 'paymentDate'>
  ): PaymentRecord | null => {
    const payments = getStoredData<PaymentRecord[]>(PAYMENTS_KEY, INITIAL_PAYMENTS);
    const idx = payments.findIndex((p) => p.id === recordId || p.projectId === recordId);
    if (idx === -1) return null;

    const session = authService.getCurrentSession();
    const now = new Date().toISOString().split('T')[0];
    const receiptNum = `RCP-2026-${String(payments[idx].receipts.length + 101).padStart(4, '0')}`;

    const newReceipt: PaymentReceipt = {
      ...receiptData,
      receiptNumber: receiptNum,
      paymentDate: now,
      receivedByName: session?.user.name || 'Suresh Iyer',
    };

    const updatedReceived = payments[idx].totalReceived + receiptData.amount;
    const updatedBalance = Math.max(0, payments[idx].totalProjectCost - updatedReceived);

    const prevBalance = payments[idx].outstandingBalance;
    payments[idx].receipts.unshift(newReceipt);
    payments[idx].totalReceived = updatedReceived;
    payments[idx].outstandingBalance = updatedBalance;
    payments[idx].lastPaymentDate = now;
    payments[idx].status = updatedBalance === 0 ? 'Paid in Full' : 'Partially Paid';
    payments[idx].isOverdue = false;

    setStoredData(PAYMENTS_KEY, payments);

    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: 'finance',
        action: 'CREATE',
        module: 'FINANCE',
        recordId: receiptNum,
        summary: `Created receipt ${receiptNum} of ₹${receiptData.amount.toLocaleString('en-IN')} for ${payments[idx].customerName}`,
        beforeValue: `Outstanding: ₹${prevBalance.toLocaleString('en-IN')}`,
        afterValue: `Outstanding: ₹${updatedBalance.toLocaleString('en-IN')}`,
      });
    }

    return payments[idx];
  },

  updatePaymentStage: (id: string, stage: PaymentStage): PaymentRecord | null => {
    const payments = getStoredData<PaymentRecord[]>(PAYMENTS_KEY, INITIAL_PAYMENTS);
    const idx = payments.findIndex((p) => p.id === id || p.projectId === id);
    if (idx === -1) return null;

    payments[idx].stage = stage;
    setStoredData(PAYMENTS_KEY, payments);
    return payments[idx];
  },

  exportToCSV: (payments: PaymentRecord[]): void => {
    const headers = ['Record ID', 'Project ID', 'Customer Name', 'Total Cost', 'Received', 'Balance', 'Stage', 'Status', 'Next Due Date'];
    const rows = payments.map((p) => [
      p.id,
      p.projectId,
      `"${p.customerName}"`,
      p.totalProjectCost,
      p.totalReceived,
      p.outstandingBalance,
      `"${p.stage}"`,
      `"${p.status}"`,
      p.nextDueDate,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finance_payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
