
export interface Product {
    productId: number;
    name: string;
    category: string;
    brand: string;
    tags: string[];
    bundles: Bundle[];
}

export interface Bundle {
    id: number;
    sku: string;
    price: number;
    discount: number;
    description: string;
    isNew: boolean;
    onSale: boolean;
    imagePath: string[];
    variantOptions: Variant[];

    quantity: number;
    subTotalPrice: number;
    stock: number;
}

export interface Variant {
    variantName: string;
    variantOption: string;
}

