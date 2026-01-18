import { fetchProductByBarcode } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HomeIcon } from 'lucide-react';

// Next.js 15 requires params to be awaited
export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Unwrapping the params promise
  const { id } = await params;
  
  // 2. Fetching the product using the unwrapped id
  const product = await fetchProductByBarcode(id);

  if (!product) {
    notFound();
  }

  const nutrients = product.nutrients;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl min-h-screen bg-gray-50">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 mb-8 p-3 bg-white border-2 border-slate-900 rounded-xl font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-1 hover:shadow-none transition-all"
      >
        <HomeIcon className="w-4 h-4 text-slate-900" />
        <span className='text-slate-900'>Back to Gallery</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-3xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
        {/* Left Side: High Contrast Image Container */}
        <div className="flex justify-center bg-slate-100 rounded-2xl p-6 border-2 border-slate-200">
          <img 
            src={product.image_url || '/placeholder.png'} 
            alt={product.product_name} 
            className="max-h-[450px] object-contain drop-shadow-2xl"
          />
        </div>

        {/* Right Side: Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-black text-slate-900 leading-tight">
            {product.product_name || 'Unknown Product'}
          </h1>
          
          <div className="inline-block px-4 py-1 bg-blue-100 border-2 border-blue-600 text-blue-800 rounded-full font-bold text-sm">
            {product.categories?.split(',')[0]}
          </div>

          <section>
            <h2 className="text-xl font-black text-slate-900 uppercase mb-2">Ingredients</h2>
            <p className="text-slate-700 leading-relaxed font-medium">
              {product.ingredients_text || "Ingredients list unavailable for this item."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 uppercase mb-4">Nutritional Facts (100g)</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Energy', val: `${nutrients?.energy_100g ?? 0} kcal` },
                { label: 'Fat', val: `${nutrients?.fat_100g ?? 0}g` },
                { label: 'Carbs', val: `${nutrients?.carbohydrates_100g ?? 0}g` },
                { label: 'Proteins', val: `${nutrients?.protiens_100g ?? 0}g` },
              ].map((item) => (
                <div key={item.label} className="p-3 border-2 border-slate-900 rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <p className="text-xs font-black text-slate-500 uppercase">{item.label}</p>
                  <p className="text-lg font-extrabold text-slate-900">{item.val}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}