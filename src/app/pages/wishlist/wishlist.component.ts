import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { WishListService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  constructor(
    public wishlistService: WishListService,
    private productService: ProductService,
    private cartService: CartService) { }

  ngOnInit(): void {
  }

  onRemove(id: number, sku_id: number) {
    this.wishlistService.updateStatus(id, 3, sku_id);
  }

  onAdd(id: number, sku_id: number) {
    // this.wishlistService.updateStatus(id, 2, sku_id);
    this.cartService.addToCart(this.productService.findProductByBundleId(sku_id), sku_id, 1);
  }
}
