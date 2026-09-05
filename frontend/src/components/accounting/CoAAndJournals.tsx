import React from 'react';

export const CoAAndJournals: React.FC = () => {
  const chartOfAccounts = [
    { code: '1000', name: 'Cash', type: 'Asset', balance: 45000 },
    { code: '1001', name: 'Bank', type: 'Asset', balance: 120000 },
    { code: '1100', name: 'Debtors', type: 'Asset', balance: 35000 },
    { code: '2000', name: 'Creditors', type: 'Liability', balance: 28000 },
    { code: '4000', name: 'Sales Income', type: 'Income', balance: 210000 },
    { code: '5000', name: 'Purchase Expense', type: 'Expense', balance: 110000 },
  ];

  const journals = [
    { name: 'Sales Journal', type: 'Sales', defaultAccount: 'Sales Income' },
    { name: 'Purchase Journal', type: 'Purchase', defaultAccount: 'Purchase Expense' },
    { name: 'Bank Journal', type: 'Bank', defaultAccount: 'Bank A/c' },
    { name: 'Cash Journal', type: 'Cash', defaultAccount: 'Cash A/c' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <section className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Chart of Accounts List View</h2>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b text-xs font-bold text-gray-600 uppercase">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Account Name</th>
              <th className="p-3">Type</th>
              <th className="p-3 text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {chartOfAccounts.map((acc, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono text-gray-500">{acc.code}</td>
                <td className="p-3 font-semibold">{acc.name}</td>
                <td className="p-3">{acc.type}</td>
                <td className="p-3 text-right font-bold">₹{acc.balance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Journals Master View</h2>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b text-xs font-bold text-gray-600 uppercase">
            <tr>
              <th className="p-3">Journal Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Default Account</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {journals.map((j, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold text-blue-600">{j.name}</td>
                <td className="p-3">{j.type}</td>
                <td className="p-3">{j.defaultAccount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};