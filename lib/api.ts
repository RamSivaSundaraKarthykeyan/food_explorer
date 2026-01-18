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
        page_size: '20',
    });

    if (query) params.append('search_terms', query);
    if(category){
        params.append('tagtype_0', 'categories');
        params.append('tag_contains_0', 'contains');
        params.append('tag_0', category)
    }

    params.append('sort_by', sortField);

    const res = await fetch(`${BASE_URL}/cgi/search.pl?${params.toString()}`);
    if(!res.ok) throw new Error('Failed to fetch products');

    return res.json();
}

export const fetchProductByBarcode = async (barcode: string): Promise<Product | null> => {
    const res =  await fetch(`${BASE_URL}/api/v2/product/${barcode}.json`);
    const data = await res.json();
    return data.status === 1 ? data.product : null;
};

export const fetchCategories = async (): Promise<string[]> => {
    try{
        const res = await fetch(`${BASE_URL}/category.json`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();

        // The API returns an array of objects in 'tags'. 
        // We only want the names of the most popular ones to keep the UI clean.

        return data.tags.slice(0,50).map((tag: any) => tag.name);  // we slice so that we will get the first 50 categories
    }

    catch (error){
        console.error("Error fetching categories:", error)
        return [];
    }
}