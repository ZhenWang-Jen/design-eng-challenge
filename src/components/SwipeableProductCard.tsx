"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { SearchItem } from "@/types";

interface SwipeableProductCardProps {
  product: SearchItem;
  onLike: () => void;
  onSkip: () => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const getDummyInfo = (product: SearchItem) => {
  // Example: fun fact and a 'read more' URL
  return {
    fact: `Did you know? The average rating for ${product.category} products is 4.5 stars!`,
    review: `"This ${product.title.split(' ')[0]} changed my life! Highly recommend to anyone looking for quality."`,
    url: `https://www.google.com/search?q=${encodeURIComponent(product.title + ' ' + product.category)}`
  };
};

const cardHeight = 400;

const SwipeableProductCard: React.FC<SwipeableProductCardProps> = ({ product, onLike, onSkip }) => {
  const [flipped, setFlipped] = useState(false);
  const [swipe, setSwipe] = useState<null | 'left' | 'right'>(null);
  const dummy = getDummyInfo(product);

  // When swipe state changes, trigger handler after animation
  React.useEffect(() => {
    if (swipe) {
      const timeout = setTimeout(() => {
        if (swipe === 'right') onLike();
        else if (swipe === 'left') onSkip();
        setSwipe(null);
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [swipe, onLike, onSkip]);

  return (
    <div
      className="relative w-full max-w-md mx-auto flex flex-col items-center"
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative w-full"
        style={{ height: cardHeight, transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0, x: swipe === 'right' ? 500 : swipe === 'left' ? -500 : 0, opacity: swipe ? 0 : 1 }}
        transition={{ duration: swipe ? 0.35 : 0.6, ease: [0.4, 0.2, 0.2, 1] }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            height: cardHeight,
          }}
        >
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} className="w-40 h-40 object-cover rounded mb-4" />
          ) : (
            <div className="w-40 h-40 bg-gray-200 rounded mb-4" />
          )}
          <div className="font-bold text-lg mb-1 text-center">{product.title}</div>
          {product.price !== undefined && (
            <div className="text-blue-600 font-bold mb-1 text-lg">${product.price.toFixed(2)}</div>
          )}
          <div className="flex flex-wrap gap-1 mb-2 justify-center">
            {product.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{tag}</span>
            ))}
          </div>
          {product.rating !== undefined && (
            <div className="text-yellow-500 text-sm mb-2">★ {product.rating}</div>
          )}
          <div className="flex gap-4 mt-4">
            <button
              className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold text-lg shadow hover:bg-red-200"
              onClick={() => setSwipe('left')}
              aria-label="Skip"
              disabled={!!swipe}
            >
              ❌
            </button>
            <button
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full font-bold text-lg shadow hover:bg-gray-200"
              onClick={() => setFlipped(true)}
              aria-label="Details"
              disabled={!!swipe}
            >
              ℹ️
            </button>
            <button
              className="bg-green-100 text-green-600 px-4 py-2 rounded-full font-bold text-lg shadow hover:bg-green-200"
              onClick={() => setSwipe('right')}
              aria-label="Like"
              disabled={!!swipe}
            >
              ❤️
            </button>
          </div>
        </div>
        {/* Back Side */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-lg p-6 flex flex-col items-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            height: cardHeight,
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
            onClick={() => setFlipped(false)}
            disabled={!!swipe}
          >
            Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SwipeableProductCard; 