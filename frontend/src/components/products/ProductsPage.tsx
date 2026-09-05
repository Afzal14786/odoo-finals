import React, { useState } from 'react';
import { Product } from '../../types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Desk Chair',
    sku: 'FURN-001',
    type: 'Goods',
    category: 'Furniture',
    salesPrice: 150,
    costPrice: 90,
    quantityOnHand: 24,
  },
  {
    id: 'prod-2',
    name: 'Consulting Service',
    sku: 'SERV-001',
    type: 'Service',
    category: 'Services',
    salesPrice: 100,
    costPrice: 0,
    quantityOnHand: 0,
  },
];

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: 'General',
    type: 'Goods' as Product['type'],
    salesPrice: 0,
    costPrice: 0,
    quantityOnHand: 0,
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;

    const createdProduct: Product = {
      id: `prod-${Date.now()}`,
      ...newProduct,
    };

    setProducts([createdProduct, ...products]);
    setNewProduct({
      name: '',
      sku: '',
      category: 'General',
      type: 'Goods',
      salesPrice: 0,
      costPrice: 0,
      quantityOnHand: 0,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products & Services</h1>
          <p className="text-sm text-gray-500">Manage your catalog, prices, and stock levels</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow transition-colors"
        >
          + Create Product
        </button>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                {product.sku && <span className="text-xs text-gray-500 font-mono">SKU: {product.sku}</span>}
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  product.type === 'Goods'
                    ? 'bg-emerald-100 text-emerald-800'
                    : product.type === 'Service'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {product.type}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-3">Category: {product.category}</p>

            <div className="mt-2 pt-3 border-t grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">Sales Price</p>
                <p className="font-semibold text-gray-800">${product.salesPrice}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">Cost Price</p>
                <p className="font-semibold text-gray-800">${product.costPrice}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">On Hand</p>
                <p className="font-semibold text-gray-800">{product.quantityOnHand ?? 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">New Product</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ergonomic Office Chair"
                  className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">SKU Code</label>
                <input
                  type="text"
                  placeholder="e.g. CHAIR-002"
                  className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Furniture"
                  className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Type</label>
                <select
                  className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newProduct.type}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, type: e.target.value as Product['type'] })
                  }
                >
                  <option value="Goods">Goods</option>
                  <option value="Service">Service</option>
                  <option value="Combo">Combo</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Sales Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newProduct.salesPrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, salesPrice: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Cost Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newProduct.costPrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, costPrice: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              {newProduct.type === 'Goods' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Initial Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newProduct.quantityOnHand}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, quantityOnHand: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              )}

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
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};