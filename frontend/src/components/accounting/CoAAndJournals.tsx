import React, { useEffect, useState } from 'react';
import { journalService } from '../../services/api';

export const CoAAndJournals = () => {
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    journalService.getAll()
      .then((data) => setJournals(data))
      .catch((err) => console.error('Failed to fetch journal entries:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading Journal Entries...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Journal Entries</h2>
      {/* Map through journals */}
      {journals.map((entry) => (
        <div key={entry.id} className="border p-3 my-2 rounded">
          <p className="font-semibold">{entry.name || entry.reference}</p>
          <p className="text-sm text-gray-600">Amount: ${entry.amount}</p>
        </div>
      ))}
    </div>
  );
};