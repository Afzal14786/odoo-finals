
import React, { useState } from 'react';

export const SalesInvoiceWorkflow: React.FC = () => {
  const [stage, setStage] = useState<'SO' | 'INVOICE'>('SO');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'Inbound' | 'Outbound'>('Inbound');
  const [journal, setJournal] = useState('Bank');

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen space-y-6">
      <div className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">Sales & Invoicing Workflow</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
            {stage === 'SO' ? 'Sales Order: SO0001' : 'Customer Invoice: INV/2026/0001'}
          </span>
        </div>
        <div className="flex gap-2">
          {stage === 'SO' && (
            <button
              onClick={() => setStage('INVOICE')}
              className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700"
            >
              Create Invoice
            </button>
          )}
          {stage === 'INVOICE' && (
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
            >
              Register Payment
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Customer</label>
            <input type="text" readOnly value="Mr. Rahul" className="w-full border p-2 rounded bg-gray-50 font-bold" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Order / Invoice Date</label>
            <input type="date" defaultValue="2026-09-05" className="w-full border p-2 rounded" />
          </div>
        </div>

        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-100 border-b font-bold text-gray-700">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Chart of Account</th>
              <th className="p-2">Analytic Account</th>
              <th className="p-2 text-right">Qty</th>
              <th className="p-2 text-right">Unit Price (₹)</th>
              <th className="p-2 text-right">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2 font-medium">Wooden Table</td>
              <td className="p-2 text-gray-600">Sales A/c</td>
              <td className="p-2 text-gray-600">Project 1</td>
              <td className="p-2 text-right">2</td>
              <td className="p-2 text-right">10,000</td>
              <td className="p-2 text-right font-bold">20,000</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end text-lg font-bold border-t pt-3">
          <span>Total: ₹20,000</span>
        </div>
      </div>

      {isPaymentOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl border">
            <h3 className="text-lg font-bold mb-4">Incoming Payment</h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Payment Type</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as 'Inbound' | 'Outbound')}
                  className="w-full border p-2 rounded"
                >
                  <option value="Inbound">Inbound (Receive)</option>
                  <option value="Outbound">Outbound (Send)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Partner</label>
                <input type="text" readOnly value="Mr. Rahul" className="w-full border p-2 rounded bg-gray-50 font-bold" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Journal</label>
                <select value={journal} onChange={(e) => setJournal(e.target.value)} className="w-full border p-2 rounded">
                  <option value="Bank">Bank</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Amount (₹)</label>
                <input type="number" defaultValue={20000} className="w-full border p-2 rounded font-bold" />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setIsPaymentOpen(false)} className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded">
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsPaymentOpen(false);
                  alert('Payment Received & Journal Entry created!');
                }}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};