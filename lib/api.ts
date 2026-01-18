import { APIResponse, Product } from "@/types"

const BASE_URL = "https://world.openfoodfacts.org"

export const fetchProducts = async (
    page = 1,
    query = '',
    category = '',
    sortField = 'unique_scans_n'
): Promise<APIResponse> => {
    
    const trimmedQuery = query.trim();
    
    // Auto-Sanitize: Extract digits only to check if it's a barcode
    const numericOnly = trimmedQuery.replace(/\D/g, ''); 
    const isBarcode = numericOnly.length >= 8 && numericOnly.length <= 14;

    // Direct Barcode Lookup (v0 is more stable for exact matches)
    if (isBarcode) {
        try {
            const res = await fetch(`${BASE_URL}/api/v0/product/${numericOnly}.json`);
            const data = await res.json();
            
            if (data.status === 1 && data.product) {
                return {
                    products: [data.product],
                    count: 1,
                    page: 1,
                    page_size: 24
                };
            }
        } catch (error) {
            console.error("Barcode lookup failed:", error);
        }
    }

    // Standard Search Logic
    const sortMapping: Record<string, string> = {
        'unique_scans_n': 'unique_scans_n',
        'name_asc': 'product_name',
        'name_desc': '-product_name',
        'grade_asc': 'nutriscore_score',   
        'grade_desc': '-nutriscore_score', 
    };

    const params = new URLSearchParams({
        action: 'process',
        json: '1',
        page: page.toString(),
        page_size: '24',
        sort_by: sortMapping[sortField] || 'unique_scans_n'
    });

    if (trimmedQuery) params.append('search_terms', trimmedQuery);

    if (category) {
        params.append('tagtype_0', 'categories');
        params.append('tag_contains_0', 'contains');
        params.append('tag_0', category);
    }

    const res = await fetch(`${BASE_URL}/cgi/search.pl?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export const fetchProductByBarcode = async (barcode: string): Promise<Product | null> => {
    // Sanitize barcode here as well for individual lookups
    const cleanBarcode = barcode.replace(/\D/g, '');
    const res = await fetch(`${BASE_URL}/api/v2/product/${cleanBarcode}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.status === 1 ? data.product : null;
};

export const fetchCategories = async (): Promise<string[]> => {
    try {
        const res = await fetch(`${BASE_URL}/categories.json`);
        const data = await res.json();
        return data.tags.slice(0, 50).map((tag: any) => tag.name);
    } catch (error) {
        return [];
    }
}

export const getNutrient = (nutriments: any, key: string) => {
    if (!nutriments) return 0;
    if (key === 'energy') {
        return nutriments['energy-kcal_100g'] ?? nutriments['energy_100g'] ?? 0;
    }
    return nutriments[`${key}_100g`] ?? 0;
};