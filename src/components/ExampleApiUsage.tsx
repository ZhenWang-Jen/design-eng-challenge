'use client';

import { useState } from 'react';
import { SearchResponse } from '@/types';

// Example component showing how to use the search API
// You can delete this file and build your own components from scratch!

export default function ExampleApiUsage() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/search?query=headphones&sortBy=price-asc');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">API Usage Example</h3>
      
      <button
        onClick={handleSearch}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Searching...' : 'Test Search API'}
      </button>

      {results && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Found {results.total} results
          </p>
          <div className="space-y-2">
            {results.items.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-gray-600">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        className="w-full border border-gray-300 bg-gray-50 rounded px-4 py-2 text-gray-800 placeholder-gray-500"
      />
    </div>
  );
} 