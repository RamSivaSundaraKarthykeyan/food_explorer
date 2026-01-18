'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchCategories } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Filters & Search State
  const [query, setQuery] = useState('');
  const [barcode, setBarcode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('unique_scans_n'); // Default: Popularity
  
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Load Categories once on mount
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const loadProducts = useCallback(async (isNewSearch = false) => {
    setLoading(true);
    try {
      const currentPage = isNewSearch ? 1 : page;
      // We pass query, category, and sort to our API helper
      const data = await fetchProducts(currentPage, query || barcode, selectedCategory, sortBy);
      
      if (isNewSearch) {
        setProducts(data.products);
        setPage(2);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
        setPage((prev) => prev + 1);
      }
      setHasMore(data.products.length > 0);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [page, query, barcode, selectedCategory, sortBy]);

  // Trigger search when filters or sort changes
  useEffect(() => {
    loadProducts(true);
  }, [selectedCategory, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts(true);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Food Product Explorer</h1>

      <div className="bg-gray-50 p-6 rounded-xl mb-8 shadow-sm border">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Text Search */}
          <input
            type="text"
            placeholder="Search by name (e.g. Oreo)..."
            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setBarcode(''); }}
          />
          {/* Barcode Search */}
          <input
            type="text"
            placeholder="Search by Barcode..."
            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={barcode}
            onChange={(e) => { setBarcode(e.target.value); setQuery(''); }}
          />
          <button type="submit" className="md:col-span-2 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Apply Search
          </button>
        </form>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Filter */}
          <select 
            className="flex-1 p-3 border rounded-lg bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort Functionality */}
          <select 
            className="flex-1 p-3 border rounded-lg bg-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="unique_scans_n">Sort by: Popularity</option>
            <option value="product_name">Sort by: Name (A-Z)</option>
            <option value="nutrition_grades">Sort by: Nutrition Grade</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard key={`${product.code}-${index}`} product={product} />
          ))
        ) : (
          !loading && <p className="col-span-full text-center text-gray-500">No products found.</p>
        )}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <button onClick={() => loadProducts()} disabled={loading} className="bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-gray-900 disabled:opacity-50">
            {loading ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}
    </main>
  );
}