import { PaymentRecord, PaymentReceipt, PaymentStage } from '@/types/finance';

export const INITIAL_PAYMENTS: PaymentRecord[] = Array.from({ length: 30 }).map((_, i) => {
  const num = i + 1;
  const projectIndex = (i % 25) + 1;
  const projectId = `SOL-2026-${String(projectIndex).padStart(4, '0')}`;
  const names = [
    'Sunita Deshmukh', 'Praveen Somani', 'Kishore Jhaveri', 'Mahesh Bhatt',
    'Ritu Aggarwal', 'Venkatesh Prasad', 'Manohar Lal', 'Sanjay Bhandari',
    'Geeta Subramaniam', 'Hemant Patil', 'Swati Deshpande', 'Kiran Mazumdar',
    'Tarun Tahiliani', 'Nalini Chawla', 'Chetan Bhagat', 'Sudha Murthy',
    'Arun Jaitley', 'Farhan Akhtar', 'Rohit Shetty', 'Mira Rajput',
    'Gautam Singhal', 'Pallavi Shinde', 'Nitin Gadkari', 'Anand Mahindra',
    'Azim Premji', 'Devendra Patil', 'Rajiv Bajaj', 'Nirmala Sitharaman',
    'Uday Kotak', 'Shikha Sharma'
  ];
  const stages: PaymentStage[] = [
    'Advance / Booking',
    '1st Instalment (Pre-Dispatch)',
    '2nd Instalment (Post-Installation)',
    'Final Balance (Commissioning)',
  ];
  const totalCost = 150000 + (i % 5) * 45000;
  const stage = stages[i % stages.length];

  let received = 0;
  let status: PaymentRecord['status'] = 'Payment Pending';
  let isOverdue = false;

  if (stage === 'Advance / Booking') {
    received = Math.round(totalCost * 0.2);
    status = 'Partially Paid';
  } else if (stage === '1st Instalment (Pre-Dispatch)') {
    received = Math.round(totalCost * 0.6);
    status = 'Partially Paid';
  } else if (stage === '2nd Instalment (Post-Installation)') {
    received = Math.round(totalCost * 0.9);
    status = i % 3 === 0 ? 'Overdue' : 'Partially Paid';
    isOverdue = i % 3 === 0;
  } else {
    received = totalCost;
    status = 'Paid in Full';
  }

  const outstanding = totalCost - received;

  const receipts: PaymentReceipt[] = [
    {
      receiptNumber: `RCP-2026-${String(100 + num).padStart(4, '0')}`,
      projectId: projectId,
      customerName: names[i % names.length],
      amount: received,
      paymentMode: i % 2 === 0 ? 'NEFT/RTGS' : 'UPI',
      transactionRef: `TXN${9900000 + i * 231}`,
      paymentDate: `2026-10-${String(1 + (i % 20)).padStart(2, '0')}`,
      receivedByName: i % 2 === 0 ? 'Kavita Rao' : 'Manish Mehta',
      notes: `Payment towards ${stage}`,
    },
  ];

  return {
    id: `pay-${String(num).padStart(3, '0')}`,
    projectId: projectId,
    customerName: names[i % names.length],
    totalProjectCost: totalCost,
    totalReceived: received,
    outstandingBalance: outstanding,
    stage: stage,
    receipts: receipts,
    nextDueDate: isOverdue ? '2026-10-15' : `2026-11-${String(5 + (i % 20)).padStart(2, '0')}`,
    isOverdue: isOverdue,
    status: status,
    lastPaymentDate: `2026-10-${String(1 + (i % 20)).padStart(2, '0')}`,
  };
});
