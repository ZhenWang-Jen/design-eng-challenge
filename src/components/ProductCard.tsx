import React from 'react';
import { SearchItem } from '@/types';

type ProductCardProps = {
  product: SearchItem;
  hideActions?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, hideActions = false }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-lg relative group">
      {/* Featured badge */}
      {product.featured && (
        <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow group-hover:scale-110 transition-transform">Featured</span>
      )}
      {/* Product image */}
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.title} className="w-32 h-32 object-cover rounded mb-3" />
      ) : (
        <div className="w-32 h-32 bg-gray-200 rounded mb-3" />
      )}
      {/* Product title */}
      <div className="font-semibold text-center mb-1 text-base line-clamp-2 min-h-[2.5em]">{product.title}</div>
      {/* Product price */}
      {product.price !== undefined && (
        <div className="text-blue-600 font-bold mb-1 text-lg">${product.price.toFixed(2)}</div>
      )}
      {/* Product tags */}
      <div className="flex flex-wrap gap-1 mb-2 justify-center">
        {product.tags.map(tag => (
          <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{tag}</span>
        ))}
      </div>
      {/* Product rating */}
      {product.rating !== undefined && (
        <div className="text-yellow-500 text-sm">★ {product.rating}</div>
      )}
      {/* Hide actions in grid if requested */}
      {!hideActions && (
        <div className="mt-2">{/* Placeholder for future actions */}</div>
      )}
    </div>
  );
};

export default ProductCard; 