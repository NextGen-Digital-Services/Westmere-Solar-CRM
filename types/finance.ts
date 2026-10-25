export type PaymentMode = 'NEFT/RTGS' | 'UPI' | 'Cheque' | 'Net Banking' | 'Card';

export type PaymentStage =
  | 'Advance / Booking'
  | '1st Instalment (Pre-Dispatch)'
  | '2nd Instalment (Post-Installation)'
  | 'Final Balance (Commissioning)';

export interface PaymentReceipt {
  receiptNumber: string;
  projectId: string;
  customerName: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionRef: string;
  paymentDate: string;
  receivedByName: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  projectId: string;
  customerName: string;
  totalProjectCost: number;
  totalReceived: number;
  outstandingBalance: number;
  stage: PaymentStage;
  receipts: PaymentReceipt[];
  nextDueDate: string;
  isOverdue: boolean;
  status: 'Paid in Full' | 'Partially Paid' | 'Payment Pending' | 'Overdue';
  lastPaymentDate?: string;
}
