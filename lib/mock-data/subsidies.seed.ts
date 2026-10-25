import { SubsidyApplication, SubsidyStatus } from '@/types/subsidy';

export const INITIAL_SUBSIDIES: SubsidyApplication[] = Array.from({ length: 20 }).map((_, i) => {
  const num = i + 1;
  const projectId = `SOL-2026-${String(num).padStart(4, '0')}`;
  const names = [
    'Sunita Deshmukh', 'Praveen Somani', 'Kishore Jhaveri', 'Mahesh Bhatt',
    'Ritu Aggarwal', 'Venkatesh Prasad', 'Manohar Lal', 'Sanjay Bhandari',
    'Geeta Subramaniam', 'Hemant Patil', 'Swati Deshpande', 'Kiran Mazumdar',
    'Tarun Tahiliani', 'Nalini Chawla', 'Chetan Bhagat', 'Sudha Murthy',
    'Arun Jaitley', 'Farhan Akhtar', 'Rohit Shetty', 'Mira Rajput'
  ];
  const statuses: SubsidyStatus[] = [
    'Disbursed', 'Approved', 'Under Review', 'Submitted', 'Pending', 'Rejected'
  ];
  const status = statuses[i % statuses.length];
  const capacity = 3 + (i % 6);
  // PM Surya Ghar subsidy rules: 1kW: 30k, 2kW: 60k, 3kW+: 78k max residential
  const subsidyAmount = capacity === 1 ? 30000 : capacity === 2 ? 60000 : 78000;

  let disbursementStatus: SubsidyApplication['disbursementStatus'] = 'Pending Verification';
  let disbursedAmount = 0;
  if (status === 'Disbursed') {
    disbursementStatus = 'Transferred';
    disbursedAmount = subsidyAmount;
  } else if (status === 'Approved') {
    disbursementStatus = 'Sanctioned';
  } else if (status === 'Rejected') {
    disbursementStatus = 'Rejected';
  }

  const missingDocs = status === 'Pending' ? ['Signed Joint Inspection Report (JIR)'] : status === 'Rejected' ? ['Bank account cancelled cheque with clear IFSC'] : [];

  return {
    id: `sub-${String(num).padStart(3, '0')}`,
    projectId: projectId,
    customerName: names[i % names.length],
    consumerNumber: `DISCOM-${770000 + i * 143}`,
    nationalPortalRef: `SURYA-MH-2026-${String(8800 + num).padStart(5, '0')}`,
    schemeName: 'PM Surya Ghar: Muft Bijli Yojana',
    systemCapacityKW: capacity,
    eligibleSubsidyAmountINR: subsidyAmount,
    submissionDate: `2026-10-${String(2 + (i % 15)).padStart(2, '0')}`,
    status: status,
    checklist: [
      { id: 'sub-c1', name: 'National Portal Registration Reference', isAvailable: true },
      { id: 'sub-c2', name: 'DISCOM Net Meter Installation Certificate', isAvailable: status !== 'Pending' },
      { id: 'sub-c3', name: 'Vendor Commissioning Agreement Uploaded', isAvailable: true },
      { id: 'sub-c4', name: 'Bank Details Verified with Aadhaar NPCI Link', isAvailable: status !== 'Rejected' },
    ],
    missingDocuments: missingDocs,
    disbursementStatus: disbursementStatus,
    disbursedAmountINR: disbursedAmount,
    disbursementDate: status === 'Disbursed' ? `2026-10-${String(18 + (i % 6)).padStart(2, '0')}` : undefined,
    bankAccountLast4: `9${String(100 + i).padStart(3, '0')}`,
    discomApprovalDate: `2026-10-${String(10 + (i % 10)).padStart(2, '0')}`,
    lastUpdated: `2026-10-${20 + (i % 4)}`,
  };
});
