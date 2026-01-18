import { fetchProductByBarcode } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await fetchProductByBarcode(params.id);

  if (!product) {
    notFound(); // Triggers the Next.js 404 page
  }

  const nutrients = product.nutrients;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Search
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-sm border">
        {/* Left: Image */}
        <div className="flex justify-center bg-gray-50 rounded-xl p-4">
          <img 
            src={product.image_url || '/placeholder.png'} 
            alt={product.product_name} 
            className="max-h-[500px] object-contain"
          />
        </div>

        {/* Right: Info */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{product.product_name}</h1>
          <p className="text-xl text-gray-500 mb-6">{product.categories}</p>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.ingredients_text || "Ingredients information not available."}
            </p>
          </div>

          {/* Nutrition Table */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Nutritional Values (per 100g)</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border-b">Nutrient</th>
                    <th className="p-3 border-b">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b">Energy</td>
                    <td className="p-3 border-b">{nutrients?.energy_100g} kcal</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b">Fat</td>
                    <td className="p-3 border-b">{nutrients?.fat_100g}g</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b">Carbohydrates</td>
                    <td className="p-3 border-b">{nutrients?.carbohydrates_100g}g</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b">Proteins</td>
                    <td className="p-3 border-b">{nutrients?.protiens_100g}g</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Labels */}
          {product.labels_tags && product.labels_tags.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Labels</h2>
              <div className="flex flex-wrap gap-2">
                {product.labels_tags.map((label) => (
                  <span key={label} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full border border-green-200">
                    {label.replace('en:', '').replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}