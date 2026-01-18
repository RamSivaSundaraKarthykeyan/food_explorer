import Link from 'next/link';
import { Product } from '@/types';


export default function ProductCard({product}: {product: Product}){
    const gradeColors: Record<string, string> = {
        a: 'bg-green-600',
        b: 'bg-green-400',
        c: 'bg-yellow-400',
        d: 'bg-orange-400',
        e: 'bg-red-500',
    };

    const grade = product.nutrition_grades?.toLowerCase() || 'unknown';

    return(
        <Link href={`/product/${product.code}`}
        className="group border-2 border-slate-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
        >
            <div className="relative border-2 h-48 w-full bg-gray-100">
                {product.image_url ? (<img 
                src={product.image_url} 
                alt={product.product_name} 
                className="w-full h-full object-contain p-2"
                 />): (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                 )
                }
                {product.nutrition_grades && (
                    <span className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded uppercase ${gradeColors[grade] || 'bg-gray-400'}`}>
                        Grade {grade}
                    </span>
                )}
            </div>
            <div className='p-4'>
                <h3 className='font-bold text-gray-800 truncate group-hover:text-blue-600'>
                    {product.product_name || 'Unnamed Product'}
                </h3>
                <p className='text-sm text-gray-500 truncate'>{product.categories?.split(',')[0]}</p>
            </div>
        </Link>
    );
}