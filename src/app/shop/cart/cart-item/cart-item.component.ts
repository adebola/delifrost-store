import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Bundle, Product } from 'src/app/shared/classes/product';
import { QuickViewComponent } from 'src/app/shared/components/modal/quick-view/quick-view.component';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit, OnDestroy {

  @Input() product: Product;
  @Input() bundle: Bundle;
  @ViewChild('quickView') QuickView: QuickViewComponent;
  currency = this.productService.Currency;

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  // Increment
  public increment(productId: number, bundleId: number) {
    this.cartService.addItemByOne(productId, bundleId);
  }

  // Decrement
  public decrement(productId: number, bundleId: number) {
    this.cartService.reduceItemByOne(productId, bundleId);
  }

  public removeItem(productId: number, bundleId: number) {
    this.cartService.removeItem(productId, bundleId);
  }

}
