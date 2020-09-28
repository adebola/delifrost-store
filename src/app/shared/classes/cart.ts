import { Product } from './product';

export interface Cart {
  items: {[key: string]: Product};
  totalQty: number;
  totalPrice: number;
  delivery: number;
}
