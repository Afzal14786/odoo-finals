import React, { useState } from 'react';
import type { Product } from '../../types';
export const ProductsPage: React.FC = () => {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Office Chair',
      type: 'Goods',
      category: 'Furniture',
      salesPrice: 4500,
      costPrice: 2800,
    },
    {
      id: '2',
      name: 'Wooden Table',
      type: 'Goods',
      category: 'Furniture',
      salesPrice: 12000,
      costPrice: 8500,
    },
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border">
        <h1 className="text-2xl font-bold">Product Master</h1>
        <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
          + New Product
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{p.name}</h3>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                  {p.type} • {p.category}
                </span>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center font-bold text-sky-700 text-xs">
                P-IMG
              </div>
            </div>
            <div className="border-t pt-3 flex justify-between text-sm font-semibold">
              <span className="text-emerald-600">Sales: ₹{p.salesPrice}</span>
              <span className="text-gray-500">Cost: ₹{p.costPrice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};