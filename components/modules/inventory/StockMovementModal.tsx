'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StockItem, StockMovement } from '@/types/inventory';

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordMovement: (movement: Omit<StockMovement, 'id' | 'timestamp'>) => void;
  item: StockItem | null;
}

export function StockMovementModal({ isOpen, onClose, onRecordMovement, item }: StockMovementModalProps) {
  const [type, setType] = useState<StockMovement['type']>('PROJECT_ALLOCATION');
  const [quantity, setQuantity] = useState(10);
  const [projectId, setProjectId] = useState('SOL-2026-0001');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordMovement({
      stockItemId: item.id,
      sku: item.sku,
      itemName: item.name,
      type,
      quantity: Number(quantity),
      projectId: type === 'PROJECT_ALLOCATION' ? projectId : undefined,
      referenceNumber: referenceNumber || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      recordedBy: 'Rajesh Gupta',
      notes,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Record Movement: ${item.sku}`} maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-color)]">
          <div className="font-bold text-[var(--text-main)]">{item.name}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">
            Available: <strong className="text-[var(--primary)] font-mono">{item.availableQuantity} {item.unit}</strong> | Total: {item.quantityInStock} {item.unit}
          </div>
        </div>

        <Select
          label="Movement Transaction Type"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          options={[
            { label: 'Project Allocation / Dispatch', value: 'PROJECT_ALLOCATION' },
            { label: 'Inward Factory Shipment', value: 'INWARD' },
            { label: 'Outward Scrap / Damage', value: 'OUTWARD' },
            { label: 'Site Return to Warehouse', value: 'RETURN' },
          ]}
        />

        <Input
          label={`Quantity (${item.unit})`}
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />

        {type === 'PROJECT_ALLOCATION' && (
          <Input
            label="Destination Project ID"
            placeholder="e.g. SOL-2026-0001"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          />
        )}

        <Input
          label="Document Reference / Gate Pass / PO No"
          placeholder="e.g. GATE-PASS-9912"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          required
        />

        <Input
          label="Remarks / Driver / Carrier"
          placeholder="e.g. Dispatched via Logistics Van MH-12-8821"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Post Stock Movement
          </Button>
        </div>
      </form>
    </Modal>
  );
}
