import { Lead, LeadStatus, Quotation } from '@/types/sales';
import { INITIAL_LEADS, INITIAL_QUOTATIONS } from '@/lib/mock-data/leads.seed';
import { getStoredData, setStoredData } from './storage';
import { auditService } from './auditService';
import { authService } from './authService';

const LEADS_KEY = 'solarcrm_leads';
const QUOTATIONS_KEY = 'solarcrm_quotations';

export const salesService = {
  getLeads: (assignedToId?: string): Lead[] => {
    const leads = getStoredData<Lead[]>(LEADS_KEY, INITIAL_LEADS);
    if (!assignedToId) return leads;
    return leads.filter((l) => l.assignedToId === assignedToId);
  },

  getLeadById: (id: string): Lead | undefined => {
    return salesService.getLeads().find((l) => l.id === id);
  },

  saveLead: (lead: Partial<Lead> & { customerName: string; phone: string }): Lead => {
    const leads = getStoredData<Lead[]>(LEADS_KEY, INITIAL_LEADS);
    const session = authService.getCurrentSession();
    const now = new Date().toISOString().split('T')[0];

    let savedLead: Lead;
    if (lead.id) {
      const idx = leads.findIndex((l) => l.id === lead.id);
      const prev = leads[idx];
      savedLead = { ...prev, ...lead, updatedAt: now } as Lead;
      leads[idx] = savedLead;

      if (session) {
        auditService.log({
          userId: session.user.id,
          userName: session.user.name,
          userRole: session.user.role,
          department: 'sales',
          action: 'UPDATE',
          module: 'SALES',
          recordId: savedLead.id,
          summary: `Updated lead details for ${savedLead.customerName}`,
          beforeValue: `Status: ${prev.status}, KW: ${prev.capacityKW}`,
          afterValue: `Status: ${savedLead.status}, KW: ${savedLead.capacityKW}`,
        });
      }
    } else {
      savedLead = {
        id: `lead-${Date.now()}`,
        customerName: lead.customerName,
        phone: lead.phone,
        email: lead.email || '',
        address: lead.address || '',
        city: lead.city || 'Pune',
        state: lead.state || 'Maharashtra',
        pincode: lead.pincode || '411001',
        capacityKW: lead.capacityKW || 5,
        roofType: lead.roofType || 'Concrete Flat',
        monthlyBillAmount: lead.monthlyBillAmount || 4500,
        source: lead.source || 'Website',
        status: lead.status || 'New',
        assignedToId: lead.assignedToId || session?.user.id || 'user-sales-emp1',
        assignedToName: lead.assignedToName || session?.user.name || 'Amit Verma',
        followUpDate: lead.followUpDate || now,
        notes: lead.notes || '',
        createdAt: now,
        updatedAt: now,
      };
      leads.unshift(savedLead);

      if (session) {
        auditService.log({
          userId: session.user.id,
          userName: session.user.name,
          userRole: session.user.role,
          department: 'sales',
          action: 'CREATE',
          module: 'SALES',
          recordId: savedLead.id,
          summary: `Created new lead inquiry for ${savedLead.customerName} (${savedLead.capacityKW} kW)`,
        });
      }
    }

    setStoredData(LEADS_KEY, leads);
    return savedLead;
  },

  updateLeadStatus: (id: string, status: LeadStatus): Lead | null => {
    const leads = getStoredData<Lead[]>(LEADS_KEY, INITIAL_LEADS);
    const idx = leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;

    const prevStatus = leads[idx].status;
    leads[idx].status = status;
    leads[idx].updatedAt = new Date().toISOString().split('T')[0];
    setStoredData(LEADS_KEY, leads);

    const session = authService.getCurrentSession();
    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: 'sales',
        action: 'STATUS_CHANGE',
        module: 'SALES',
        recordId: id,
        summary: `Changed lead stage for ${leads[idx].customerName}`,
        beforeValue: prevStatus,
        afterValue: status,
      });
    }

    return leads[idx];
  },

  deleteLead: (id: string): boolean => {
    const leads = getStoredData<Lead[]>(LEADS_KEY, INITIAL_LEADS);
    const target = leads.find((l) => l.id === id);
    if (!target) return false;

    const filtered = leads.filter((l) => l.id !== id);
    setStoredData(LEADS_KEY, filtered);

    const session = authService.getCurrentSession();
    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: 'sales',
        action: 'DELETE',
        module: 'SALES',
        recordId: id,
        summary: `Deleted lead ${target.customerName}`,
      });
    }

    return true;
  },

  getQuotations: (): Quotation[] => {
    return getStoredData<Quotation[]>(QUOTATIONS_KEY, INITIAL_QUOTATIONS);
  },

  getQuotationById: (id: string): Quotation | undefined => {
    return salesService.getQuotations().find((q) => q.id === id);
  },

  saveQuotation: (quotation: Partial<Quotation> & { leadId: string }): Quotation => {
    const quotations = getStoredData<Quotation[]>(QUOTATIONS_KEY, INITIAL_QUOTATIONS);
    const now = new Date().toISOString().split('T')[0];

    const subtotal = quotation.subtotal || 200000;
    const discount = quotation.discount || 0;
    const taxable = Math.max(0, subtotal - discount);
    const gstPercent = quotation.gstPercent || 13.8;
    const gstAmount = Math.round((taxable * gstPercent) / 100);
    const grandTotal = taxable + gstAmount;

    let saved: Quotation;
    if (quotation.id) {
      const idx = quotations.findIndex((q) => q.id === quotation.id);
      saved = {
        ...quotations[idx],
        ...quotation,
        subtotal,
        discount,
        gstPercent,
        gstAmount,
        grandTotal,
      } as Quotation;
      quotations[idx] = saved;
    } else {
      const count = quotations.length + 1;
      saved = {
        id: `quot-${Date.now()}`,
        quotationNumber: `QT-2026-${String(count).padStart(3, '0')}`,
        leadId: quotation.leadId,
        systemCapacityKW: quotation.systemCapacityKW || 5,
        panelModel: quotation.panelModel || 'Waaree 540W Mono PERC TopCon',
        panelCount: quotation.panelCount || 10,
        inverterModel: quotation.inverterModel || 'Sungrow 5kW Grid-Tied Inverter',
        items: quotation.items || [],
        subtotal,
        discount,
        gstPercent,
        gstAmount,
        grandTotal,
        status: quotation.status || 'Sent',
        createdAt: now,
        validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      };
      quotations.unshift(saved);
    }

    setStoredData(QUOTATIONS_KEY, quotations);

    // Link quotation to lead
    const leads = getStoredData<Lead[]>(LEADS_KEY, INITIAL_LEADS);
    const leadIdx = leads.findIndex((l) => l.id === quotation.leadId);
    if (leadIdx !== -1) {
      leads[leadIdx].quotationId = saved.id;
      setStoredData(LEADS_KEY, leads);
    }

    return saved;
  },

  exportToCSV: (leads: Lead[]): void => {
    const headers = ['ID', 'Customer Name', 'Phone', 'Email', 'City', 'State', 'Capacity (kW)', 'Roof Type', 'Monthly Bill (INR)', 'Source', 'Status', 'Assigned To', 'Follow Up Date'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.customerName}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.city}"`,
      `"${l.state}"`,
      l.capacityKW,
      `"${l.roofType}"`,
      l.monthlyBillAmount,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${l.assignedToName}"`,
      l.followUpDate,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
