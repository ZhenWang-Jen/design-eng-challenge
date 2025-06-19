"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchItem } from '@/types';

const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Keyboard shortcut: / or Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.items || []);
      } catch (e) {
        setResults([]);
        throw e;
      } finally {
        setLoading(false);
      }
    }, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => { setSelected(0); }, [query, open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelected(s => Math.min(s + 1, results.length - 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setSelected(s => Math.max(s - 1, 0));
      e.preventDefault();
    } else if (e.key === 'Enter' && results[selected]) {
      // TODO: handle selection
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="mt-32 w-full max-w-lg bg-white rounded-xl shadow-2xl p-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <input
              ref={inputRef}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
              placeholder="Search products, categories, actions..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {loading && <div className="text-xs text-gray-500">Loading...</div>}
            <div className="max-h-72 overflow-y-auto">
              {results.length === 0 && (
                <div className="text-gray-400 px-4 py-6 text-center">No results</div>
              )}
              {results.map((r, i) => (
                <motion.div
                  key={r.id}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer mb-1 ${i === selected ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => setOpen(false)}
                >
                  <span className="flex-1 text-gray-800 font-medium">{r.title}</span>
                </motion.div>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-2 px-2">↑↓ to navigate, Enter to select, Esc to close</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette; 