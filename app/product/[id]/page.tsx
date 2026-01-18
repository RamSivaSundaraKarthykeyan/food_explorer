import { fetchProductByBarcode, getNutrient } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HomeIcon } from 'lucide-react';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProductByBarcode(id);

  if (!product) notFound();
  const n = product.nutriments;

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 md:px-10 py-8">
      <Link href="/" className="inline-flex items-center gap-2 mb-8 p-3 bg-white border-2 border-slate-900 rounded-xl font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-1 hover:shadow-none transition-all">
        <HomeIcon className="w-4 text-slate-900 h-4" /> <span className='text-slate-900'>Back to Gallery</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 md:p-12 rounded-3xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] max-w-[1600px] mx-auto">
        <div className="flex justify-center items-center bg-slate-100 rounded-2xl p-6 border-2 border-slate-200 h-fit lg:sticky lg:top-10">
          <img src={product.image_url || '/placeholder.png'} alt={product.product_name} className="max-h-[300px] md:max-h-[500px] object-contain drop-shadow-2xl" />
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-4 lowercase first-letter:uppercase">{product.product_name || 'Unknown Product'}</h1>
            <div className="inline-block px-6 py-2 bg-blue-100 border-2 border-blue-600 text-blue-800 rounded-full font-black text-xs uppercase">{product.categories?.split(',')[0]}</div>
          </div>

          <section>
            <h2 className="text-xl font-black uppercase mb-3 underline decoration-yellow-400 text-slate-900 decoration-4">Ingredients</h2>
            <p className="text-slate-700 leading-relaxed font-bold">{product.ingredients_text || "No ingredients data found."}</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 uppercase mb-6">Nutritional Facts (100g)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Energy', val: `${getNutrient(n, 'energy')} kcal` },
                { label: 'Fat', val: `${getNutrient(n, 'fat')}g` },
                { label: 'Carbs', val: `${getNutrient(n, 'carbohydrates')}g` },
                { label: 'Proteins', val: `${getNutrient(n, 'proteins')}g` },
                { label: 'Sugar', val: `${getNutrient(n, 'sugars')}g` },
                { label: 'Salt', val: `${getNutrient(n, 'salt')}g` },
              ].map((item) => (
                <div key={item.label} className="p-4 border-2 border-slate-900 rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">{item.label}</span>
                  <span className="text-lg font-black text-slate-900">{item.val}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}