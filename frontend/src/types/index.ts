export interface Contact {
  id: string;
  name: string;
  type: 'Customer' | 'Vendor' | 'Both';
  email: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Product {
  id: string;
  name: string;
  type: 'Goods' | 'Service' | 'Combo';
  category: string;
  salesPrice: number;
  costPrice: number;
}

export interface JournalEntryLine {
  account: string;
  partner: string;
  debit: number;
  credit: number;
}


export interface Budget {
  id: string;
  name: string;
  period: string;
  responsible: string;
  analyticAccount: string;
  plannedAmount: number;
  practicalAmount: number;
}