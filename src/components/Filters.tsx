import React, { useState } from 'react';
import { SearchFilters, SearchResponse } from '@/types';
import MultiSelect from './MultiSelect';
import { AnimatePresence, motion } from 'framer-motion';

type FiltersProps = {
  filters: SearchFilters;
  facets: SearchResponse['facets'] | null;
  onChange: (updated: Partial<SearchFilters>) => void;
  onReset: () => void;
};

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
];

const Filters: React.FC<FiltersProps> = ({ filters, facets, onChange, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <div className="flex flex-wrap gap-4 mb-4 items-end w-full">
      {/* Category filter custom multi-select */}
      <div>
        <label className="block text-xs mb-1 font-semibold text-gray-800">Category</label>
        <MultiSelect
          options={facets?.categories.map(cat => ({ value: cat.name, label: `${cat.name} (${cat.count})` })) || []}
          selected={filters.category || []}
          onChange={catArr => onChange({ category: catArr })}
          placeholder="Select categories"
          className="text-gray-800 placeholder-gray-600 border-gray-300"
        />
      </div>
      {/* Price range slider */}
      <div>
        <label className="block text-xs mb-1 font-semibold text-gray-800">Price Range ($)</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            className="border border-gray-300 rounded px-2 py-1 w-20 text-gray-800 placeholder-gray-600"
            placeholder="Min"
            min={facets?.priceRange.min}
            max={facets?.priceRange.max}
            value={filters.priceRange?.min ?? (facets?.priceRange ? facets.priceRange.min : '')}
            onChange={e => onChange({ priceRange: { min: Number(e.target.value) || (facets?.priceRange ? facets.priceRange.min : 0), max: filters.priceRange?.max ?? (facets?.priceRange ? facets.priceRange.max : 0) } })}
          />
          <span className="block text-xs mb-1 font-semibold text-gray-800">-</span>
          <input
            type="number"
            className="border border-gray-300 rounded px-2 py-1 w-20 text-gray-800 placeholder-gray-600"
            placeholder="Max"
            min={facets?.priceRange.min}
            max={facets?.priceRange.max}
            value={filters.priceRange?.max ?? (facets?.priceRange ? facets.priceRange.max : '')}
            onChange={e => onChange({ priceRange: { min: filters.priceRange?.min ?? (facets?.priceRange ? facets.priceRange.min : 0), max: Number(e.target.value) || (facets?.priceRange ? facets.priceRange.max : 0) } })}
          />
        </div>
      </div>
      {/* Sort options dropdown */}
      <div>
        <label className="block text-xs mb-1 font-semibold text-gray-800">Sort By</label>
        <select
          className="border border-gray-300 rounded px-2 py-1 text-gray-800 placeholder-gray-600"
          value={filters.sortBy}
          onChange={e => onChange({ sortBy: e.target.value as SearchFilters['sortBy'] })}
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {/* More Filters button */}
      <div>
        <button
          type="button"
          className="px-3 py-1 rounded border bg-gray-100 text-gray-700 hover:bg-gray-200"
          onClick={() => setShowAdvanced((s) => !s)}
        >
          {showAdvanced ? 'Hide' : 'More'} Filters
        </button>
      </div>
      {/* Reset Filters button */}
      <div>
        <button
          type="button"
          className="px-3 py-1 rounded border bg-red-100 text-red-700 hover:bg-red-200 font-semibold"
          onClick={onReset}
        >
          Reset Filters
        </button>
      </div>
      {/* Animated Advanced filters: tags and featured */}
      <AnimatePresence initial={false}>
        {showAdvanced && (
          <motion.div
            className="flex flex-wrap gap-4 items-end w-full mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {/* Tag filter multi-select */}
            <div>
              <label className="block text-xs mb-1 font-semibold text-gray-800">Tags</label>
              <select
                className="border rounded px-2 py-1 text-gray-800 placeholder-gray-600"
                multiple
                value={filters.tags}
                onChange={e => {
                  const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                  onChange({ tags: selected });
                }}
                size={Math.min(4, facets?.tags.length || 1)}
              >
                {facets?.tags.map(tag => (
                  <option key={tag.name} value={tag.name}>{tag.name} ({tag.count})</option>
                ))}
              </select>
            </div>
            {/* Featured toggle */}
            <div className="flex items-center gap-1 mt-6">
              <input
                type="checkbox"
                id="featured"
                checked={!!filters.featured}
                onChange={e => onChange({ featured: e.target.checked ? true : undefined })}
              />
              <label htmlFor="featured" className="text-xs text-gray-800">Featured</label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Filters; 