import { Product } from './product';


export class OrderItem {
    id: number;
    order_id: number;
    sku_id: number;
    image_path: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    discount: number;
    total_price: number;
}
// Order
export class Order {
    id: number;
    user_id: number;
    full_name: string;
    email: string;
    orderedAt: Date;
    orderAmount: number;
    pickup: boolean;
    deliver: boolean;
    telephone: string;
    address: string;
    paymentRef: string;
    transaction_id: string;
    orderItems: OrderItem[];
}