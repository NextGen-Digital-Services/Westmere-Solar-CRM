'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Download, Search, FileCheck, FolderOpen, Edit2, AlertTriangle, Layers } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProjectTimeline } from '@/components/ui/ProjectTimeline';
import { ProjectModal } from '@/components/modules/registration/ProjectModal';
import { KYCDocumentViewerModal } from '@/components/modules/registration/KYCDocumentViewerModal';
import { registrationService } from '@/lib/services/registrationService';
import { authService } from '@/lib/services/authService';
import { useToast } from '@/components/providers/ToastProvider';
import { RegistrationProject, RegistrationStatus, DocumentType } from '@/types/registration';

export default function RegistrationPage() {
  const [projects, setProjects] = useState<RegistrationProject[]>(() => registrationService.getProjects());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<RegistrationProject | null>(null);

  const [docModalOpen, setDocModalOpen] = useState(false);
  const [activeProjectForDocs, setActiveProjectForDocs] = useState<RegistrationProject | null>(null);

  const { success } = useToast();
  const regUsers = useMemo(() => authService.getUsers().filter((u) => u.department === 'registration'), []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = p.customerName.toLowerCase().includes(search.toLowerCase()) || p.projectId.toLowerCase().includes(search.toLowerCase()) || p.consumerNumber.includes(search);
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [projects, search, statusFilter]);

  const handleSaveProject = (data: Partial<RegistrationProject>) => {
    registrationService.saveProject(data as any);
    setProjects(registrationService.getProjects());
    success('Project dossier successfully recorded.');
  };

  const handleUploadDoc = (projectId: string, type: DocumentType, fileName: string) => {
    registrationService.uploadDocument(projectId, { type, fileName, fileSize: '1.8 MB', status: 'Pending Review' });
    const updated = registrationService.getProjects();
    setProjects(updated);
    setActiveProjectForDocs(updated.find((p) => p.id === projectId) || null);
    success(`Uploaded ${type} to project.`);
  };

  const handleVerifyDoc = (projectId: string, docId: string, status: 'Verified' | 'Rejected', reason?: string) => {
    registrationService.verifyDocument(projectId, docId, status, reason);
    const updated = registrationService.getProjects();
    setProjects(updated);
    setActiveProjectForDocs(updated.find((p) => p.id === projectId) || null);
    success(`Document marked as ${status}.`);
  };

  return (
    <DashboardLayout requiredDepartment="registration">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">DISCOM & Regulatory Sanctions</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">Project Registration & KYC Dossiers</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => registrationService.exportToCSV(filteredProjects)}>
              <Download className="w-4 h-4 mr-1.5" /> Export CSV
            </Button>
            <Button size="sm" variant="primary" onClick={() => { setEditingProject(null); setProjectModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-1.5" /> Register New Project
            </Button>
          </div>
        </div>

        {/* Project Lifecycle Visual Banner */}
        <ProjectTimeline projectId={filteredProjects[0]?.projectId || 'SOL-2026-0001'} customerName={filteredProjects[0]?.customerName} />

        {/* Filter bar */}
        <Card className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            <input type="text" placeholder="Search by Project ID, customer name, consumer no..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] cursor-pointer">
            <option value="ALL">All Application Statuses</option>
            {['Pending', 'Submitted', 'Approved', 'Rejected'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Card>

        {/* Projects Table */}
        <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-[var(--surface-raised)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 font-semibold">Project ID</th>
                <th className="p-3.5 font-semibold">Customer & Site</th>
                <th className="p-3.5 font-semibold">DISCOM / Consumer</th>
                <th className="p-3.5 font-semibold">Capacity</th>
                <th className="p-3.5 font-semibold">KYC Status</th>
                <th className="p-3.5 font-semibold">Assigned Rep</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--surface-raised)]/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-sm text-[var(--primary)]">{p.projectId}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-sm text-[var(--text-main)]">{p.customerName}</div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate max-w-xs">{p.siteAddress}, {p.city}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium">{p.discomName}</div>
                    <div className="text-[10px] font-mono text-[var(--gold)]">{p.consumerNumber}</div>
                  </td>
                  <td className="p-3.5 font-mono font-bold">{p.proposedCapacityKW} kW</td>
                  <td className="p-3.5">
                    <Badge variant={p.status === 'Approved' ? 'success' : p.status === 'Rejected' ? 'danger' : 'warning'}>{p.status}</Badge>
                    {p.missingDocumentsCount > 0 && (
                      <span className="block text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {p.missingDocumentsCount} docs missing
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 font-medium">{p.assignedEmployeeName}</td>
                  <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <Button size="sm" variant="outline" onClick={() => { setActiveProjectForDocs(p); setDocModalOpen(true); }}>
                      <FileCheck className="w-3.5 h-3.5 mr-1 text-[var(--primary)]" /> Documents ({p.documents.length})
                    </Button>
                    <button onClick={() => { setEditingProject(p); setProjectModalOpen(true); }} className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--surface-raised)]">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProjectModal isOpen={projectModalOpen} onClose={() => setProjectModalOpen(false)} onSave={handleSaveProject} project={editingProject} employees={regUsers} />
      <KYCDocumentViewerModal isOpen={docModalOpen} onClose={() => setDocModalOpen(false)} project={activeProjectForDocs} onUploadDoc={handleUploadDoc} onVerifyDoc={handleVerifyDoc} />
    </DashboardLayout>
  );
}
