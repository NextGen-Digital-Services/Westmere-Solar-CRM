import { RegistrationProject, KYCDocument } from '@/types/registration';

const sampleKYCDocs: KYCDocument[] = [
  {
    id: 'doc-1',
    type: 'Electricity Bill',
    fileName: 'MSEDCL_Bill_Sept2026.pdf',
    fileSize: '1.4 MB',
    uploadDate: '2026-10-12',
    status: 'Verified',
  },
  {
    id: 'doc-2',
    type: 'Aadhaar Card',
    fileName: 'Aadhaar_Customer_Masked.pdf',
    fileSize: '850 KB',
    uploadDate: '2026-10-12',
    status: 'Verified',
  },
  {
    id: 'doc-3',
    type: 'Property Tax Receipt',
    fileName: 'PMC_Tax_Challan_2026.pdf',
    fileSize: '2.1 MB',
    uploadDate: '2026-10-13',
    status: 'Verified',
  },
  {
    id: 'doc-4',
    type: 'Rooftop Photo',
    fileName: 'Rooftop_SouthFacing_Overview.jpg',
    fileSize: '3.6 MB',
    uploadDate: '2026-10-14',
    status: 'Verified',
  },
];

export const INITIAL_PROJECTS: RegistrationProject[] = Array.from({ length: 25 }).map((_, i) => {
  const num = i + 1;
  const projectCode = `SOL-2026-${String(num).padStart(4, '0')}`;
  const names = [
    'Sunita Deshmukh', 'Praveen Somani', 'Kishore Jhaveri', 'Mahesh Bhatt',
    'Ritu Aggarwal', 'Venkatesh Prasad', 'Manohar Lal', 'Sanjay Bhandari',
    'Geeta Subramaniam', 'Hemant Patil', 'Swati Deshpande', 'Kiran Mazumdar',
    'Tarun Tahiliani', 'Nalini Chawla', 'Chetan Bhagat', 'Sudha Murthy',
    'Arun Jaitley', 'Farhan Akhtar', 'Rohit Shetty', 'Mira Rajput',
    'Gautam Singhal', 'Pallavi Shinde', 'Nitin Gadkari', 'Anand Mahindra',
    'Azim Premji'
  ];
  const cities = ['Pune', 'Mumbai', 'Ahmedabad', 'Bengaluru', 'Jaipur', 'Nashik', 'Surat', 'Nagpur'];
  const discoms = ['MSEDCL', 'Tata Power Mumbai', 'Adani Electricity', 'Torrent Power', 'BESCOM', 'JVVNL'];
  const statuses: RegistrationProject['status'][] = ['Approved', 'Submitted', 'Pending', 'Rejected'];

  const city = cities[i % cities.length];
  const discom = discoms[i % discoms.length];
  const status = statuses[i % statuses.length];
  const capacity = 3 + (i % 6);
  const repId = i % 2 === 0 ? 'user-reg-emp1' : 'user-reg-emp2';
  const repName = i % 2 === 0 ? 'Vikram Singh' : 'Ananya Joshi';

  const docs = [...sampleKYCDocs];
  let missing = 0;
  if (status === 'Pending') {
    docs.pop(); // Missing roof photo
    missing = 1;
  } else if (status === 'Rejected') {
    docs[0] = {
      ...docs[0],
      status: 'Rejected',
      rejectionReason: 'Electricity bill name does not match property owner KYC.',
    };
    missing = 1;
  }

  return {
    id: `proj-${String(num).padStart(3, '0')}`,
    projectId: projectCode,
    leadId: `lead-${String(num).padStart(3, '0')}`,
    customerName: names[i % names.length],
    phone: `+91 ${98220 + i} ${55000 + i}`,
    email: `${names[i % names.length].toLowerCase().replace(/\s+/g, '.')}@example.com`,
    siteAddress: `Villa ${12 + i}, Sunshine Enclave, Sector ${1 + (i % 8)}`,
    city: city,
    state: city === 'Ahmedabad' || city === 'Surat' ? 'Gujarat' : city === 'Bengaluru' ? 'Karnataka' : city === 'Jaipur' ? 'Rajasthan' : 'Maharashtra',
    pincode: `4110${String(10 + i).padStart(2, '0')}`,
    consumerNumber: `DISCOM-${770000 + i * 143}`,
    discomName: discom,
    sanctionedLoadKW: capacity + 1,
    proposedCapacityKW: capacity,
    status: status,
    documents: docs,
    assignedEmployeeId: repId,
    assignedEmployeeName: repName,
    managerId: 'user-reg-mgr',
    createdAt: `2026-10-0${1 + (i % 9)}`,
    updatedAt: `2026-10-${14 + (i % 12)}`,
    missingDocumentsCount: missing,
  };
});
