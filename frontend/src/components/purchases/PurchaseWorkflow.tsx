import React, { useState } from 'react';

export const PurchaseWorkflow: React.FC = () => {
  const [stage, setStage] = useState<'PO' | 'BILL'>('PO');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentJournal, setPaymentJournal] = useState('Bank');

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen space-y-6">
      <div className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">Purchase Order / Bill Flow</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
            Status: {stage === 'PO' ? 'Purchase Order' : 'Vendor Bill'}
          </span>
        </div>
        <div className="flex gap-2">
          {stage === 'PO' && (
            <button
              onClick={() => setStage('BILL')}
              className="px-4 py-2 bg-sky-300 hover:bg-sky-400 font-bold rounded-lg border border-sky-400"
            >
              Convert to Bill
            </button>
          )}
          {stage === 'BILL' && (
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
            >
              Register Payment
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Vendor</label>
            <input type="text" readOnly value="Azure Furniture" className="w-full border p-2 rounded bg-gray-50 font-bold text-gray-700" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Order / Bill Date</label>
            <input type="date" defaultValue="2026-09-05" className="w-full border p-2 rounded" />
          </div>
        </div>

        <table className="w-full text-left border-collapse text-sm mb-6">
          <thead className="bg-gray-100 border-b font-bold text-gray-700">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Analytic Account</th>
              <th className="p-2 text-right">Quantity</th>
              <th className="p-2 text-right">Unit Price (₹)</th>
              <th className="p-2 text-right">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2 font-medium">Wooden Table</td>
              <td className="p-2 text-gray-600">Project Alpha</td>
              <td className="p-2 text-right">5</td>
              <td className="p-2 text-right">8,000</td>
              <td className="p-2 text-right font-bold">40,000</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end text-lg font-bold border-t pt-3">
          <span>Grand Total: ₹40,000</span>
        </div>
      </div>

      {isPaymentOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl border">
            <h3 className="text-lg font-bold mb-4">Register Bill Payment</h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Payment Method</label>
                <select
                  value={paymentJournal}
                  onChange={(e) => setPaymentJournal(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="Bank">Bank Journal</option>
                  <option value="Cash">Cash Journal</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Payment Amount (₹)</label>
                <input type="number" defaultValue={40000} className="w-full border p-2 rounded font-bold" />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setIsPaymentOpen(false)} className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded">
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsPaymentOpen(false);
                  alert('Payment Registered! Updated ledger journal entries created.');
                }}
                className="px-4 py-1.5 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
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