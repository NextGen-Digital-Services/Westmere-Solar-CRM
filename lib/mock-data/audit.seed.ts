import { ActivityLog } from '@/types/audit';

const userLookup = [
  { id: 'user-superadmin', name: 'Alessandro V.', role: 'Super Admin', dept: 'system' as const },
  { id: 'user-sales-mgr', name: 'Rahul Sharma', role: 'Sales Manager', dept: 'sales' as const },
  { id: 'user-sales-emp1', name: 'Amit Verma', role: 'Sales Rep', dept: 'sales' as const },
  { id: 'user-reg-mgr', name: 'Neha Patel', role: 'Registration Manager', dept: 'registration' as const },
  { id: 'user-fin-mgr', name: 'Suresh Iyer', role: 'Finance Manager', dept: 'finance' as const },
  { id: 'user-inv-mgr', name: 'Rajesh Gupta', role: 'Inventory Manager', dept: 'inventory' as const },
  { id: 'user-ins-mgr', name: 'Karthik Nair', role: 'Installation Manager', dept: 'installation' as const },
  { id: 'user-ele-mgr', name: 'Arvind Swamy', role: 'Electrical Manager', dept: 'electrical' as const },
  { id: 'user-sub-mgr', name: 'Pooja Verma', role: 'Subsidy Manager', dept: 'subsidy' as const },
];

export const INITIAL_AUDIT_LOGS: ActivityLog[] = Array.from({ length: 110 }).map((_, i) => {
  const num = i + 1;
  const user = userLookup[i % userLookup.length];
  const day = String(1 + (i % 24)).padStart(2, '0');
  const hour = String(9 + (i % 9)).padStart(2, '0');
  const minute = String((i * 7) % 60).padStart(2, '0');
  const timestamp = `2026-10-${day} ${hour}:${minute}`;

  const actions: ActivityLog['action'][] = ['CREATE', 'UPDATE', 'APPROVE', 'STATUS_CHANGE', 'UPDATE', 'APPROVE'];
  const action = actions[i % actions.length];

  let summary = '';
  let before = '';
  let after = '';
  let recordId = `REC-${1000 + num}`;

  if (user.dept === 'sales') {
    recordId = `lead-${String((i % 40) + 1).padStart(3, '0')}`;
    summary = `Updated lead follow-up date and status`;
    before = 'Status: Contacted';
    after = 'Status: Interested';
  } else if (user.dept === 'registration') {
    recordId = `proj-${String((i % 25) + 1).padStart(3, '0')}`;
    summary = `Verified KYC electricity bill document`;
    before = 'Document: Pending Review';
    after = 'Document: Verified';
  } else if (user.dept === 'finance') {
    recordId = `pay-${String((i % 30) + 1).padStart(3, '0')}`;
    summary = `Recorded customer advance payment receipt`;
    before = 'Outstanding: ₹2,10,000';
    after = 'Outstanding: ₹1,68,000';
  } else if (user.dept === 'inventory') {
    recordId = `stock-0${(i % 10) + 1}`;
    summary = `Issued material allocation for site installation`;
    before = 'Available: 80 Nos';
    after = 'Available: 70 Nos';
  } else if (user.dept === 'installation') {
    recordId = `inst-${String((i % 20) + 1).padStart(3, '0')}`;
    summary = `Marked solar panels mounting checklist item as completed`;
    before = 'Checklist: 3/6 done';
    after = 'Checklist: 4/6 done';
  } else if (user.dept === 'electrical') {
    recordId = `elec-${String((i % 20) + 1).padStart(3, '0')}`;
    summary = `Recorded digital earth resistance measurement`;
    before = 'Inspection: In Progress';
    after = 'Measured: 2.8 Ohms (PASS)';
  } else if (user.dept === 'subsidy') {
    recordId = `sub-${String((i % 20) + 1).padStart(3, '0')}`;
    summary = `Updated PM Surya Ghar subsidy application status`;
    before = 'Status: Submitted';
    after = 'Status: Under Review';
  } else {
    recordId = `USR-${100 + num}`;
    summary = `Updated employee role permission matrix`;
    before = 'Role: Employee (Default)';
    after = 'Role: Employee (Approved custom)';
  }

  return {
    id: `log-${String(num).padStart(4, '0')}`,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    department: user.dept,
    action: action,
    module: user.dept.toUpperCase(),
    recordId: recordId,
    summary: summary,
    beforeValue: before,
    afterValue: after,
    timestamp: timestamp,
  };
});
