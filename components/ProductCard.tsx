import Link from 'next/link';
import { Product } from '@/types';


export default function ProductionCard({product}: {product: Product}){
    const gradeColors: Record<string, string> = {
        a: 'bg-green-600',
        b: 'bg-green-400',
        c: 'bg-yellow-400',
        d: 'bg-orange-400',
        e: 'bg-red-500',
    };

    const grade = product.nutrition_grades?.toLowerCase() || 'unknown';
}