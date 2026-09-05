import React, { useState } from 'react';
import { AuthPages } from './components/auth/AuthPages';
import { ContactsPage } from './components/contacts/ContactsPage';
import { ProductsPage } from './components/products/ProductsPage';
import { CoAAndJournals } from './components/accounting/CoAAndJournals';
import { JournalEntryForm } from './components/accounting/JournalEntryForm';
import { AnalyticBudgetsPage } from './components/budgets/AnalyticBudgetsPage';
import { PurchaseWorkflow } from './components/purchases/PurchaseWorkflow';
import { SalesInvoiceWorkflow } from './components/sales/SalesInvoiceWorkflow';
import { FinancialReports } from './components/reports/FinancialReports';


export function App() {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
const [activeTab, setActiveTab] = useState<
  'CONTACTS' | 'PRODUCTS' | 'COA' | 'JOURNAL_ENTRY' | 'BUDGETS' | 'PURCHASES' | 'SALES' | 'REPORTS'
>('CONTACTS');

  if (!isAuthenticated) {
    return (
      <div>
        <div className="p-3 bg-gray-900 text-white flex justify-between items-center text-xs px-6">
          <span className="font-bold">ERP Core Portal</span>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="px-3 py-1.5 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
          >
            Bypass Login (Demo Mode)
          </button>
        </div>
        <AuthPages />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-extrabold tracking-wide text-blue-400">ERP SYSTEM</h1>
          <nav className="flex gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('CONTACTS')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'CONTACTS' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Contacts
            </button>
            <button
              onClick={() => setActiveTab('PRODUCTS')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'PRODUCTS' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('COA')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'COA' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              CoA & Journals
            </button>
            <button
              onClick={() => setActiveTab('JOURNAL_ENTRY')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'JOURNAL_ENTRY' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              + Entry Form
            </button>
            <button
              onClick={() => setActiveTab('BUDGETS')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'BUDGETS' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Budgets
            </button>
            <button
              onClick={() => setActiveTab('PURCHASES')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'PURCHASES' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Purchases
            </button>
            <button
              onClick={() => setActiveTab('SALES')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'SALES' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => setActiveTab('REPORTS')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'REPORTS' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Reports
            </button>
          </nav>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
        >
          Logout
        </button>
      </header>

      {/* Main View Area */}
      <main className="flex-1 p-4">
        {activeTab === 'CONTACTS' && <ContactsPage />}
        {activeTab === 'PRODUCTS' && <ProductsPage />}
        {activeTab === 'COA' && <CoAAndJournals />}
        {activeTab === 'JOURNAL_ENTRY' && <JournalEntryForm />}
        {activeTab === 'BUDGETS' && <AnalyticBudgetsPage />}
        {activeTab === 'PURCHASES' && <PurchaseWorkflow />}
        {activeTab === 'SALES' && <SalesInvoiceWorkflow />}
        {activeTab === 'REPORTS' && <FinancialReports />}
      </main>
    </div>
  );
}

export default App;