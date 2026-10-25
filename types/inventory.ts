export type StockCategory =
  | 'Solar Panels'
  | 'Inverters'
  | 'Mounting Structures'
  | 'DC Cables'
  | 'AC Cables'
  | 'Protection Devices'
  | 'Accessories';

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: StockCategory;
  brand: string;
  unit: 'Nos' | 'Meters' | 'Sets' | 'Kits';
  quantityInStock: number;
  allocatedQuantity: number;
  availableQuantity: number;
  reorderLevel: number;
  unitCostINR: number;
  location: string;
  isLowStock: boolean;
  lastRestockedDate: string;
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  sku: string;
  itemName: string;
  type: 'INWARD' | 'OUTWARD' | 'PROJECT_ALLOCATION' | 'RETURN';
  quantity: number;
  projectId?: string;
  referenceNumber: string;
  recordedBy: string;
  timestamp: string;
  notes?: string;
}
