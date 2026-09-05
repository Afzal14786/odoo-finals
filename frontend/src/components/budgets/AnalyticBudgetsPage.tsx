import React, { useState } from 'react';
import { Budget, BudgetLine } from '../../types';

const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'b-1',
    budgetName: 'January 2026',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    responsible: 'John Doe',
    status: 'Confirmed',
    lines: [
      {
        id: 'bl-1',
        analytic: 'Furniture',
        type: 'Expense',
        committedAmount: 200000,
        achievedAmount: 18000,
        achievedPercentage: 9,
        amountToAchieve: 182000,
      },
    ],
  },
];

export const AnalyticBudgetsPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'form'>('list');
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

  // Form State
  const [budgetName, setBudgetName] = useState('');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-01-31');
  const [responsible, setResponsible] = useState('');
  const [lines, setLines] = useState<BudgetLine[]>([
    {
      id: 'line-1',
      analytic: '',
      type: 'Expense',
      committedAmount: 0,
      achievedAmount: 0,
      achievedPercentage: 0,
      amountToAchieve: 0,
    },
  ]);

  const activeBudget = budgets.find((b) => b.id === selectedBudgetId);

  const handleOpenNewForm = () => {
    setSelectedBudgetId(null);
    setBudgetName('');
    setStartDate('2026-01-01');
    setEndDate('2026-01-31');
    setResponsible('');
    setLines([
      {
        id: `line-${Date.now()}`,
        analytic: '',
        type: 'Expense',
        committedAmount: 0,
        achievedAmount: 0,
        achievedPercentage: 0,
        amountToAchieve: 0,
      },
    ]);
    setViewMode('form');
  };

  const handleLineChange = (index: number, field: keyof BudgetLine, value: any) => {
    const updatedLines = [...lines];
    const currentLine = { ...updatedLines[index], [field]: value };

    // Auto-calculate Achieved %, Amount to Achieve
    const committed = Number(currentLine.committedAmount) || 0;
    const achieved = Number(currentLine.achievedAmount) || 0;
    currentLine.achievedPercentage = committed > 0 ? Math.round((achieved / committed) * 100) : 0;
    currentLine.amountToAchieve = committed - achieved;

    updatedLines[index] = currentLine;
    setLines(updatedLines);
  };

  const handleAddLine = () => {
    setLines([
      ...lines,
      {
        id: `line-${Date.now()}`,
        analytic: '',
        type: 'Expense',
        committedAmount: 0,
        achievedAmount: 0,
        achievedPercentage: 0,
        amountToAchieve: 0,
      },
    ]);
  };

  const handleConfirmBudget = () => {
    if (activeBudget) {
      setBudgets(
        budgets.map((b) => (b.id === activeBudget.id ? { ...b, status: 'Confirmed' } : b))
      );
    }
  };

  const handleReviseBudget = () => {
    if (!activeBudget) return;

    // Create a new Revised Budget linked to the original
    const revisedBudget: Budget = {
      ...activeBudget,
      id: `b-${Date.now()}`,
      budgetName: `${activeBudget.budgetName} (Revised)`,
      status: 'Revised',
      revisionOfId: activeBudget.id,
      revisionOfName: activeBudget.budgetName,
    };

    setBudgets([revisedBudget, ...budgets]);
    setSelectedBudgetId(revisedBudget.id);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetName) return;

    const newBudget: Budget = {
      id: `b-${Date.now()}`,
      budgetName,
      startDate,
      endDate,
      responsible,
      status: 'Draft',
      lines,
    };

    setBudgets([newBudget, ...budgets]);
    setViewMode('list');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      {/* Action Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenNewForm}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            New
          </button>
          {viewMode === 'form' && (
            <>
              <button
                onClick={handleConfirmBudget}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
              <button
                onClick={handleReviseBudget}
                className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
              >
                Revise
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="border border-gray-300 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            </>
          )}
        </div>

        {/* Status Pipeline & View Modes */}
        <div className="flex items-center gap-4">
          {viewMode === 'form' && activeBudget && (
            <div className="flex items-center text-xs font-semibold rounded-lg border overflow-hidden">
              {['Draft', 'Confirmed', 'Revised', 'Cancelled'].map((st) => (
                <span
                  key={st}
                  className={`px-3 py-1.5 ${
                    activeBudget.status === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {st}
                </span>
              ))}
            </div>
          )}

          {viewMode !== 'form' && (
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg border text-sm ${
                  viewMode === 'list' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white'
                }`}
              >
                📋 List
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg border text-sm ${
                  viewMode === 'kanban' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white'
                }`}
              >
                🗂️ Kanban
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form View */}
      {viewMode === 'form' && (
        <form onSubmit={handleSaveBudget} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
          <div className="flex justify-between items-start border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {activeBudget ? activeBudget.budgetName : 'Budget Form View'}
            </h2>
            {activeBudget?.revisionOfName && (
              <span className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Revision Of: {activeBudget.revisionOfName}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Budget Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. January 2026"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Responsible</label>
              <input
                type="text"
                placeholder="Select from contacts master"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Budget Lines Table */}
          <div className="pt-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Analytic Budget Lines</h3>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <tr className="bg-gray-50 border-b font-semibold text-gray-600">
                  <th className="p-3">Analytic</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Committed Amount</th>
                  <th className="p-3">Achieved Amount</th>
                  <th className="p-3">Achieved %</th>
                  <th className="p-3">Amount To Achieve</th>
                </tr>
                {lines.map((line, idx) => (
                  <tr key={line.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Project/Department"
                        value={line.analytic}
                        onChange={(e) => handleLineChange(idx, 'analytic', e.target.value)}
                        className="w-full border rounded p-1.5 outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={line.type}
                        onChange={(e) => handleLineChange(idx, 'type', e.target.value)}
                        className="w-full border rounded p-1.5 outline-none bg-white"
                      >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={line.committedAmount}
                        onChange={(e) => handleLineChange(idx, 'committedAmount', e.target.value)}
                        className="w-full border rounded p-1.5 outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={line.achievedAmount}
                        onChange={(e) => handleLineChange(idx, 'achievedAmount', e.target.value)}
                        className="w-full border rounded p-1.5 outline-none"
                      />
                    </td>
                    <td className="p-3 font-semibold">{line.achievedPercentage}%</td>
                    <td className="p-3 font-semibold text-gray-700">{line.amountToAchieve}</td>
                  </tr>
                ))}
              </table>
            </div>
            <button
              type="button"
              onClick={handleAddLine}
              className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
            >
              + Add Line
            </button>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-lg"
            >
              Save Budget
            </button>
          </div>
        </form>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-xs font-bold text-gray-600 uppercase">
                <th className="p-4">Budget</th>
                <th className="p-4">Start Date</th>
                <th className="p-4">End Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {budgets.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-gray-900">{b.budgetName}</td>
                  <td className="p-4">{b.startDate}</td>
                  <td className="p-4">{b.endDate}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        b.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Revised'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        setSelectedBudgetId(b.id);
                        setBudgetName(b.budgetName);
                        setStartDate(b.startDate);
                        setEndDate(b.endDate);
                        setResponsible(b.responsible || '');
                        setLines(b.lines);
                        setViewMode('form');
                      }}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      View / Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                setSelectedBudgetId(b.id);
                setBudgetName(b.budgetName);
                setStartDate(b.startDate);
                setEndDate(b.endDate);
                setResponsible(b.responsible || '');
                setLines(b.lines);
                setViewMode('form');
              }}
              className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md cursor-pointer space-y-3"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 text-base">{b.budgetName}</h3>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-700">
                  {b.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Start Date: <span className="font-semibold text-gray-800">{b.startDate}</span>
              </p>
              <p className="text-xs text-gray-500">
                End Date: <span className="font-semibold text-gray-800">{b.endDate}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};