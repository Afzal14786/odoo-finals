import React, { useState } from 'react';

export const FinancialReports: React.FC = () => {
  const [activeReport, setActiveReport] = useState<'PNL' | 'BALANCE_SHEET'>('PNL');

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen space-y-6">
      <div className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveReport('PNL')}
            className={`px-4 py-2 font-bold rounded-lg ${
              activeReport === 'PNL' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Profit and Loss Report
          </button>
          <button
            onClick={() => setActiveReport('BALANCE_SHEET')}
            className={`px-4 py-2 font-bold rounded-lg ${
              activeReport === 'BALANCE_SHEET' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Balance Sheet
          </button>
        </div>
        <button
          onClick={() => alert('Exporting Report PDF...')}
          className="px-4 py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-black"
        >
          Print / PDF
        </button>
      </div>

      {activeReport === 'PNL' && (
        <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="border-b pb-4 text-center">
            <h2 className="text-2xl font-bold">Profit and Loss Statement</h2>
            <p className="text-xs text-gray-500">For Financial Year 2026</p>
          </div>

          <table className="w-full text-left border-collapse text-sm">
            <tbody>
              <tr className="border-b font-semibold bg-gray-50">
                <td className="p-3">Income (A)</td>
                <td className="p-3 text-right">₹2,10,000</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 pl-6 text-gray-600">Sales Income</td>
                <td className="p-3 text-right">₹2,10,000</td>
              </tr>
              <tr className="border-b font-semibold bg-gray-50">
                <td className="p-3">Expenses (B)</td>
                <td className="p-3 text-right">₹1,10,000</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 pl-6 text-gray-600">Purchase Expense</td>
                <td className="p-3 text-right">₹1,00,000</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 pl-6 text-gray-600">Other Expense</td>
                <td className="p-3 text-right">₹10,000</td>
              </tr>
              <tr className="font-bold text-base bg-emerald-50 text-emerald-800">
                <td className="p-4">Net Profit (A - B)</td>
                <td className="p-4 text-right">₹1,00,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeReport === 'BALANCE_SHEET' && (
        <div className="bg-white p-8 rounded-2xl border shadow-sm max-w-3xl mx-auto">
          <div className="border-b pb-4 text-center mb-6">
            <h2 className="text-2xl font-bold">Balance Sheet</h2>
            <p className="text-xs text-gray-500">As on September 5, 2026</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h3 className="font-bold text-base border-b pb-2 mb-3 text-blue-700">Assets</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span>Bank</span>
                  <span className="font-semibold">₹1,20,000</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Cash</span>
                  <span className="font-semibold">₹45,000</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Debtors</span>
                  <span className="font-semibold">₹35,000</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-base border-t-2 pt-3 mt-6 text-gray-800">
                <span>Total Assets</span>
                <span>₹2,00,000</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-base border-b pb-2 mb-3 text-purple-700">Liabilities & Capital</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span>Creditors</span>
                  <span className="font-semibold">₹28,000</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Capital</span>
                  <span className="font-semibold">₹72,000</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Retained Earnings (Profit)</span>
                  <span className="font-semibold">₹1,00,000</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-base border-t-2 pt-3 mt-6 text-gray-800">
                <span>Total Liabilities</span>
                <span>₹2,00,000</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};