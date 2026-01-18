'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Function to load products
  const loadProducts = useCallback(async (isNewSearch = false) => {
    setLoading(true);
    try {
      const currentPage = isNewSearch ? 1 : page;
      const data = await fetchProducts(currentPage, query);
      
      if (isNewSearch) {
        setProducts(data.products);
        setPage(2);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
        setPage((prev) => prev + 1);
      }
      
      // If the API returns fewer products than requested, we've reached the end
      setHasMore(data.products.length > 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  // Initial load
  useEffect(() => {
    loadProducts(true);
  }, []);

  // Handle Search Submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts(true);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Food Product Explorer</h1>

      {/* Search Section */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search for products (e.g. Oreo, Milk)..."
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          // Use product code + index as key because some API items might have duplicate codes
          <ProductCard key={`${product.code}-${index}`} product={product} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={() => loadProducts()}
            disabled={loading}
            className="bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}
    </main>
  );
}