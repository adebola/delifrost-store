import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../classes/product';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-variation',
  templateUrl: './cart-variation.component.html',
  styleUrls: ['./cart-variation.component.scss']
})
export class CartVariationComponent implements OnInit, OnDestroy {

  @Input() direction: string = 'right'; // Default Direction Right

  public cart: Product[];
  public subscription: Subscription;

  constructor(public cartService: CartService, public productService: ProductService) {}

  ngOnInit(): void {
    this.subscription = this.cartService.cartChanged
    .subscribe((cart: Product[]) => this.cart = cart);
    this.cart = this.cartService.cartItems;

    this.cartService.OpenCart = false;
  }

  closeCart() {
    this.cartService.OpenCart = false;
  }

  get getTotal(): number {
    return this.cartService.cartTotalAmount;
  }

  removeItem(productId: number, bundleId: number) {
    this.cartService.removeItem(productId, bundleId);
  }

  ngOnDestroy(): void {
    this.closeCart();
    this.subscription.unsubscribe();
  }

}
