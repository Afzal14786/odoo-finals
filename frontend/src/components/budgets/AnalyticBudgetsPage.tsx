import React, { useState } from 'react';
import { Budget } from '../../types';

const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'b-1',
    name: 'Q3 Marketing Campaign',
    allocatedAmount: 15000,
    spentAmount: 8200,
    period: '2026 Q3',
  },
  {
    id: 'b-2',
    name: 'IT Infrastructure Upgrade',
    allocatedAmount: 25000,
    spentAmount: 19400,
    period: '2026 Annual',
  },
];

export const AnalyticBudgetsPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({
    name: '',
    allocatedAmount: 0,
    spentAmount: 0,
    period: '2026 Q3',
  });

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudget.name) return;

    const createdBudget: Budget = {
      id: `b-${Date.now()}`,
      ...newBudget,
    };

    setBudgets([createdBudget, ...budgets]);
    setNewBudget({
      name: '',
      allocatedAmount: 0,
      spentAmount: 0,
      period: '2026 Q3',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytic Budgets</h1>
          <p className="text-sm text-gray-500">Track allocations vs actual spending across projects</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow transition-colors"
        >
          + Create Budget
        </button>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget) => {
          const percentage = Math.min(
            100,
            Math.round((budget.spentAmount / (budget.allocatedAmount || 1)) * 100)
          );
          const isOverBudget = budget.spentAmount > budget.allocatedAmount;

          return (
            <div key={budget.id} className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{budget.name}</h3>
                  <span className="text-xs text-gray-500">Period: {budget.period}</span>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    isOverBudget
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {percentage}% Used
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full ${isOverBudget ? 'bg-rose-500' : 'bg-blue-600'}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm pt-2 border-t">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Allocated</p>
                  <p className="font-semibold text-gray-800">${budget.allocatedAmount}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Spent</p>
                  <p className="font-semibold text-gray-800">${budget.spentAmount}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Remaining</p>
                  <p
                    className={`font-semibold ${
                      isOverBudget ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    ${budget.allocatedAmount - budget.spentAmount}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">New Budget Allocation</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Budget / Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Hiring Campaign"
                  className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newBudget.name}
                  onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Target Period
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026 Q4"
                  className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newBudget.period}
                  onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Allocated ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newBudget.allocatedAmount}
                    onChange={(e) =>
                      setNewBudget({
                        ...newBudget,
                        allocatedAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Initial Spent ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newBudget.spentAmount}
                    onChange={(e) =>
                      setNewBudget({
                        ...newBudget,
                        spentAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2 border rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Create Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};