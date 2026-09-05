import React, { useState } from 'react';
import { Product } from '../../types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Air Conditioner',
    category: 'Electronics',
    type: 'Goods',
    salesPrice: 25000,
    costPrice: 15000,
    quantityOnHand: 10,
  },
  {
    id: 'prod-2',
    name: 'Refrigerator',
    category: 'Electronics',
    type: 'Goods',
    salesPrice: 10000,
    costPrice: 7000,
    quantityOnHand: 15,
  },
];

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'form'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Goods' as Product['type'],
    category: '',
    salesPrice: 100,
    costPrice: 50,
  });

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      ...formData,
      quantityOnHand: 0,
    };

    setProducts([newProd, ...products]);
    setFormData({
      name: '',
      type: 'Goods',
      category: '',
      salesPrice: 100,
      costPrice: 50,
    });
    setViewMode('list');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      {/* Top Action Bar (Header) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {viewMode === 'form' ? (
            <>
              <button
                type="submit"
                form="product-form"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="border border-gray-300 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setViewMode('form')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm"
              >
                New
              </button>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}
        </div>

        {/* View Mode Toggle Buttons */}
        {viewMode !== 'form' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg border text-sm font-medium ${
                viewMode === 'list' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white text-gray-600'
              }`}
              title="List View"
            >
              📋 List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg border text-sm font-medium ${
                viewMode === 'kanban' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white text-gray-600'
              }`}
              title="Kanban View"
            >
              🗂️ Kanban
            </button>
          </div>
        )}
      </div>

      {/* Product Master Form View */}
      {viewMode === 'form' && (
        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">Product Master Form View</h2>
          <form id="product-form" onSubmit={handleSaveProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as Product['type'] })
                    }
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Goods">Goods</option>
                    <option value="Service">Service</option>
                    <option value="Combo">Combo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="Category (e.g. Electronics)"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sales Price (Rs.)</label>
                    <input
                      type="number"
                      value={formData.salesPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, salesPrice: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cost Price (Rs.)</label>
                    <input
                      type="number"
                      value={formData.costPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Image Box */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 text-center hover:bg-gray-100 cursor-pointer h-48 md:h-auto">
                <span className="text-3xl mb-2">📷</span>
                <span className="text-xs font-semibold text-gray-600">Upload Image</span>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Product Master List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Type</th>
                <th className="p-4">Sales Price</th>
                <th className="p-4">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm text-gray-700">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-center">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="p-4 font-semibold text-gray-900">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-medium">
                      {p.type}
                    </span>
                  </td>
                  <td className="p-4 font-medium">Rs. {p.salesPrice.toLocaleString()}</td>
                  <td className="p-4 text-gray-500">Rs. {p.costPrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Master Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 font-semibold border flex-shrink-0">
                Image
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 text-base">{p.name}</h3>
                <p className="text-xs text-gray-600">
                  Sales Price: <span className="font-semibold text-gray-800">{p.salesPrice}</span>
                </p>
                <p className="text-xs text-gray-600">
                  Cost: <span className="font-semibold text-gray-800">{p.costPrice}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};