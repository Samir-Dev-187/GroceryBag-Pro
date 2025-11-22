export interface Alert {
  id: string;
  type: 'spike' | 'drop' | 'missing' | 'high_due' | 'low_stock';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  relatedRecords?: {
    type: 'purchase' | 'sale';
    id: string;
    details: string;
  }[];
}

export interface Purchase {
  id: string;
  date: string;
  supplier: string;
  items: {
    bagSize: string;
    units: number;
    pricePerUnit: number;
  }[];
  total: number;
  invoicePhoto?: string;
  notes?: string;
}

export interface Sale {
  id: string;
  date: string;
  customer: string;
  items: {
    bagSize: string;
    units: number;
    pricePerUnit: number;
  }[];
  paymentReceived: number;
  dueAmount: number;
  paymentMode: 'cash' | 'online';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  outstanding: number;
  sales: Sale[];
  payments: {
    date: string;
    amount: number;
    mode: 'cash' | 'online';
  }[];
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  mode: 'cash' | 'online';
  date: string;
  description: string;
}
