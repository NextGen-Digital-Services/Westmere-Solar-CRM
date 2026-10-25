'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Download, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InstallationModal } from '@/components/modules/installation/InstallationModal';
import { InstallationDetailModal } from '@/components/modules/installation/InstallationDetailModal';
import { InstallationTable } from '@/components/modules/installation/InstallationTable';
import { PrintableReportModal } from '@/components/ui/PrintableReportModal';
import { installationService } from '@/lib/services/installationService';
import { useToast } from '@/components/providers/ToastProvider';
import { InstallationTask } from '@/types/installation';

export default function InstallationPage() {
  const [tasks, setTasks] = useState<InstallationTask[]>(() => installationService.getTasks());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<InstallationTask | null>(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<InstallationTask | null>(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTask, setReportTask] = useState<InstallationTask | null>(null);

  const { success } = useToast();

  const delayedCount = useMemo(() => tasks.filter((t) => t.isDelayed).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((t) => t.status === 'Commissioned').length, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch = t.customerName.toLowerCase().includes(search.toLowerCase()) || t.projectId.toLowerCase().includes(search.toLowerCase()) || t.leadTechnician.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || (statusFilter === 'Delayed' ? t.isDelayed : t.status === statusFilter);
      return matchSearch && matchStatus;
    });
  }, [tasks, search, statusFilter]);

  const handleSaveTask = (data: Partial<InstallationTask>) => {
    installationService.saveTask(data as any);
    setTasks(installationService.getTasks());
    success('Installation job schedule updated.');
  };

  const handleToggleChecklist = (taskId: string, checkId: string) => {
    const updated = installationService.toggleChecklistItem(taskId, checkId);
    setTasks(installationService.getTasks());
    if (updated && activeTask?.id === taskId) setActiveTask({ ...updated });
    success('Checklist milestone updated.');
  };

  const handleAddPhoto = (taskId: string, photo: { title: string; url: string }) => {
    const updated = installationService.addPhoto(taskId, photo);
    setTasks(installationService.getTasks());
    if (updated && activeTask?.id === taskId) setActiveTask({ ...updated });
    success('Site completion photo attached.');
  };

  return (
    <DashboardLayout requiredDepartment="installation">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">On-Site Execution & Engineering</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">Installation Deployment & Delay Tracking</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => installationService.exportToCSV(filteredTasks)}>
              <Download className="w-4 h-4 mr-1.5" /> Export Schedule CSV
            </Button>
            <Button size="sm" variant="primary" onClick={() => { setEditingTask(null); setModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-1.5" /> Schedule Site Job
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase">Total Scheduled Sites</span>
            <div className="text-2xl font-bold font-serif text-[var(--text-main)] mt-1">{tasks.length} Jobs Active</div>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-emerald-600 font-semibold uppercase">Fully Commissioned</span>
            <div className="text-2xl font-bold font-serif text-emerald-700 dark:text-emerald-400 mt-1">{completedCount} Handed Over</div>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-rose-600 font-semibold uppercase">Weather / Site Delays</span>
            <div className="text-2xl font-bold font-serif text-rose-600 mt-1">{delayedCount} Sites Flagged</div>
          </Card>
        </div>

        <Card className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            <input type="text" placeholder="Search by Project ID, customer or technician..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] cursor-pointer">
            <option value="ALL">All Statuses</option>
            <option value="Delayed">Delayed Sites Only</option>
            <option value="Commissioned">Commissioned</option>
            <option value="Panels Mounted">Panels Mounted</option>
            <option value="Scheduled">Scheduled</option>
          </select>
        </Card>

        <InstallationTable
          tasks={filteredTasks}
          onOpenDetail={(t) => { setActiveTask(t); setDetailModalOpen(true); }}
          onEditTask={(t) => { setEditingTask(t); setModalOpen(true); }}
        />
      </div>

      <InstallationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveTask} task={editingTask} />
      <InstallationDetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} task={activeTask} onToggleChecklist={handleToggleChecklist} onAddPhoto={handleAddPhoto} onOpenReport={(t) => { setReportTask(t); setReportModalOpen(true); }} />
      <PrintableReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Solar Rooftop Installation Completion Certificate"
        subtitle="Workmanship, Tilt Angle & Torque Tightening Sign-Off"
        projectId={reportTask?.projectId || ''}
        customerName={reportTask?.customerName || ''}
        dataItems={[
          { label: 'Plant Capacity', value: `${reportTask?.systemCapacityKW} kW Peak Rooftop Solar` },
          { label: 'Date', value: reportTask?.completionDate || reportTask?.scheduledDate || '' },
          { label: 'Lead Site Engineer', value: reportTask?.leadTechnician || '' },
          { label: 'Workflow Execution Status', value: reportTask?.status || '' },
        ]}
      />
    </DashboardLayout>
  );
}
