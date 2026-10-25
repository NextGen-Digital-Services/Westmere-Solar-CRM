import { ElectricalInspection, InspectionStatus } from '@/types/electrical';

const defaultSafetyChecklist = [
  { id: 'ec-1', category: 'Earthing' as const, description: 'Chemical earth pit resistance measured under 5.0 Ohms', status: 'Pass' as const },
  { id: 'ec-2', category: 'Safety' as const, description: 'DC Isolation switch operational and clearly labelled', status: 'Pass' as const },
  { id: 'ec-3', category: 'Inverter' as const, description: 'Inverter polarity and DC voltage within MPPT window', status: 'Pass' as const },
  { id: 'ec-4', category: 'Wiring' as const, description: 'Type-2 AC and DC Surge Protection Devices (SPD) healthy', status: 'Pass' as const },
  { id: 'ec-5', category: 'Grid' as const, description: 'Anti-islanding test: Inverter trips within 2 seconds of AC disconnect', status: 'Pass' as const },
];

export const INITIAL_INSPECTIONS: ElectricalInspection[] = Array.from({ length: 20 }).map((_, i) => {
  const num = i + 1;
  const projectId = `SOL-2026-${String(num).padStart(4, '0')}`;
  const names = [
    'Sunita Deshmukh', 'Praveen Somani', 'Kishore Jhaveri', 'Mahesh Bhatt',
    'Ritu Aggarwal', 'Venkatesh Prasad', 'Manohar Lal', 'Sanjay Bhandari',
    'Geeta Subramaniam', 'Hemant Patil', 'Swati Deshpande', 'Kiran Mazumdar',
    'Tarun Tahiliani', 'Nalini Chawla', 'Chetan Bhagat', 'Sudha Murthy',
    'Arun Jaitley', 'Farhan Akhtar', 'Rohit Shetty', 'Mira Rajput'
  ];
  const statuses: InspectionStatus[] = ['Passed', 'Passed', 'Pending', 'Failed', 'Re-inspected'];
  const inspectors = ['Rakesh Patil', 'Nitin Deshmukh'];
  const status = statuses[i % statuses.length];
  const inspector = inspectors[i % inspectors.length];

  const defects = status === 'Failed' ? [
    {
      id: `def-${num}-1`,
      description: 'Earth pit resistance high (7.8 Ohms), salt-bentonite recharge needed',
      severity: 'Critical' as const,
      correctiveActionRequired: 'Re-condition earth pit and test again with digital Earth Megger',
      resolved: false,
    }
  ] : [];

  return {
    id: `elec-${String(num).padStart(3, '0')}`,
    projectId: projectId,
    customerName: names[i % names.length],
    capacityKW: 3 + (i % 6),
    inspectionDate: `2026-10-${String(12 + (i % 12)).padStart(2, '0')}`,
    inspectorName: inspector,
    inspectorId: i % 2 === 0 ? 'user-ele-emp1' : 'user-ele-emp2',
    earthingResistanceOhms: status === 'Failed' ? 7.8 : 2.4 + (i % 20) * 0.1,
    status: status,
    checklist: defaultSafetyChecklist.map((item, idx) => ({
      ...item,
      status: status === 'Failed' && idx === 0 ? ('Fail' as const) : status === 'Pending' && idx > 2 ? ('Pending' as const) : ('Pass' as const),
    })),
    defects: defects,
    managerApproval: {
      isApproved: status === 'Passed' || status === 'Re-inspected',
      approvedBy: (status === 'Passed' || status === 'Re-inspected') ? 'Arvind Swamy' : undefined,
      approvedAt: (status === 'Passed' || status === 'Re-inspected') ? `2026-10-${20 + (i % 4)}` : undefined,
      comments: status === 'Passed' ? 'All electrical parameters meet CEA and DISCOM standards.' : undefined,
    },
    completionCertificateIssued: status === 'Passed',
    notes: 'Inspection performed with certified calibrated digital clamp meter and earth tester.',
  };
});
