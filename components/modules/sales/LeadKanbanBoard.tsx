'use client';

import React from 'react';
import { Lead, LeadStatus } from '@/types/sales';
import { Badge } from '@/components/ui/Badge';
import { Phone, Calendar, ArrowRight, User } from 'lucide-react';

interface LeadKanbanBoardProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onSelectLead: (lead: Lead) => void;
}

const COLUMNS: Array<{ status: LeadStatus; label: string; color: string }> = [
  { status: 'New', label: 'New Inquiries', color: 'border-blue-400' },
  { status: 'Contacted', label: 'Contacted', color: 'border-amber-400' },
  { status: 'Interested', label: 'Interested', color: 'border-purple-400' },
  { status: 'Converted', label: 'Converted to Project', color: 'border-emerald-500' },
  { status: 'Lost', label: 'Lost / Dropped', color: 'border-rose-400' },
];

export function LeadKanbanBoard({ leads, onStatusChange, onSelectLead }: LeadKanbanBoardProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      onStatusChange(leadId, status);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const colLeads = leads.filter((l) => l.status === col.status);

        return (
          <div
            key={col.status}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.status)}
            className="bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl p-3 flex flex-col min-w-[240px]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between pb-2 mb-3 border-b-2 ${col.color}`}>
              <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                {col.label}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border-color)]">
                {colLeads.length}
              </span>
            </div>

            {/* Column Items */}
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] pr-1">
              {colLeads.length === 0 ? (
                <div className="py-8 text-center text-[11px] text-[var(--text-muted)] italic">
                  No leads in stage
                </div>
              ) : (
                colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', lead.id)}
                    onClick={() => onSelectLead(lead)}
                    className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] shadow-xs hover:border-[var(--primary)] hover:shadow-md cursor-grab active:cursor-grabbing transition-all space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-[var(--text-main)] truncate">{lead.customerName}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--surface-raised)] text-[var(--primary)]">
                        {lead.capacityKW} kW
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                      <Phone className="w-3 h-3 shrink-0" />
                      <span className="truncate">{lead.phone}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[var(--border-color)] text-[10px] text-[var(--text-muted)]">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate max-w-[80px]">{lead.assignedToName.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[var(--gold)]">
                        <Calendar className="w-3 h-3" />
                        <span>{lead.followUpDate.slice(5)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
