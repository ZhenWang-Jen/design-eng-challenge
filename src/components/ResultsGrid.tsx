import ProductCard from './ProductCard';
import React, { useState } from 'react';
import { SearchItem } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
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
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-gray-100 rounded-lg h-64 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 text-red-500 bg-red-50 rounded-lg"
      >
        {error}
      </motion.div>
    );
  }

  if (!products.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg"
      >
        No results found. Try adjusting your filters.
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => {
          const isFlipped = flipped[product.id];
          const dummy = getDummyInfo(product);
          return (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: index * 0.05
              }}
              className="relative"
            >
              <ProductCard
                product={product}
                isFlipped={isFlipped}
                onFlip={() => setFlipped(prev => ({ ...prev, [product.id]: !prev[product.id] }))}
                onSave={() => onSave(product)}
                isSaved={saved.includes(product.id)}
                dummyInfo={dummy}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultsGrid; 