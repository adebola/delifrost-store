
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
    stock: number;
    price: number;
    discount: number;
    description: string;
    isNew: boolean;
    onSale: boolean;
    vatExclusive: boolean;
    imagePath: string[];
    variantOptions: Variant[];

    quantity: number;
    VATPrice: number;
    subTotalPrice: number;
    subTotalVatPrice: number;
}

export interface Variant {
    variantName: string;
    variantOption: string;
}

