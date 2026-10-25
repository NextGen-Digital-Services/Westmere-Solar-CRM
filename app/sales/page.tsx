'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Download, LayoutList, Columns, Search, Filter } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LeadKanbanBoard } from '@/components/modules/sales/LeadKanbanBoard';
import { LeadTableView } from '@/components/modules/sales/LeadTableView';
import { LeadModal } from '@/components/modules/sales/LeadModal';
import { QuotationModal } from '@/components/modules/sales/QuotationModal';
import { PrintableQuotationModal } from '@/components/ui/PrintableQuotationModal';
import { SalesLeaderboard } from '@/components/modules/sales/SalesLeaderboard';
import { salesService } from '@/lib/services/salesService';
import { authService } from '@/lib/services/authService';
import { useToast } from '@/components/providers/ToastProvider';
import { Lead, LeadStatus, Quotation } from '@/types/sales';

export default function SalesPage() {
  const [leads, setLeads] = useState<Lead[]>(() => salesService.getLeads());
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteLead, setQuoteLead] = useState<Lead | null>(null);

  const [previewQuote, setPreviewQuote] = useState<Quotation | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { success } = useToast();
  const salesUsers = useMemo(() => authService.getUsers().filter((u) => u.department === 'sales'), []);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch = l.customerName.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search) || l.city.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [leads, search, statusFilter]);

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    salesService.updateLeadStatus(leadId, status);
    setLeads(salesService.getLeads());
    success(`Lead stage advanced to ${status}.`);
  };

  const handleSaveLead = (data: Partial<Lead>) => {
    salesService.saveLead(data as any);
    setLeads(salesService.getLeads());
    success('Lead inquiry updated successfully.');
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      salesService.deleteLead(id);
      setLeads(salesService.getLeads());
      success('Lead record removed.');
    }
  };

  const handleOpenQuote = (l: Lead) => {
    if (l.quotationId) {
      const q = salesService.getQuotationById(l.quotationId);
      if (q) {
        setPreviewQuote(q);
        setPreviewOpen(true);
        return;
      }
    }
    setQuoteLead(l);
    setQuoteModalOpen(true);
  };

  const handleSaveQuote = (q: Partial<Quotation>) => {
    const saved = salesService.saveQuotation(q as any);
    setLeads(salesService.getLeads());
    setPreviewQuote(saved);
    setPreviewOpen(true);
    success(`Generated Proposal ${saved.quotationNumber}.`);
  };

  return (
    <DashboardLayout requiredDepartment="sales">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">Sales & Business Development</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">Customer Inquiries & Proposals</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => salesService.exportToCSV(filteredLeads)}>
              <Download className="w-4 h-4 mr-1.5" /> Export CSV
            </Button>
            <Button size="sm" variant="primary" onClick={() => { setSelectedLead(null); setLeadModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-1.5" /> New Solar Inquiry
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <Card className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2 w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
              <input type="text" placeholder="Search customer, phone or city..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] cursor-pointer">
              <option value="ALL">All Stages</option>
              {['New', 'Contacted', 'Interested', 'Converted', 'Lost'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex border border-[var(--border-color)] rounded-xl p-0.5 bg-[var(--surface-raised)]">
            <button onClick={() => setViewMode('kanban')} className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${viewMode === 'kanban' ? 'bg-[var(--surface)] font-bold text-[var(--primary)] shadow-xs' : 'text-[var(--text-muted)]'}`}>
              <Columns className="w-3.5 h-3.5" /> Kanban
            </button>
            <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${viewMode === 'table' ? 'bg-[var(--surface)] font-bold text-[var(--primary)] shadow-xs' : 'text-[var(--text-muted)]'}`}>
              <LayoutList className="w-3.5 h-3.5" /> Table
            </button>
          </div>
        </Card>

        {viewMode === 'kanban' ? (
          <LeadKanbanBoard leads={filteredLeads} onStatusChange={handleStatusChange} onSelectLead={(l) => { setSelectedLead(l); setLeadModalOpen(true); }} />
        ) : (
          <LeadTableView leads={filteredLeads} onEdit={(l) => { setSelectedLead(l); setLeadModalOpen(true); }} onDelete={handleDeleteLead} onOpenQuote={handleOpenQuote} />
        )}

        <SalesLeaderboard leads={leads} />
      </div>

      <LeadModal isOpen={leadModalOpen} onClose={() => setLeadModalOpen(false)} onSave={handleSaveLead} lead={selectedLead} employees={salesUsers} />
      <QuotationModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} onSave={handleSaveQuote} leadId={quoteLead?.id || ''} leadCapacity={quoteLead?.capacityKW || 5} />
      <PrintableQuotationModal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} quotation={previewQuote} customerName={quoteLead?.customerName} />
    </DashboardLayout>
  );
}
