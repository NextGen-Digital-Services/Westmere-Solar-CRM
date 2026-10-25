import { StockItem, StockMovement } from '@/types/inventory';
import { INITIAL_STOCK_ITEMS, INITIAL_STOCK_MOVEMENTS } from '@/lib/mock-data/inventory.seed';
import { getStoredData, setStoredData } from './storage';
import { auditService } from './auditService';
import { authService } from './authService';

const STOCK_KEY = 'solarcrm_inventory_stock';
const MOVEMENTS_KEY = 'solarcrm_inventory_movements';

export const inventoryService = {
  getStockItems: (): StockItem[] => {
    return getStoredData<StockItem[]>(STOCK_KEY, INITIAL_STOCK_ITEMS);
  },

  getStockItemById: (id: string): StockItem | undefined => {
    return inventoryService.getStockItems().find((i) => i.id === id || i.sku === id);
  },

  getMovements: (): StockMovement[] => {
    return getStoredData<StockMovement[]>(MOVEMENTS_KEY, INITIAL_STOCK_MOVEMENTS);
  },

  saveStockItem: (item: Partial<StockItem> & { name: string; sku: string }): StockItem => {
    const items = getStoredData<StockItem[]>(STOCK_KEY, INITIAL_STOCK_ITEMS);
    const session = authService.getCurrentSession();
    const now = new Date().toISOString().split('T')[0];

    const inStock = item.quantityInStock || 0;
    const allocated = item.allocatedQuantity || 0;
    const available = Math.max(0, inStock - allocated);
    const reorder = item.reorderLevel || 10;
    const isLow = available <= reorder;

    let saved: StockItem;
    if (item.id) {
      const idx = items.findIndex((i) => i.id === item.id);
      saved = {
        ...items[idx],
        ...item,
        quantityInStock: inStock,
        allocatedQuantity: allocated,
        availableQuantity: available,
        reorderLevel: reorder,
        isLowStock: isLow,
      } as StockItem;
      items[idx] = saved;
    } else {
      saved = {
        id: `stock-${Date.now()}`,
        sku: item.sku,
        name: item.name,
        category: item.category || 'Solar Panels',
        brand: item.brand || 'Waaree',
        unit: item.unit || 'Nos',
        quantityInStock: inStock,
        allocatedQuantity: allocated,
        availableQuantity: available,
        reorderLevel: reorder,
        unitCostINR: item.unitCostINR || 5000,
        location: item.location || 'Warehouse A',
        isLowStock: isLow,
        lastRestockedDate: now,
      };
      items.unshift(saved);
    }

    setStoredData(STOCK_KEY, items);

    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: 'inventory',
        action: item.id ? 'UPDATE' : 'CREATE',
        module: 'INVENTORY',
        recordId: saved.sku,
        summary: `${item.id ? 'Updated' : 'Added'} stock item ${saved.name}`,
      });
    }

    return saved;
  },

  recordMovement: (
    mov: Omit<StockMovement, 'id' | 'timestamp'>
  ): { movement: StockMovement; item: StockItem | null } => {
    const items = getStoredData<StockItem[]>(STOCK_KEY, INITIAL_STOCK_ITEMS);
    const movements = getStoredData<StockMovement[]>(MOVEMENTS_KEY, INITIAL_STOCK_MOVEMENTS);
    const session = authService.getCurrentSession();
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMov: StockMovement = {
      ...mov,
      id: `mov-${Date.now()}`,
      timestamp,
      recordedBy: session?.user.name || mov.recordedBy,
    };

    const itemIdx = items.findIndex((i) => i.id === mov.stockItemId || i.sku === mov.sku);
    let updatedItem: StockItem | null = null;

    if (itemIdx !== -1) {
      if (mov.type === 'INWARD' || mov.type === 'RETURN') {
        items[itemIdx].quantityInStock += mov.quantity;
        items[itemIdx].lastRestockedDate = now.toISOString().split('T')[0];
      } else if (mov.type === 'OUTWARD') {
        items[itemIdx].quantityInStock = Math.max(0, items[itemIdx].quantityInStock - mov.quantity);
      } else if (mov.type === 'PROJECT_ALLOCATION') {
        items[itemIdx].allocatedQuantity += mov.quantity;
      }
      items[itemIdx].availableQuantity = Math.max(0, items[itemIdx].quantityInStock - items[itemIdx].allocatedQuantity);
      items[itemIdx].isLowStock = items[itemIdx].availableQuantity <= items[itemIdx].reorderLevel;
      updatedItem = items[itemIdx];
      setStoredData(STOCK_KEY, items);
    }

    movements.unshift(newMov);
    setStoredData(MOVEMENTS_KEY, movements);

    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: 'inventory',
        action: 'UPDATE',
        module: 'INVENTORY',
        recordId: mov.sku,
        summary: `Stock ${mov.type}: ${mov.quantity} units of ${mov.itemName}`,
      });
    }

    return { movement: newMov, item: updatedItem };
  },

  exportToCSV: (items: StockItem[]): void => {
    const headers = ['SKU', 'Item Name', 'Category', 'Brand', 'Unit', 'In Stock', 'Allocated', 'Available', 'Reorder Level', 'Unit Cost (INR)', 'Location', 'Low Stock'];
    const rows = items.map((i) => [
      i.sku,
      `"${i.name}"`,
      `"${i.category}"`,
      `"${i.brand}"`,
      i.unit,
      i.quantityInStock,
      i.allocatedQuantity,
      i.availableQuantity,
      i.reorderLevel,
      i.unitCostINR,
      `"${i.location}"`,
      i.isLowStock ? 'YES' : 'NO',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
