import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Bundle, Product } from '../../classes/product';
import { Cart } from '../../classes/cart';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  public cart: Product[];
  subscription: Subscription;

  constructor(public productService: ProductService, public cartService: CartService) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.cartService.cartChanged
    .subscribe((cart: Product[]) => this.cart = cart);

    this.cart = this.cartService.cartItems;

    // this.cart = this
    // this.subscription = this.cartService.cartItems.subscribe(response => this.cart = response);
  }


  get getTotal(): number {
    return this.cartService.cartTotalAmount;
  }

  removeItem(productId: number, bundleId: number) {
    this.cartService.removeItem(productId, bundleId);
  }
}
