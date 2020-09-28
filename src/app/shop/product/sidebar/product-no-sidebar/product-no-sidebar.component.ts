import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-product-no-sidebar',
  templateUrl: './product-no-sidebar.component.html',
  styleUrls: ['./product-no-sidebar.component.scss']
})
export class ProductNoSidebarComponent implements OnInit {

  public product: Product;
  public counter: number = 1;
  public activeSlide: any = 0;
  public selectedSize: any;

  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  constructor(private route: ActivatedRoute, private router: Router,
              public productService: ProductService, public cartService: CartService) { 
      this.route.data.subscribe(response => this.product = response.data );
    }

  ngOnInit(): void {
  }

  // Increment
  increment() {
    this.counter++;
  }

  // Decrement
  decrement() {
    if (this.counter > 1) { this.counter-- ; }
  }

  // Add to cart
  async addToCart(product: Product) {
    product.bundles[0].quantity = this.counter || 1;
    const status = await this.cartService.addToCart(product, product.bundles[0].id, 1);
    if (status) {
      this.router.navigate(['/shop/cart']);
    }
  }

  // Buy Now
  async buyNow(product: Product) {
    product.bundles[0].quantity = this.counter || 1;
    const status = await this.cartService.addToCart(product, product.bundles[0].id, 1);
    if (status) {
      this.router.navigate(['/shop/checkout']);
    }
  }

  // Add to Wishlist
  addToWishlist(product: any) {
    this.productService.addToWishlist(product);
  }
}
