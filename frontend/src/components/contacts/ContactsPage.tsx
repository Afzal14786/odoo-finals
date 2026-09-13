import React, { useEffect, useState } from 'react';
import { contactService } from '../../services/api';

export const ContactsPage = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Fetch initial data from PostgreSQL
  useEffect(() => {
    contactService.getAll()
      .then((data) => setContacts(data))
      .catch((err) => console.error('Error fetching contacts:', err))
      .finally(() => setLoading(false));
  }, []);

  // Handle new contact form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const newContact = await contactService.create({ name, email, type: 'Customer' });
      setContacts((prev) => [...prev, newContact]);
      setName('');
      setEmail('');
    } catch (err) {
      console.error('Error adding contact:', err);
    }
  };

  if (loading) return <div className="p-4">Loading contacts from database...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Contacts</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Contact Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Contact
        </button>
      </form>

      <ul className="divide-y border rounded p-4">
        {contacts.map((c) => (
          <li key={c.id || c.name} className="py-2">
            <strong>{c.name}</strong> {c.email ? `— ${c.email}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
};