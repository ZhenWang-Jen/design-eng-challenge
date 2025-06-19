"use client";
import React, { useState, useEffect, useCallback } from "react";
import Filters from "./Filters";
import ResultsGrid from "./ResultsGrid";
import { SearchFilters, SearchResponse, SearchItem } from "@/types";
import SwipeableProductCard from './SwipeableProductCard';
import { X } from 'lucide-react';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const defaultFilters: SearchFilters = {
  query: "",
  category: undefined,
  tags: [],
  priceRange: undefined,
  sortBy: "relevance",
  featured: undefined,
};

const SearchBar: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [facets, setFacets] = useState<SearchResponse["facets"] | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [liked, setLiked] = useState<SearchItem[]>([]);
  const [skipped, setSkipped] = useState<SearchItem[]>([]);
  const [saved, setSaved] = useState<SearchItem[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');

  // Debounce search input
  const debouncedFilters = useDebounce(filters, 350);

  // Build query string from filters
  const buildQuery = (f: SearchFilters, page: number, facets: SearchResponse["facets"] | null) => {
    const params = new URLSearchParams();
    if (f.query) params.append("query", f.query);
    const allCategories = facets?.categories.map(cat => cat.name) || [];
    if (
      f.category &&
      f.category.length > 0 &&
      f.category.length !== allCategories.length
    ) {
      params.append("category", f.category.join(","));
    }
    if (f.tags && f.tags.length > 0) params.append("tags", f.tags.join(","));
    if (f.sortBy) params.append("sortBy", f.sortBy);
    if (f.priceRange) {
      params.append("minPrice", String(f.priceRange.min));
      params.append("maxPrice", String(f.priceRange.max));
    }
    if (f.featured !== undefined) params.append("featured", String(f.featured));
    params.append("page", String(page));
    params.append("limit", "9"); // 9 per page
    return params.toString();
  };

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the current facets only for the category logic
      let query;
      if (facets) {
        query = buildQuery(debouncedFilters, page, facets);
      } else {
        query = buildQuery(debouncedFilters, page, null);
      }
      const res = await fetch(`/api/search?${query}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: SearchResponse = await res.json();
      setResults(data.items);
      setFacets(data.facets);
      setSuggestions(data.suggestions);
      setTotal(data.total);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page to 1 on filter/search change
  useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);

  // Reset index when results change
  useEffect(() => {
    setCurrentIdx(0);
    setLiked([]);
    setSkipped([]);
  }, [results]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, query: e.target.value }));
  };

  const handleFiltersChange = (updated: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleRemoveFilter = (key: keyof SearchFilters, value?: any) => {
    setFilters((prev) => {
      if (key === "tags" && value) {
        return { ...prev, tags: prev.tags.filter((t) => t !== value) };
      }
      if (key === "category" && value) {
        return { ...prev, category: prev.category?.filter((c) => c !== value) };
      }
      if (key === "priceRange") {
        return { ...prev, priceRange: undefined };
      }
      if (key === "featured") {
        return { ...prev, featured: undefined };
      }
      if (key === "sortBy") {
        return { ...prev, sortBy: "relevance" };
      }
      return prev;
    });
  };

  // Handlers for swipe actions
  const handleLike = () => {
    if (results[currentIdx]) setLiked((prev) => [...prev, results[currentIdx]]);
    // Save to saved list if not already present
    if (results[currentIdx] && !saved.some(item => item.id === results[currentIdx].id)) {
      setSaved(prev => [...prev, results[currentIdx]]);
    }
    setCurrentIdx((idx) => idx + 1);
  };

  const handleSkip = () => {
    if (results[currentIdx]) setSkipped((prev) => [...prev, results[currentIdx]]);
    setCurrentIdx((idx) => idx + 1);
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Alt + L to like, Alt + S to skip
      if (e.altKey) {
        if (e.key.toLowerCase() === 'l') {
          e.preventDefault();
          handleLike();
        } else if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          handleSkip();
        }
      }
      // Alt + V to toggle view mode
      if (e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setViewMode(prev => prev === 'card' ? 'grid' : 'card');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleLike, handleSkip]);

  // Add tooltips for keyboard shortcuts
  const keyboardShortcuts = [
    { key: 'Alt + L', action: 'Like' },
    { key: 'Alt + S', action: 'Skip' },
    { key: 'Alt + V', action: 'Toggle View' },
    { key: '/', action: 'Command Palette' }
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 my-8 p-8" role="search">
      {/* Keyboard shortcuts tooltip */}
      <div className="absolute top-2 right-2 text-xs text-gray-500" role="complementary" aria-label="Keyboard shortcuts">
        {keyboardShortcuts.map(({ key, action }) => (
          <span key={key} className="mr-2">
            <kbd className="px-1 py-0.5 bg-gray-100 rounded">{key}</kbd> {action}
          </span>
        ))}
      </div>
      {/* Saved Drawer/Modal */}
      {showSaved && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="saved-products-title"
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowSaved(false)}
              aria-label="Close saved products"
            >
              <X size={24} />
            </button>
            <h2 id="saved-products-title" className="text-xl font-bold mb-4 text-center">Saved Products</h2>
            {saved.length === 0 ? (
              <div className="text-gray-500 text-center" role="status">No saved products yet.</div>
            ) : (
              <ul className="space-y-4 max-h-96 overflow-y-auto" role="list">
                {saved.map(item => (
                  <li key={item.id} className="flex items-center gap-4 border-b pb-2">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-14 h-14 object-cover rounded" />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 rounded" aria-hidden="true" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 line-clamp-1">{item.title}</div>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(item.title + ' ' + item.category)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-xs hover:underline"
                        aria-label={`View more about ${item.title}`}
                      >
                        View more
                      </a>
                    </div>
                    <button
                      className="ml-2 text-red-400 hover:text-red-600"
                      onClick={() => handleRemoveSaved(item.id)}
                      aria-label={`Remove ${item.title} from saved items`}
                    >
                      <X size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {/* Search Input */}
      <div className="relative mb-4">
        <label htmlFor="search-input" className="sr-only">Search products</label>
        <input
          id="search-input"
          type="text"
          className="w-full border rounded px-4 py-2 text-gray-800 placeholder-gray-600"
          placeholder="Search products..."
          value={filters.query}
          onChange={handleInputChange}
          aria-label="Search products"
          aria-expanded={suggestions.length > 0}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
        />
        {/* Autocomplete suggestions */}
        {suggestions.length > 0 && filters.query && (
          <ul 
            id="search-suggestions"
            className="absolute left-0 right-0 w-full bg-white border border-gray-200 rounded shadow z-50 max-h-60 overflow-y-auto mt-1"
            role="listbox"
          >
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="px-4 py-2 text-gray-800 font-medium hover:bg-gray-100 cursor-pointer truncate"
                onClick={() => setFilters((prev) => ({ ...prev, query: s }))}
                role="option"
                aria-selected={false}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Filters */}
      <Filters
        filters={filters}
        facets={facets}
        onChange={handleFiltersChange}
        onReset={() => setFilters(defaultFilters)}
      />
      {/* Active Filter Chips */}
      <div className="my-4 flex flex-wrap gap-2">
        {/* Category chips */}
        {filters.category && filters.category.map((cat) => (
          <span key={cat} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            {cat}
            <button onClick={() => handleRemoveFilter("category", cat)}>×</button>
          </span>
        ))}
        {/* Tag chips */}
        {filters.tags.map((tag) => (
          <span key={tag} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            {tag}
            <button onClick={() => handleRemoveFilter("tags", tag)}>×</button>
          </span>
        ))}
        {/* Price range chip */}
        {filters.priceRange && (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            ${filters.priceRange.min} - ${filters.priceRange.max}
            <button onClick={() => handleRemoveFilter("priceRange")}>×</button>
          </span>
        )}
        {/* Featured chip */}
        {filters.featured && (
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            Featured
            <button onClick={() => handleRemoveFilter("featured")}>×</button>
          </span>
        )}
        {/* Sort chip (if not default) */}
        {filters.sortBy !== "relevance" && (
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            {filters.sortBy}
            <button onClick={() => handleRemoveFilter("sortBy")}>×</button>
          </span>
        )}
      </div>
      {/* View mode toggle */}
      <div className="flex items-center justify-between mb-4">
        <div 
          className="flex items-center bg-gray-100 rounded-full px-1 py-1 border w-fit"
          role="radiogroup"
          aria-label="View mode"
        >
          <button
            className={`px-4 py-1 rounded-full font-semibold transition-colors duration-200 ${viewMode === 'card' ? 'bg-blue-600 text-white shadow' : 'text-gray-700'}`}
            onClick={() => setViewMode('card')}
            role="radio"
            aria-checked={viewMode === 'card'}
            aria-label="Meet Your Match view"
          >
            Meet Your Match
          </button>
          <button
            className={`px-4 py-1 rounded-full font-semibold transition-colors duration-200 ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow' : 'text-gray-700'}`}
            onClick={() => setViewMode('grid')}
            role="radio"
            aria-checked={viewMode === 'grid'}
            aria-label="See the Crowd view"
          >
            See the Crowd
          </button>
        </div>
        <button
          className="px-3 py-1 rounded border bg-green-100 text-green-700 hover:bg-green-200 font-semibold"
          onClick={() => setShowSaved(true)}
          aria-label={`View saved products (${saved.length} items)`}
        >
          Saved ({saved.length})
        </button>
      </div>
      {/* Results area: Card or Grid */}
      {viewMode === 'card' ? (
        <div className="flex flex-col items-center min-h-[400px]" role="region" aria-label="Product matches">
          {loading ? (
            <div className="text-center py-8 text-gray-500" role="status">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500" role="alert">{error}</div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-gray-400" role="status">No results found.</div>
          ) : currentIdx < results.length ? (
            <SwipeableProductCard
              product={results[currentIdx]}
              onLike={handleLike}
              onSkip={handleSkip}
            />
          ) : (
            <div className="text-center py-8 text-green-600 font-semibold" role="status">No more matches! 🎉</div>
          )}
          {/* Progress indicator and start over */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-gray-600" role="status">
              {Math.min(currentIdx + 1, results.length)} of {results.length} matches
            </span>
            <button
              className="px-3 py-1 rounded border bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={() => setCurrentIdx(0)}
              disabled={results.length === 0}
              aria-label="Start over with matches"
            >
              Start Over
            </button>
          </div>
        </div>
      ) : (
        <ResultsGrid
          products={results}
          loading={loading}
          error={error}
          onSave={item => {
            if (!saved.some(s => s.id === item.id)) setSaved(prev => [...prev, item]);
          }}
          saved={saved.map(s => s.id)}
        />
      )}
    </div>
  );
};

export default SearchBar; 