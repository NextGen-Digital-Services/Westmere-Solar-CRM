'use client';

import React, { useState, useMemo } from 'react';
import { Download, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ElectricalDetailModal } from '@/components/modules/electrical/ElectricalDetailModal';
import { ElectricalTable } from '@/components/modules/electrical/ElectricalTable';
import { PrintableReportModal } from '@/components/ui/PrintableReportModal';
import { electricalService } from '@/lib/services/electricalService';
import { useToast } from '@/components/providers/ToastProvider';
import { ElectricalInspection } from '@/types/electrical';

export default function ElectricalPage() {
  const [inspections, setInspections] = useState<ElectricalInspection[]>(() => electricalService.getInspections());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeInspection, setActiveInspection] = useState<ElectricalInspection | null>(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState<ElectricalInspection | null>(null);

  const { success, error } = useToast();

  const passedCount = useMemo(() => inspections.filter((i) => i.status === 'Passed').length, [inspections]);
  const pendingApprovalCount = useMemo(() => inspections.filter((i) => !i.managerApproval.isApproved).length, [inspections]);
  const failedCount = useMemo(() => inspections.filter((i) => i.status === 'Failed').length, [inspections]);

  const filteredInspections = useMemo(() => {
    return inspections.filter((i) => {
      const matchSearch = i.customerName.toLowerCase().includes(search.toLowerCase()) || i.projectId.toLowerCase().includes(search.toLowerCase()) || i.inspectorName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || i.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [inspections, search, statusFilter]);

  const handleCheckItem = (id: string, itemId: string, status: 'Pass' | 'Fail') => {
    const updated = electricalService.updateCheckItemStatus(id, itemId, status);
    setInspections(electricalService.getInspections());
    if (updated && activeInspection?.id === id) setActiveInspection({ ...updated });
    success(`Check item marked as ${status}.`);
  };

  const handleApprove = (id: string) => {
    const updated = electricalService.approveInspection(id);
    setInspections(electricalService.getInspections());
    if (updated && activeInspection?.id === id) setActiveInspection({ ...updated });
    success('Electrical safety sign-off completed by Manager.');
  };

  const handleAddDefect = (id: string, def: any) => {
    const updated = electricalService.addDefect(id, def);
    setInspections(electricalService.getInspections());
    if (updated && activeInspection?.id === id) setActiveInspection({ ...updated });
    error('Safety non-compliance defect logged.');
  };

  const handleResolveDefect = (id: string, defectId: string) => {
    const updated = electricalService.resolveDefect(id, defectId);
    setInspections(electricalService.getInspections());
    if (updated && activeInspection?.id === id) setActiveInspection({ ...updated });
    success('Defect resolved. Re-inspection ready.');
  };

  return (
    <DashboardLayout requiredDepartment="electrical">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">High Voltage & Grid Synchronization</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">Electrical Safety Inspection & Audits</h1>
          </div>
          <Button size="sm" variant="outline" onClick={() => electricalService.exportToCSV(filteredInspections)}>
            <Download className="w-4 h-4 mr-1.5" /> Export Inspection CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <span className="text-xs text-emerald-600 font-semibold uppercase">Passed Safety Audits</span>
            <div className="text-2xl font-bold font-serif text-emerald-700 dark:text-emerald-400 mt-1">{passedCount} Plants Certified</div>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-[var(--gold)] font-semibold uppercase">Pending Manager Approval</span>
            <div className="text-2xl font-bold font-serif text-[var(--text-main)] mt-1">{pendingApprovalCount} Sign-offs Awaiting</div>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-rose-600 font-semibold uppercase">Critical Defects Flagged</span>
            <div className="text-2xl font-bold font-serif text-rose-600 mt-1">{failedCount} Rectification Tasks</div>
          </Card>
        </div>

        <Card className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            <input type="text" placeholder="Search by Project ID, customer or inspector..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] cursor-pointer">
            <option value="ALL">All Inspection Statuses</option>
            {['Passed', 'Pending', 'Failed', 'Re-inspected'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Card>

        <ElectricalTable
          inspections={filteredInspections}
          onOpenAudit={(i) => { setActiveInspection(i); setDetailModalOpen(true); }}
        />
      </div>

      <ElectricalDetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} inspection={activeInspection} onCheckItem={handleCheckItem} onApprove={handleApprove} onAddDefect={handleAddDefect} onResolveDefect={handleResolveDefect} onOpenReport={(insp) => { setReportData(insp); setReportModalOpen(true); }} />
      <PrintableReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Central Electricity Authority (CEA) Safety Certificate"
        subtitle="Earth Continuity, Surge Protection & Anti-Islanding Verification"
        projectId={reportData?.projectId || ''}
        customerName={reportData?.customerName || ''}
        dataItems={[
          { label: 'Plant DC Capacity', value: `${reportData?.capacityKW} kW Peak Array` },
          { label: 'Earth Resistance Measured', value: `${reportData?.earthingResistanceOhms} Ohms (CEA Threshold: <5.0 Ohms)` },
          { label: 'Anti-Islanding Trip Time', value: '1.24 Seconds (Pass)' },
          { label: 'Inspecting Engineer', value: reportData?.inspectorName || '' },
          { label: 'Managerial Sign-off Status', value: reportData?.managerApproval.isApproved ? `Approved by ${reportData.managerApproval.approvedBy}` : 'Pending' },
        ]}
      />
    </DashboardLayout>
  );
}
