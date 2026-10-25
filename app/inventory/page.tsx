'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Download, Search, AlertTriangle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StockItemModal } from '@/components/modules/inventory/StockItemModal';
import { StockMovementModal } from '@/components/modules/inventory/StockMovementModal';
import { StockTable } from '@/components/modules/inventory/StockTable';
import { inventoryService } from '@/lib/services/inventoryService';
import { useToast } from '@/components/providers/ToastProvider';
import { StockItem } from '@/types/inventory';

export default function InventoryPage() {
  const [items, setItems] = useState<StockItem[]>(() => inventoryService.getStockItems());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  const [movModalOpen, setMovModalOpen] = useState(false);
  const [activeItemForMov, setActiveItemForMov] = useState<StockItem | null>(null);

  const { success } = useToast();

  const totalValuation = useMemo(() => items.reduce((acc, i) => acc + i.quantityInStock * i.unitCostINR, 0), [items]);
  const lowStockCount = useMemo(() => items.filter((i) => i.isLowStock).length, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()) || i.brand.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'ALL' || i.category === categoryFilter;
      const matchLow = !onlyLowStock || i.isLowStock;
      return matchSearch && matchCat && matchLow;
    });
  }, [items, search, categoryFilter, onlyLowStock]);

  const handleSaveItem = (data: Partial<StockItem>) => {
    inventoryService.saveStockItem(data as any);
    setItems(inventoryService.getStockItems());
    success('Inventory SKU updated successfully.');
  };

  const handleRecordMovement = (movData: any) => {
    inventoryService.recordMovement(movData);
    setItems(inventoryService.getStockItems());
    success(`Recorded ${movData.type} transaction for ${movData.quantity} units.`);
  };

  return (
    <DashboardLayout requiredDepartment="inventory">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">Warehouse & Bill of Materials</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">Solar Hardware & Inventory Control</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => inventoryService.exportToCSV(filteredItems)}>
              <Download className="w-4 h-4 mr-1.5" /> Export Stock CSV
            </Button>
            <Button size="sm" variant="primary" onClick={() => { setEditingItem(null); setItemModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-1.5" /> Add New SKU
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase">Total Tracked SKUs</span>
            <div className="text-2xl font-bold font-serif text-[var(--text-main)] mt-1">{items.length} Active Items</div>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-[var(--gold)] font-semibold uppercase">Total Inventory Valuation</span>
            <div className="text-2xl font-bold font-serif text-[var(--text-main)] mt-1">₹{(totalValuation / 100000).toFixed(1)} Lakhs</div>
          </Card>
          <Card className={`p-4 cursor-pointer transition-colors ${onlyLowStock ? 'ring-2 ring-rose-500 bg-rose-50/20' : ''}`} onClick={() => setOnlyLowStock(!onlyLowStock)}>
            <div className="flex justify-between items-center">
              <span className="text-xs text-rose-600 font-semibold uppercase">Low Stock Threshold</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold font-serif text-rose-600 mt-1">{lowStockCount} Reorder Alerts</div>
          </Card>
        </div>

        <Card className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            <input type="text" placeholder="Search by SKU, brand or component name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] cursor-pointer">
            <option value="ALL">All Categories</option>
            {['Solar Panels', 'Inverters', 'Mounting Structures', 'DC Cables', 'AC Cables', 'Protection Devices', 'Accessories'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Card>

        <StockTable
          items={filteredItems}
          onOpenMovement={(item) => { setActiveItemForMov(item); setMovModalOpen(true); }}
          onEditItem={(item) => { setEditingItem(item); setItemModalOpen(true); }}
        />
      </div>

      <StockItemModal isOpen={itemModalOpen} onClose={() => setItemModalOpen(false)} onSave={handleSaveItem} item={editingItem} />
      <StockMovementModal isOpen={movModalOpen} onClose={() => setMovModalOpen(false)} onRecordMovement={handleRecordMovement} item={activeItemForMov} />
    </DashboardLayout>
  );
}
