import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from '../../modal/quick-view/quick-view.component';
import { Product, Bundle } from '../../../classes/product';
import { ProductService } from '../../../services/product.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { WishListService } from 'src/app/shared/services/wishlist.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-product-box-one',
  templateUrl: './product-box-one.component.html',
  styleUrls: ['./product-box-one.component.scss']
})

export class ProductBoxOneComponent implements OnInit {

  @Input() product: Product;
  @Input() currency: any = this.productService.Currency; // Default Currency
  @Input() thumbnail = false; // Default False
  @Input() onHowerChangeImage = false; // Default False
  @Input() cartModal = false; // Default False
  @Input() loader = false;

  private quantity = 1;

  public bundle: Bundle;

  @ViewChild('quickView') QuickView: QuickViewComponent;

  public ImageSrc: string;

  constructor(
      private toastrService: ToastrService,
      private wishListService: WishListService,
      private productService: ProductService,
      private cartService: CartService) { }

  ngOnInit(): void {
    this.loader = true;
    this.bundle = this.product.bundles[0];
    this.loader = false;
  }

  // Change Variants Image
  ChangeVariantsImage(src) {
    this.ImageSrc = src;
  }

  addToCart(product: Product) {

    if (this.product.bundles[0].stock === 0) {
      return this.toastrService.info('The Product is currently out of stock please check back later');
    }

    this.cartService.addToCart(product, this.bundle.id, this.quantity);
  }

  addToWishlist(product: any) {
    this.wishListService.save(this.bundle.id);
  }

  onInputChange(event) {
    this.quantity = +event.target.value;
  }
}
