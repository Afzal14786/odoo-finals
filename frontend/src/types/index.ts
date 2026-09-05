export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Customer' | 'Vendor' | 'Both';
  company?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  type: 'Goods' | 'Service' | 'Combo';
  category: string;
  salesPrice: number;
  costPrice: number;
  sku?: string;
  quantityOnHand?: number;
  image?: string;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
  balance: number;
}

export interface JournalLine {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  lines: JournalLine[];
}

export interface BudgetLine {
  id: string;
  analytic: string;
  type: 'Income' | 'Expense';
  committedAmount: number;
  achievedAmount: number;
  achievedPercentage: number;
  amountToAchieve: number;
}

export interface Budget {
  id: string;
  budgetName: string;
  startDate: string;
  endDate: string;
  responsible?: string;
  status: 'Draft' | 'Confirmed' | 'Revised' | 'Cancelled';
  revisionOfId?: string;
  revisionOfName?: string;
  lines: BudgetLine[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Draft' | 'Confirmed' | 'Billed' | 'Paid';
}

export interface SalesOrder {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Invoiced' | 'Paid';
}