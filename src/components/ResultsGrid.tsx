import ProductCard from './ProductCard';
import React, { useState } from 'react';
import { SearchItem } from '@/types';
import { motion } from 'framer-motion';
import { Heart, Heart as HeartFilled, Info } from 'lucide-react';

type ResultsGridProps = {
  products: SearchItem[];
  loading: boolean;
  error: string | null;
  onSave: (item: SearchItem) => void;
  saved: string[]; // array of saved product ids
};

const getDummyInfo = (product: SearchItem) => {
  return {
    fact: `Did you know? The average rating for ${product.category} products is 4.5 stars!`,
    review: `"This ${product.title.split(' ')[0]} changed my life! Highly recommend to anyone looking for quality."`,
    url: `https://www.google.com/search?q=${encodeURIComponent(product.title + ' ' + product.category)}`
  };
};

const ResultsGrid: React.FC<ResultsGridProps> = ({ products, loading, error, onSave, saved }) => {
  const [flipped, setFlipped] = useState<{ [id: string]: boolean }>({});

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  if (!products.length) {
    return <div className="text-center py-8 text-gray-400">No results found.</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map(product => {
        const isFlipped = flipped[product.id];
        const dummy = getDummyInfo(product);
        return (
          <motion.div
            key={product.id}
            layout
            className="relative"
          >
            <div className="relative" style={{ perspective: 1200, minHeight: 380 }}>
              <motion.div
                className="relative w-full"
                style={{ height: 360, transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0.2, 0.2, 1] }}
              >
                {/* Front Side */}
                <div
                  className="absolute inset-0 w-full h-full p-4 flex flex-col items-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                  }}
                >
                  <ProductCard product={product} hideActions />
                  <div className="flex gap-2 mt-2">
                    <button
                      className={`rounded-full p-2 ${saved.includes(product.id) ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                      onClick={() => onSave(product)}
                      aria-label="Save"
                    >
                      {saved.includes(product.id) ? <HeartFilled fill="currentColor" size={20} /> : <Heart size={20} />}
                    </button>
                    <button
                      className="rounded-full p-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
                      onClick={() => setFlipped(f => ({ ...f, [product.id]: true }))}
                      aria-label="Details"
                    >
                      <Info size={20} />
                    </button>
                  </div>
                </div>
                {/* Back Side */}
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow p-4 flex flex-col items-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="font-bold text-lg mb-4 text-center">Discover More</div>
                  <div className="text-blue-900 text-center mb-4 italic">{dummy.fact}</div>
                  <div className="text-gray-700 text-center mb-4">{dummy.review}</div>
                  <a
                    href={dummy.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    Read more about this product
                  </a>
                  <div className="flex-1" />
                  <button
                    className="mt-4 px-4 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                    onClick={() => setFlipped(f => ({ ...f, [product.id]: false }))}
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ResultsGrid; 