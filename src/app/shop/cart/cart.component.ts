import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { Product } from '../../shared/classes/product';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  public cart: Product[] = [];
  private subscription: Subscription;

  constructor(
    public productService: ProductService,
    public cartService: CartService,
    public authService: AuthService) {
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
