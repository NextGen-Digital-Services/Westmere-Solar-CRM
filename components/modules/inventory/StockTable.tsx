'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowUpDown, Edit2 } from 'lucide-react';
import { StockItem } from '@/types/inventory';

interface StockTableProps {
  items: StockItem[];
  onOpenMovement: (item: StockItem) => void;
  onEditItem: (item: StockItem) => void;
}

export function StockTable({ items, onOpenMovement, onEditItem }: StockTableProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xs">
      <table className="w-full text-xs text-left">
        <thead className="bg-[var(--surface-raised)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider">
          <tr>
            <th className="p-3.5 font-semibold">SKU & Item Name</th>
            <th className="p-3.5 font-semibold">Category</th>
            <th className="p-3.5 font-semibold">In Hand</th>
            <th className="p-3.5 font-semibold">Allocated</th>
            <th className="p-3.5 font-semibold">Available</th>
            <th className="p-3.5 font-semibold">Unit Cost</th>
            <th className="p-3.5 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-[var(--surface-raised)]/40 transition-colors">
              <td className="p-3.5">
                <div className="font-mono font-bold text-[var(--primary)]">{item.sku}</div>
                <div className="font-medium text-xs text-[var(--text-main)]">{item.name}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{item.location}</div>
              </td>
              <td className="p-3.5">
                <Badge variant="neutral">{item.category}</Badge>
              </td>
              <td className="p-3.5 font-mono font-semibold">{item.quantityInStock} {item.unit}</td>
              <td className="p-3.5 font-mono text-[var(--text-muted)]">{item.allocatedQuantity} {item.unit}</td>
              <td className="p-3.5 font-mono font-bold">
                <span className={item.isLowStock ? 'text-rose-600' : 'text-emerald-700 dark:text-emerald-400'}>
                  {item.availableQuantity} {item.unit}
                </span>
                {item.isLowStock && (
                  <span className="block text-[10px] text-rose-600 font-bold">LOW STOCK (≤{item.reorderLevel})</span>
                )}
              </td>
              <td className="p-3.5 font-mono font-semibold">₹{item.unitCostINR.toLocaleString('en-IN')}</td>
              <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                <Button size="sm" variant="outline" onClick={() => onOpenMovement(item)}>
                  <ArrowUpDown className="w-3.5 h-3.5 mr-1" /> Movement
                </Button>
                <button onClick={() => onEditItem(item)} className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--surface-raised)]">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
