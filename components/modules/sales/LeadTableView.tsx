'use client';

import React from 'react';
import { Lead } from '@/types/sales';
import { Badge } from '@/components/ui/Badge';
import { Edit2, Trash2, FileText, Phone, MapPin } from 'lucide-react';
import { Can } from '@/components/auth/Can';

interface LeadTableViewProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onOpenQuote: (lead: Lead) => void;
}

export function LeadTableView({ leads, onEdit, onDelete, onOpenQuote }: LeadTableViewProps) {
  const getBadgeVariant = (st: Lead['status']) => {
    switch (st) {
      case 'New': return 'info';
      case 'Contacted': return 'warning';
      case 'Interested': return 'gold';
      case 'Converted': return 'success';
      case 'Lost': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--surface-raised)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider">
            <tr>
              <th className="p-3.5 font-semibold">Customer</th>
              <th className="p-3.5 font-semibold">Location</th>
              <th className="p-3.5 font-semibold">System (kW)</th>
              <th className="p-3.5 font-semibold">Stage</th>
              <th className="p-3.5 font-semibold">Sales Rep</th>
              <th className="p-3.5 font-semibold">Follow-Up</th>
              <th className="p-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-[var(--surface-raised)]/40 transition-colors">
                <td className="p-3.5">
                  <div className="font-semibold text-sm text-[var(--text-main)]">{l.customerName}</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" />
                    {l.phone}
                  </div>
                </td>
                <td className="p-3.5 text-[var(--text-main)]">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                    <span>{l.city}, {l.state}</span>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{l.roofType}</div>
                </td>
                <td className="p-3.5">
                  <span className="font-mono font-bold text-sm text-[var(--primary)]">{l.capacityKW} kW</span>
                  <div className="text-[10px] text-[var(--text-muted)]">₹{l.monthlyBillAmount}/mo</div>
                </td>
                <td className="p-3.5">
                  <Badge variant={getBadgeVariant(l.status)}>{l.status}</Badge>
                </td>
                <td className="p-3.5 font-medium text-[var(--text-main)]">{l.assignedToName}</td>
                <td className="p-3.5 font-mono text-[var(--gold)]">{l.followUpDate}</td>
                <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                  <button
                    onClick={() => onOpenQuote(l)}
                    className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--surface-raised)] text-[var(--primary)]"
                    title="Generate / View Proposal"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                  <Can I="edit" a="sales">
                    <button
                      onClick={() => onEdit(l)}
                      className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--surface-raised)] text-[var(--text-main)]"
                      title="Edit Lead"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </Can>
                  <Can I="delete" a="sales">
                    <button
                      onClick={() => onDelete(l.id)}
                      className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-rose-50 text-rose-600"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </Can>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
