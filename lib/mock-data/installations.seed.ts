import { InstallationTask, InstallationStatus } from '@/types/installation';

const defaultChecklist = [
  { id: 'chk-1', label: 'Civil foundation / roof puncture seal check', completed: true },
  { id: 'chk-2', label: 'Mounting structure tilt angle aligned to 18° South', completed: true },
  { id: 'chk-3', label: 'Module torque tightening as per manufacturer spec', completed: true },
  { id: 'chk-4', label: 'DC cable routing inside UV-resistant conduits', completed: true },
  { id: 'chk-5', label: 'Inverter wall mounting with adequate ventilation clearance', completed: true },
  { id: 'chk-6', label: 'Site cleanup and debris removal', completed: true },
];

export const INITIAL_INSTALLATIONS: InstallationTask[] = Array.from({ length: 20 }).map((_, i) => {
  const num = i + 1;
  const projectId = `SOL-2026-${String(num).padStart(4, '0')}`;
  const names = [
    'Sunita Deshmukh', 'Praveen Somani', 'Kishore Jhaveri', 'Mahesh Bhatt',
    'Ritu Aggarwal', 'Venkatesh Prasad', 'Manohar Lal', 'Sanjay Bhandari',
    'Geeta Subramaniam', 'Hemant Patil', 'Swati Deshpande', 'Kiran Mazumdar',
    'Tarun Tahiliani', 'Nalini Chawla', 'Chetan Bhagat', 'Sudha Murthy',
    'Arun Jaitley', 'Farhan Akhtar', 'Rohit Shetty', 'Mira Rajput'
  ];
  const statuses: InstallationStatus[] = [
    'Commissioned', 'Panels Mounted', 'Structure Assembled', 'Delayed', 'Scheduled', 'Team Dispatched'
  ];
  const technicians = ['Manoj Tiwari', 'Sandeep Kulkarni', 'Karthik Nair'];
  const delayReasons = [
    'Heavy unseasonal rain preventing roof access',
    'Customer requested postponement due to family event',
    'MSEDCL grid shutdown required for overhead line safety',
    'Roof waterproofing work in progress by customer civil contractor'
  ];

  const status = statuses[i % statuses.length];
  const isDelayed = status === 'Delayed' || i % 6 === 0;
  const tech = technicians[i % technicians.length];

  return {
    id: `inst-${String(num).padStart(3, '0')}`,
    projectId: projectId,
    customerName: names[i % names.length],
    siteAddress: `Plot ${20 + i}, Sector ${1 + (i % 5)}, Surya Vihar`,
    systemCapacityKW: 3 + (i % 6),
    scheduledDate: `2026-10-${String(10 + (i % 18)).padStart(2, '0')}`,
    leadTechnician: tech,
    teamMembers: ['S. Rathore', 'A. Gokhale', 'M. Khan'],
    status: isDelayed ? 'Delayed' : status,
    isDelayed: isDelayed,
    delayDays: isDelayed ? 2 + (i % 5) : undefined,
    delayReason: isDelayed ? delayReasons[i % delayReasons.length] : undefined,
    checklist: defaultChecklist.map((item, idx) => ({
      ...item,
      completed: status === 'Commissioned' || (status === 'Panels Mounted' && idx < 4),
    })),
    photos: [
      {
        id: `photo-${num}-1`,
        title: 'Roof Structure Completed',
        url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400&auto=format&fit=crop&q=60',
        uploadedAt: '2026-10-18',
      },
      {
        id: `photo-${num}-2`,
        title: 'Panels Array Alignment',
        url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=400&auto=format&fit=crop&q=60',
        uploadedAt: '2026-10-19',
      },
    ],
    completionDate: status === 'Commissioned' ? `2026-10-${String(15 + (i % 8)).padStart(2, '0')}` : undefined,
    supervisorNotes: 'High quality installation. Verified all module clamps and grounding points.',
    updatedAt: `2026-10-${20 + (i % 5)}`,
  };
});
