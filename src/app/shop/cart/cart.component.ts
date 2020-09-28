import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { Product, Bundle } from '../../shared/classes/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  public cart: Product[] = [];
  public subscription: Subscription;

  constructor(public productService: ProductService, public cartService: CartService) {
  }

  ngOnInit(): void {
    this.subscription = this.cartService.cartChanged
    .subscribe((cart: Product[]) => this.cart = cart);

    this.cart = this.cartService.cartItems;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public get getTotal(): number {
    return this.cartService.cartTotalAmount;
  }

  // Increment
  increment(productId: number, bundleId: number) {
    this.cartService.addItemByOne(productId, bundleId);
  }

  // Decrement
  decrement(productId: number, bundleId: number) {
    this.cartService.reduceItemByOne(productId, bundleId);
  }

  public removeItem(productId: number, bundleId: number) {
    this.cartService.removeItem(productId, bundleId);
  }
}
