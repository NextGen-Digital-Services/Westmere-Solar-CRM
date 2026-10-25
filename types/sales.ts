export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Converted' | 'Lost';

export interface QuotationLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected';

export interface Quotation {
  id: string;
  quotationNumber: string;
  leadId: string;
  systemCapacityKW: number;
  panelModel: string;
  panelCount: number;
  inverterModel: string;
  items: QuotationLineItem[];
  subtotal: number;
  discount: number;
  gstPercent: number;
  gstAmount: number;
  grandTotal: number;
  status: QuotationStatus;
  createdAt: string;
  validUntil: string;
}

export interface Lead {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  capacityKW: number;
  roofType: 'Concrete Flat' | 'Tin Shed' | 'Tile Roof' | 'Ground Mount';
  monthlyBillAmount: number;
  source: 'Website' | 'Referral' | 'Walk-in' | 'Social Media' | 'Partner';
  status: LeadStatus;
  assignedToId: string;
  assignedToName: string;
  followUpDate: string;
  notes: string;
  quotationId?: string;
  createdAt: string;
  updatedAt: string;
}
