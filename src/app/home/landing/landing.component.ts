import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {WishListService} from '../../shared/services/wishlist.service';
import {Product} from '../../shared/classes/product';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {

  public themeLogo = 'assets/images/icon/logo-7.png'; // Change Logo
  public grid = 'col-xl-3 col-md-6';
  public layoutView = 'grid-view';
  public favouriteProducts: Product[];
  private subscription: Subscription;

  constructor(
      private http: HttpClient,
      public productService: ProductService,
      public wishlistService: WishListService,
      public categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Change color for this layout
    document.documentElement.style.setProperty('--theme-deafult', '#a3d7e7');

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.wishlistService.wishlist$.subscribe(wishlist => {
      this.productService.products$.pipe(
          map(products => products.filter(product => {
            if (wishlist) {
              return wishlist.some(w => w.sku_id === product.bundles[0].id);
            }
            return false;
          }))
      ).subscribe(products => {
        this.favouriteProducts = products;
      });
    });
  }

  ngOnDestroy(): void {
    // Remove Color
    document.documentElement.style.removeProperty('--theme-deafult');
    this.subscription.unsubscribe();
  }

  OnClick() {
    this.http.get(environment.base_url + '/api/v1/test').subscribe(msg => console.log(msg));
  }
}
