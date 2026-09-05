import React, { useState } from 'react';
import type { Contact } from '../../types';

export const ContactsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM' | 'CARD'>('LIST');
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Azure Furniture',
      type: 'Vendor',
      email: 'azure@furniture.com',
      mobile: '+91 9876543210',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001',
    },
  ]);

  const [formData, setFormData] = useState<Omit<Contact, 'id'>>({
    name: '',
    type: 'Customer',
    email: '',
    mobile: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleSave = () => {
    setContacts([...contacts, { ...formData, id: Date.now().toString() }]);
    setViewMode('LIST');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border">
        <h1 className="text-2xl font-bold">Contact Master</h1>
        <div className="flex gap-2">
          {viewMode !== 'FORM' && (
            <button
              onClick={() => setViewMode('FORM')}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              + New Contact
            </button>
          )}
          {viewMode !== 'LIST' && (
            <button
              onClick={() => setViewMode('LIST')}
              className="px-4 py-2 border border-gray-400 font-semibold rounded-lg hover:bg-gray-100"
            >
              Back to List
            </button>
          )}
        </div>
      </div>

      {viewMode === 'LIST' && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b text-sm font-semibold text-gray-700">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Email</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">City</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {contacts.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">{c.type}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.mobile}</td>
                  <td className="p-3">{c.city}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setViewMode('CARD')}
                      className="text-blue-600 hover:underline text-xs font-bold"
                    >
                      View Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'FORM' && (
        <div className="bg-white p-6 rounded-xl border shadow-sm max-w-2xl mx-auto">
          <h2 className="text-lg font-bold mb-4">Create / Edit Contact</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Contact Name</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Type</label>
              <select
                className="w-full border p-2 rounded"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as Contact['type'] })
                }
              >
                <option value="Customer">Customer</option>
                <option value="Vendor">Vendor</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Email</label>
              <input
                type="email"
                className="w-full border p-2 rounded"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Mobile</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">City</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">State</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setViewMode('LIST')}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700"
            >
              Save Contact
            </button>
          </div>
        </div>
      )}

      {viewMode === 'CARD' && contacts[0] && (
        <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-md mx-auto flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xl">
            IMG
          </div>
          <div className="space-y-1 text-sm">
            <h3 className="text-xl font-bold">{contacts[0].name}</h3>
            <p className="text-gray-500 font-semibold">{contacts[0].type}</p>
            <p>📧 {contacts[0].email}</p>
            <p>📱 {contacts[0].mobile}</p>
            <p>📍 {contacts[0].city}, {contacts[0].state}</p>
          </div>
        </div>
      )}
    </div>
  );
};