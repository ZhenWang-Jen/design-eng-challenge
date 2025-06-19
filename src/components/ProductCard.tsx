import React from 'react';
import { SearchItem } from '@/types';
import { motion } from 'framer-motion';
import { Heart, Heart as HeartFilled, Info } from 'lucide-react';
import Image from 'next/image';

type ProductCardProps = {
  product: SearchItem;
  isFlipped: boolean;
  onFlip: () => void;
  onSave: () => void;
  isSaved: boolean;
  dummyInfo: {
    fact: string;
    review: string;
    url: string;
  };
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFlipped,
  onFlip,
  onSave,
  isSaved,
  dummyInfo
}) => {
  return (
    <div 
      className="relative" 
      style={{ perspective: 1200, minHeight: 380 }}
      role="article"
      aria-label={`Product: ${product.title}`}
    >
      <motion.div
        className="relative w-full"
        style={{ height: 360, transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0.2, 0.2, 1] }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 w-full h-full bg-white rounded-xl shadow-sm p-4 flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
          role="region"
          aria-label="Product details"
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={320}
              height={160}
              className="w-full h-40 object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 rounded-t-lg flex items-center justify-center text-gray-400" aria-hidden="true">
              No Image
            </div>
          )}
          <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold text-blue-600" aria-label={`Price: $${product.price?.toFixed(2) ?? 'N/A'}`}>
              ${product.price?.toFixed(2) ?? 'N/A'}
            </span>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`rounded-full p-2 ${
                  isSaved
                    ? 'bg-red-500 text-white'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
                onClick={onSave}
                aria-label={isSaved ? `Remove ${product.title} from saved items` : `Save ${product.title}`}
                aria-pressed={isSaved}
              >
                {isSaved ? (
                  <HeartFilled fill="currentColor" size={20} />
                ) : (
                  <Heart size={20} />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full p-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
                onClick={onFlip}
                aria-label="View more details"
                aria-expanded={isFlipped}
                aria-controls={`product-details-${product.id}`}
              >
                <Info size={20} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          id={`product-details-${product.id}`}
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow p-4 flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          role="region"
          aria-label="Additional product information"
        >
          <div className="font-bold text-lg mb-4 text-center text-gray-800">
            Discover More
          </div>
          <div className="text-blue-900 text-center mb-4 italic">
            {dummyInfo.fact}
          </div>
          <div className="text-gray-700 text-center mb-4">{dummyInfo.review}</div>
          <a
            href={dummyInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition text-center"
            aria-label={`Read more about ${product.title} (opens in new tab)`}
          >
            Read more about this product
          </a>
          <div className="flex-1" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-4 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
            onClick={onFlip}
            aria-label="Return to product details"
          >
            Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductCard; 