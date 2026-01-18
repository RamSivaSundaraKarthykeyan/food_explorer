export interface Product {
    code: string;
    product_name?: string;
    image_url?: string;
    categories?: string;
    ingredients_text?: string;
    nutrition_grades?: string;
    nutrients?: {
        energy_100g?: number;
        fat_100g?: number;
        carbohydrates_100g?: number;
        protiens_100g?: number;
        salt_100g?: number;
    };
    labels_tags?: string[];
}


export interface APIResponse {
    products: Product[];
    count: number;
    page: number;
    page_size: number;
}