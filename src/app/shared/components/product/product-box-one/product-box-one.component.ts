import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from '../../modal/quick-view/quick-view.component';
import { Product, Bundle } from '../../../classes/product';
import { ProductService } from '../../../services/product.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-product-box-one',
  templateUrl: './product-box-one.component.html',
  styleUrls: ['./product-box-one.component.scss']
})

export class ProductBoxOneComponent implements OnInit {

  @Input() product: Product;
  @Input() currency: any = this.productService.Currency; // Default Currency
  @Input() thumbnail: boolean = false; // Default False
  @Input() onHowerChangeImage: boolean = false; // Default False
  @Input() cartModal: boolean = false; // Default False
  @Input() loader: boolean = false;

  public bundle: Bundle;

  @ViewChild('quickView') QuickView: QuickViewComponent;

  public ImageSrc: string;

  constructor(private productService: ProductService, private cartService: CartService) { }

  ngOnInit(): void {
    this.loader = true;
    this.bundle = this.product.bundles[0];
    this.loader = false;

    // if (this.loader) {
    //   setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
    // }
  }

  // Change Variants Image
  ChangeVariantsImage(src) {
    this.ImageSrc = src;
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, this.bundle.id, 1);
  }

  addToWishlist(product: any) {
    this.productService.addToWishlist(product);
  }
}
