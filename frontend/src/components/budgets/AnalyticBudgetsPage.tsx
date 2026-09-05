import React, { useState } from 'react';
import type { Budget } from '../../types';

export const AnalyticBudgetsPage: React.FC = () => {
  const [budgets] = useState<Budget[]>([
    {
      id: '1',
      name: 'Q3 Furniture Marketing',
      period: 'Jul 2026 - Sep 2026',
      responsible: 'Animesh',
      analyticAccount: 'Marketing Dept',
      plannedAmount: 150000,
      practicalAmount: 95000,
    },
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytic Budgets</h1>
          <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
            + Create Budget
          </button>
        </div>

        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-100 border-b font-bold text-gray-700">
            <tr>
              <th className="p-3">Budget Name</th>
              <th className="p-3">Period</th>
              <th className="p-3">Responsible</th>
              <th className="p-3">Analytic Account</th>
              <th className="p-3 text-right">Planned Amount</th>
              <th className="p-3 text-right">Practical Amount</th>
              <th className="p-3 text-right">Achievement %</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => {
              const achievement = Math.round((b.practicalAmount / b.plannedAmount) * 100);
              return (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold text-blue-600">{b.name}</td>
                  <td className="p-3">{b.period}</td>
                  <td className="p-3">{b.responsible}</td>
                  <td className="p-3">{b.analyticAccount}</td>
                  <td className="p-3 text-right">₹{b.plannedAmount.toLocaleString()}</td>
                  <td className="p-3 text-right font-bold text-gray-800">
                    ₹{b.practicalAmount.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${achievement > 100 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {achievement}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm grid grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-lg font-bold mb-2">Budget Distribution & Spend</h3>
          <p className="text-sm text-gray-500 mb-4">
            Visual analysis comparing planned allocations versus actual practical spend per analytic account.
          </p>
          <div className="space-y-2 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-500 rounded-full inline-block"></span>
              <span>Planned Amount: ₹1,50,000</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-emerald-500 rounded-full inline-block"></span>
              <span>Practical Spend: ₹95,000</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-44 h-44 rounded-full border-4 border-white shadow-md bg-[conic-gradient(#3b82f6_0deg_135deg,#10b981_135deg_360deg)] flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 text-xs text-center p-2">
              Spend vs Budget
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};