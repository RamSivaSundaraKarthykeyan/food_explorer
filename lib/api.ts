import { APIResponse, Product } from "@/types"

const BASE_URL = "https://world.openfoodfacts.org"

export const fetchProducts = async (
    page = 1,
    query = '',
    category = '',
    sortField = 'unique_scans_n'
): Promise<APIResponse> => {
    
    const params = new URLSearchParams({
        action: 'process',
        json: '1',
        page: page.toString(),
        page_size: '24',
        sort_by: sortField === 'nutrition_grades' ? 'nutriscore_score' : sortField
    });

    if (query) params.append('search_terms', query);

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
    // Standard V2 API for single product lookup
    const res = await fetch(`${BASE_URL}/api/v2/product/${barcode}.json`);
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