'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lead, LeadStatus } from '@/types/sales';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
  lead: Lead | null;
  employees: Array<{ id: string; name: string }>;
}

export function LeadModal({ isOpen, onClose, onSave, lead, employees }: LeadModalProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411038',
    capacityKW: 5,
    roofType: 'Concrete Flat' as Lead['roofType'],
    monthlyBillAmount: 4800,
    source: 'Website' as Lead['source'],
    status: 'New' as LeadStatus,
    assignedToId: employees[0]?.id || '',
    followUpDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        customerName: lead.customerName,
        phone: lead.phone,
        email: lead.email,
        address: lead.address,
        city: lead.city,
        state: lead.state,
        pincode: lead.pincode,
        capacityKW: lead.capacityKW,
        roofType: lead.roofType,
        monthlyBillAmount: lead.monthlyBillAmount,
        source: lead.source,
        status: lead.status,
        assignedToId: lead.assignedToId,
        followUpDate: lead.followUpDate,
        notes: lead.notes,
      });
    } else {
      setFormData({
        customerName: '',
        phone: '+91 98220 ',
        email: '',
        address: '',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        capacityKW: 5,
        roofType: 'Concrete Flat',
        monthlyBillAmount: 4500,
        source: 'Website',
        status: 'New',
        assignedToId: employees[0]?.id || '',
        followUpDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [lead, employees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rep = employees.find((x) => x.id === formData.assignedToId);
    onSave({
      id: lead?.id,
      ...formData,
      capacityKW: Number(formData.capacityKW),
      monthlyBillAmount: Number(formData.monthlyBillAmount),
      assignedToName: rep?.name || 'Amit Verma',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lead ? 'Edit Solar Lead' : 'Register New Solar Lead'} maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Customer Full Name" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} required />
          <Input label="Contact Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Input label="Site Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
          <Input label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required />
          <Input label="Pincode" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input label="Capacity (kW)" type="number" min="1" max="100" value={formData.capacityKW} onChange={(e) => setFormData({ ...formData, capacityKW: Number(e.target.value) })} required />
          <Select
            label="Roof Architecture"
            value={formData.roofType}
            onChange={(e) => setFormData({ ...formData, roofType: e.target.value as any })}
            options={['Concrete Flat', 'Tin Shed', 'Tile Roof', 'Ground Mount'].map((r) => ({ label: r, value: r }))}
          />
          <Input label="Monthly Bill (₹)" type="number" value={formData.monthlyBillAmount} onChange={(e) => setFormData({ ...formData, monthlyBillAmount: Number(e.target.value) })} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Lead Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={['New', 'Contacted', 'Interested', 'Converted', 'Lost'].map((s) => ({ label: s, value: s }))}
          />
          <Select
            label="Assigned Sales Rep"
            value={formData.assignedToId}
            onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
            options={employees.map((emp) => ({ label: emp.name, value: emp.id }))}
          />
          <Input label="Follow-Up Schedule" type="date" value={formData.followUpDate} onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-main)] mb-1 uppercase tracking-wide">Technical Site Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
            className="w-full bg-[var(--surface-raised)] text-[var(--text-main)] border border-[var(--border-color)] rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="e.g. South facing rooftop, 3-phase meter required..."
          />
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="sm">Save Lead</Button>
        </div>
      </form>
    </Modal>
  );
}
