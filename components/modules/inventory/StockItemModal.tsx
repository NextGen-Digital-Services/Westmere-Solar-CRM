'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StockItem, StockCategory } from '@/types/inventory';

interface StockItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<StockItem>) => void;
  item: StockItem | null;
}

export function StockItemModal({ isOpen, onClose, onSave, item }: StockItemModalProps) {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<StockCategory>('Solar Panels');
  const [brand, setBrand] = useState('Waaree');
  const [unit, setUnit] = useState<StockItem['unit']>('Nos');
  const [quantityInStock, setQuantityInStock] = useState(50);
  const [reorderLevel, setReorderLevel] = useState(20);
  const [unitCostINR, setUnitCostINR] = useState(11500);
  const [location, setLocation] = useState('Warehouse A - Bay 1');

  useEffect(() => {
    if (item) {
      setSku(item.sku);
      setName(item.name);
      setCategory(item.category);
      setBrand(item.brand);
      setUnit(item.unit);
      setQuantityInStock(item.quantityInStock);
      setReorderLevel(item.reorderLevel);
      setUnitCostINR(item.unitCostINR);
      setLocation(item.location);
    } else {
      setSku(`PAN-NEW-${Math.floor(100 + Math.random() * 900)}`);
      setName('');
      setCategory('Solar Panels');
      setBrand('Waaree');
      setUnit('Nos');
      setQuantityInStock(50);
      setReorderLevel(20);
      setUnitCostINR(11500);
      setLocation('Warehouse A - Bay 1');
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: item?.id,
      sku,
      name,
      category,
      brand,
      unit,
      quantityInStock: Number(quantityInStock),
      reorderLevel: Number(reorderLevel),
      unitCostINR: Number(unitCostINR),
      location,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? `Edit SKU: ${item.sku}` : 'Add Inventory Item'} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Stock Keeping Unit (SKU)" value={sku} onChange={(e) => setSku(e.target.value)} required />
          <Input label="Manufacturer Brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        </div>
        <Input label="Item Description & Specifications" value={name} onChange={(e) => setName(e.target.value)} required />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Product Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as StockCategory)}
            options={[
              { label: 'Solar Panels', value: 'Solar Panels' },
              { label: 'Inverters', value: 'Inverters' },
              { label: 'Mounting Structures', value: 'Mounting Structures' },
              { label: 'DC Cables', value: 'DC Cables' },
              { label: 'AC Cables', value: 'AC Cables' },
              { label: 'Protection Devices', value: 'Protection Devices' },
              { label: 'Accessories', value: 'Accessories' },
            ]}
          />
          <Select
            label="Measurement Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value as any)}
            options={[
              { label: 'Pieces (Nos)', value: 'Nos' },
              { label: 'Meters (Length)', value: 'Meters' },
              { label: 'Sets', value: 'Sets' },
              { label: 'Kits', value: 'Kits' },
            ]}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input label="Quantity In Hand" type="number" value={quantityInStock} onChange={(e) => setQuantityInStock(Number(e.target.value))} required />
          <Input label="Reorder Threshold" type="number" value={reorderLevel} onChange={(e) => setReorderLevel(Number(e.target.value))} required />
          <Input label="Unit Cost (₹)" type="number" value={unitCostINR} onChange={(e) => setUnitCostINR(Number(e.target.value))} required />
        </div>
        <Input label="Warehouse Bin / Yard Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Save SKU Entry
          </Button>
        </div>
      </form>
    </Modal>
  );
}
