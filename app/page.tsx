'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchCategories } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/Skeleton';
import { HomeIcon, SearchIcon } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('unique_scans_n');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    fetchCategories().then(setCategories); 
  }, []);

  const loadProducts = useCallback(async (isNewSearch = false) => {
    setLoading(true);
    try {
      const currentPage = isNewSearch ? 1 : page;
      const data = await fetchProducts(currentPage, query, selectedCategory, sortBy);
      setProducts((prev) => isNewSearch ? data.products : [...prev, ...data.products]);
      setPage((prev) => isNewSearch ? 2 : prev + 1);
    } finally { 
      setLoading(false); 
    }
  }, [page, query, selectedCategory, sortBy]);

  useEffect(() => { 
    loadProducts(true); 
  }, [selectedCategory, sortBy]);

  const resetFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSortBy('unique_scans_n');
    loadProducts(true);
  };

  return (
    <main className="w-full min-h-screen bg-gray-50 px-4 md:px-10 py-8">
      {/* Header Section */}
      <div className="flex gap-4 items-center justify-between mb-8">
        <button 
          onClick={resetFilters}
          className="p-3 bg-white border-2 border-slate-900 rounded-xl hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
        >
          <HomeIcon className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Food Explorer
        </h1>
        <div className="w-12 hidden md:block"></div>
      </div>

      {/* Filter & Search Card */}
      <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] mb-12">
        <form onSubmit={(e) => { e.preventDefault(); loadProducts(true); }} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search food products..."
              className="w-full p-4 border-2 border-slate-900 rounded-xl outline-none text-slate-900 placeholder:text-slate-500 font-bold"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <SearchIcon className="absolute right-4 top-4 text-slate-900" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-bold">
            <div className="space-y-2">
              <label className="text-xs text-slate-900 font-black uppercase">Category</label>
              <select 
                className="w-full p-3 border-2 border-slate-900 rounded-xl text-slate-900 bg-white" 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-900 font-black uppercase">Sort By</label>
              <select 
                className="w-full p-3 border-2 border-slate-900 rounded-xl text-slate-900 bg-white" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="unique_scans_n">Most Popular</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="grade_asc">Healthiest First (A-E)</option>
                <option value="grade_desc">Lowest Grade (E-A)</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, idx) => (
          <ProductCard key={`${product.code}-${idx}`} product={product} />
        ))}
        {loading && Array(8).fill(0).map((_, i) => <Skeleton key={i} />)}
      </div>

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <div className="mt-16 text-center pb-12">
          <button 
            onClick={() => loadProducts()} 
            className="px-12 py-4 rounded-xl text-slate-900 border-2 border-slate-900 font-black uppercase tracking-widest hover:translate-y-1 hover:shadow-none transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-1"
          >
            Load More
          </button>
        </div>
      )}
    </main>
  );
}