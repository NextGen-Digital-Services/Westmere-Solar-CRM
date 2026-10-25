'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Quotation, QuotationLineItem, QuotationStatus } from '@/types/sales';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quotation: Partial<Quotation>) => void;
  leadId: string;
  leadCapacity: number;
}

export function QuotationModal({ isOpen, onClose, onSave, leadId, leadCapacity }: QuotationModalProps) {
  const [capacityKW, setCapacityKW] = useState(leadCapacity || 5);
  const [panelModel, setPanelModel] = useState('Waaree 540W Mono PERC TopCon');
  const [panelCount, setPanelCount] = useState(Math.ceil((leadCapacity || 5) * 2));
  const [inverterModel, setInverterModel] = useState('Sungrow 5kW Grid-Tied Inverter');
  const [discount, setDiscount] = useState(10000);
  const [gstPercent, setGstPercent] = useState(13.8);
  const [status, setStatus] = useState<QuotationStatus>('Sent');

  // Computed totals
  const panelPrice = 11500;
  const inverterPrice = capacityKW > 5 ? 75000 : 45000;
  const structurePrice = capacityKW * 4500;
  const bosPrice = capacityKW * 3000;
  const laborPrice = capacityKW * 4000;

  const subtotal = panelCount * panelPrice + inverterPrice + structurePrice + bosPrice + laborPrice;
  const taxable = Math.max(0, subtotal - discount);
  const gstAmount = Math.round((taxable * gstPercent) / 100);
  const grandTotal = taxable + gstAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const items: QuotationLineItem[] = [
      { id: '1', description: `${panelModel} (${panelCount} Nos)`, quantity: panelCount, unit: 'Nos', unitPrice: panelPrice, totalPrice: panelCount * panelPrice },
      { id: '2', description: inverterModel, quantity: 1, unit: 'Nos', unitPrice: inverterPrice, totalPrice: inverterPrice },
      { id: '3', description: 'Aluminium Heavy Duty Mounting Structure & Hardware', quantity: capacityKW, unit: 'kW', unitPrice: 4500, totalPrice: structurePrice },
      { id: '4', description: 'BOS Kit: 4sq.mm Solar DC Cables, ACDB/DCDB, Earthing & SPD', quantity: capacityKW, unit: 'kW', unitPrice: 3000, totalPrice: bosPrice },
      { id: '5', description: 'Turnkey Installation, Testing & Net-Metering Coordination', quantity: capacityKW, unit: 'kW', unitPrice: 4000, totalPrice: laborPrice },
    ];

    onSave({
      leadId,
      systemCapacityKW: capacityKW,
      panelModel,
      panelCount,
      inverterModel,
      items,
      subtotal,
      discount,
      gstPercent,
      gstAmount,
      grandTotal,
      status,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Formal Solar Quotation" maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="System Capacity (kW)" type="number" min="1" max="100" value={capacityKW} onChange={(e) => {
            const val = Number(e.target.value);
            setCapacityKW(val);
            setPanelCount(Math.ceil(val * 2));
          }} required />
          <Input label="Solar Panels Quantity" type="number" value={panelCount} onChange={(e) => setPanelCount(Number(e.target.value))} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Selected Photovoltaic Module"
            value={panelModel}
            onChange={(e) => setPanelModel(e.target.value)}
            options={[
              { label: 'Waaree 540W Mono PERC TopCon', value: 'Waaree 540W Mono PERC TopCon' },
              { label: 'Adani 545W Bifacial Dual Glass', value: 'Adani 545W Bifacial Dual Glass' },
              { label: 'Tata Power 550W Mono Half-Cut', value: 'Tata Power 550W Mono Half-Cut' },
            ]}
          />
          <Select
            label="Selected Grid Inverter"
            value={inverterModel}
            onChange={(e) => setInverterModel(e.target.value)}
            options={[
              { label: 'Sungrow Grid-Tied Inverter', value: 'Sungrow 5kW Grid-Tied Inverter' },
              { label: 'Growatt Single Phase Inverter', value: 'Growatt 3.3kW Single Phase Inverter' },
              { label: 'Solis 10kW 3-Phase Inverter', value: 'Solis 10kW 3-Phase Inverter' },
            ]}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input label="Commercial Discount (₹)" type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          <Input label="Solar GST %" type="number" step="0.1" value={gstPercent} onChange={(e) => setGstPercent(Number(e.target.value))} />
          <Select
            label="Proposal Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            options={[
              { label: 'Draft', value: 'Draft' },
              { label: 'Sent to Customer', value: 'Sent' },
              { label: 'Accepted', value: 'Accepted' },
              { label: 'Rejected', value: 'Rejected' },
            ]}
          />
        </div>

        {/* Live Calculation Box */}
        <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)] space-y-1.5 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Subtotal (Materials + Labor):</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-emerald-600">
            <span>Discount Applied:</span>
            <span>-₹{discount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-[var(--text-muted)]">
            <span>Composite GST ({gstPercent}%):</span>
            <span>₹{gstAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-[var(--primary)] border-t border-[var(--border-color)] pt-1.5">
            <span>Grand Total:</span>
            <span>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Generate Proposal
          </Button>
        </div>
      </form>
    </Modal>
  );
}
