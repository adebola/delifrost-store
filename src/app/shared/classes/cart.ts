import { Product } from './product';

export interface Cart {
  items: {[key: string]: Product};
  totalQty: number;
  totalVAT: number;
  subTotal: number;
  totalPrice: number;
  delivery: number;
}
