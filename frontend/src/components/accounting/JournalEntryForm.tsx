import React, { useState } from 'react';
import type { JournalEntryLine } from '../../types';

export const JournalEntryForm: React.FC = () => {
  const [journal, setJournal] = useState('Sales Journal');
  const [date, setDate] = useState('2026-09-05');
  const [lines, setLines] = useState<JournalEntryLine[]>([
    { account: 'Debtors A/c', partner: 'Rahul', debit: 10000, credit: 0 },
    { account: 'Sales A/c', partner: '', debit: 0, credit: 10000 },
  ]);
  const [warning, setWarning] = useState('');

  const totalDebit = lines.reduce((acc, curr) => acc + (Number(curr.debit) || 0), 0);
  const totalCredit = lines.reduce((acc, curr) => acc + (Number(curr.credit) || 0), 0);

  const handlePost = () => {
    if (totalDebit !== totalCredit) {
      setWarning(`Cannot post: Total Debits (₹${totalDebit}) must equal Total Credits (₹${totalCredit}).`);
      return;
    }
    setWarning('');
    alert('Journal Entry posted successfully!');
  };

  const handleLineChange = (index: number, field: keyof JournalEntryLine, value: string | number) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  return (
    <div className="p-6 bg-white rounded-2xl border shadow-sm max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-bold">New Journal Entry</h2>
        <div className="flex gap-2">
          <button onClick={handlePost} className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">
            Post
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
        </div>
      </div>

      {warning && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm font-semibold">
          ⚠️ {warning}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Journal</label>
          <select value={journal} onChange={(e) => setJournal(e.target.value)} className="w-full border p-2 rounded">
            <option value="Sales Journal">Sales Journal</option>
            <option value="Purchase Journal">Purchase Journal</option>
            <option value="Bank Journal">Bank Journal</option>
            <option value="Cash Journal">Cash Journal</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Accounting Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border p-2 rounded" />
        </div>
      </div>

      <table className="w-full text-left border-collapse mb-4 text-sm">
        <thead className="bg-gray-50 border-b font-bold text-gray-700">
          <tr>
            <th className="p-2">Account</th>
            <th className="p-2">Partner</th>
            <th className="p-2 text-right">Debit (₹)</th>
            <th className="p-2 text-right">Credit (₹)</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, idx) => (
            <tr key={idx} className="border-b">
              <td className="p-2">
                <input
                  type="text"
                  value={line.account}
                  onChange={(e) => handleLineChange(idx, 'account', e.target.value)}
                  className="w-full border p-1 rounded"
                  placeholder="Select Account"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={line.partner}
                  onChange={(e) => handleLineChange(idx, 'partner', e.target.value)}
                  className="w-full border p-1 rounded"
                  placeholder="Partner (Optional)"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={line.debit}
                  onChange={(e) => handleLineChange(idx, 'debit', Number(e.target.value))}
                  className="w-full border p-1 rounded text-right"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={line.credit}
                  onChange={(e) => handleLineChange(idx, 'credit', Number(e.target.value))}
                  className="w-full border p-1 rounded text-right"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center border-t pt-3 font-bold text-sm">
        <button
          onClick={() => setLines([...lines, { account: '', partner: '', debit: 0, credit: 0 }])}
          className="text-blue-600 hover:underline"
        >
          + Add Entry Line
        </button>
        <div className="space-x-6">
          <span>Total Debit: ₹{totalDebit}</span>
          <span>Total Credit: ₹{totalCredit}</span>
        </div>
      </div>
    </div>
  );
};