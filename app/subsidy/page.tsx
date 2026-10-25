'use client';

import React, { useState, useMemo } from 'react';
import { Download, Search, Award, CheckCircle2, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SubsidyDetailModal } from '@/components/modules/subsidy/SubsidyDetailModal';
import { subsidyService } from '@/lib/services/subsidyService';
import { useToast } from '@/components/providers/ToastProvider';
import { SubsidyApplication, SubsidyStatus } from '@/types/subsidy';

export default function SubsidyPage() {
  const [subsidies, setSubsidies] = useState<SubsidyApplication[]>(() => subsidyService.getSubsidies());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SubsidyApplication | null>(null);

  const { success } = useToast();

  const totalDisbursed = useMemo(() => subsidies.reduce((acc, s) => acc + s.disbursedAmountINR, 0), [subsidies]);
  const approvedCount = useMemo(() => subsidies.filter((s) => s.status === 'Approved' || s.status === 'Disbursed').length, [subsidies]);

  const filteredSubsidies = useMemo(() => {
    return subsidies.filter((s) => {
      const matchSearch = s.customerName.toLowerCase().includes(search.toLowerCase()) || s.nationalPortalRef.toLowerCase().includes(search.toLowerCase()) || s.projectId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [subsidies, search, statusFilter]);

  const handleUpdateStatus = (id: string, status: SubsidyStatus) => {
    const updated = subsidyService.updateStatus(id, status);
    setSubsidies(subsidyService.getSubsidies());
    if (updated && selectedSub?.id === id) setSelectedSub({ ...updated });
    success(`Claim status updated to ${status}.`);
  };

  return (
    <DashboardLayout requiredDepartment="subsidy">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">PM Surya Ghar: Muft Bijli Yojana</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">National Portal Subsidy Claims</h1>
          </div>
          <Button size="sm" variant="outline" onClick={() => subsidyService.exportToCSV(filteredSubsidies)}>
            <Download className="w-4 h-4 mr-1.5" /> Export Claims CSV
          </Button>
        </div>

        {/* 3 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase">Total Claims Processed</span>
            <div className="text-2xl font-bold font-serif text-[var(--text-main)] mt-1">{subsidies.length} Applications</div>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-emerald-600 font-semibold uppercase">Disbursed to Consumers</span>
            <div className="text-2xl font-bold font-serif text-emerald-700 dark:text-emerald-400 mt-1">₹{(totalDisbursed / 100000).toFixed(1)} Lakhs</div>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-[var(--gold)] font-semibold uppercase">Sanctioned & Approved</span>
            <div className="text-2xl font-bold font-serif text-[var(--text-main)] mt-1">{approvedCount} Sanctioned</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            <input type="text" placeholder="Search customer, portal ref or Project ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] cursor-pointer">
            <option value="ALL">All Claim Statuses</option>
            {['Pending', 'Submitted', 'Under Review', 'Approved', 'Disbursed', 'Rejected'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Card>

        {/* Claims Table */}
        <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-[var(--surface-raised)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 font-semibold">Portal Ref No</th>
                <th className="p-3.5 font-semibold">Project & Customer</th>
                <th className="p-3.5 font-semibold">Capacity</th>
                <th className="p-3.5 font-semibold">Eligible (INR)</th>
                <th className="p-3.5 font-semibold">Disbursement</th>
                <th className="p-3.5 font-semibold">Claim Status</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredSubsidies.map((s) => (
                <tr key={s.id} className="hover:bg-[var(--surface-raised)]/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-sm text-[var(--primary)]">{s.nationalPortalRef}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Subm: {s.submissionDate}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-sm text-[var(--text-main)]">{s.customerName}</div>
                    <div className="text-[10px] font-mono text-[var(--gold)]">{s.projectId} • {s.consumerNumber}</div>
                  </td>
                  <td className="p-3.5 font-mono font-bold">{s.systemCapacityKW} kW</td>
                  <td className="p-3.5 font-mono font-bold text-sm text-[var(--primary)]">₹{s.eligibleSubsidyAmountINR.toLocaleString('en-IN')}</td>
                  <td className="p-3.5">
                    <span className="font-semibold">{s.disbursementStatus}</span>
                    {s.disbursedAmountINR > 0 && <div className="text-[10px] text-emerald-600 font-mono">₹{s.disbursedAmountINR.toLocaleString('en-IN')} Transferred</div>}
                  </td>
                  <td className="p-3.5">
                    <Badge variant={s.status === 'Disbursed' ? 'success' : s.status === 'Approved' ? 'gold' : s.status === 'Rejected' ? 'danger' : 'info'}>{s.status}</Badge>
                    {s.missingDocuments.length > 0 && <span className="block text-[10px] text-rose-600 font-semibold mt-1">1 document missing</span>}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <Button size="sm" variant="outline" onClick={() => { setSelectedSub(s); setModalOpen(true); }}>
                      <Award className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View Claim
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SubsidyDetailModal isOpen={modalOpen} onClose={() => setModalOpen(false)} application={selectedSub} onUpdateStatus={handleUpdateStatus} />
    </DashboardLayout>
  );
}
