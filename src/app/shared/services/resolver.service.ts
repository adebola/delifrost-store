import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../classes/product';
import { ProductService } from './product.service';

@Injectable({
	providedIn: 'root'
})
export class Resolver implements Resolve<Product> {

  public product: Product;

  constructor(private router: Router,
              public productService: ProductService) {}


  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Product | Observable<Product> | Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.productService.getProductBySlug(route.params.slug).subscribe(product => {
      if (!product) { // When product is empty redirect 404
          this.router.navigateByUrl('/pages/404', {skipLocationChange: true});
      } else {
          this.product = product;
      }
    });

    return this.product;
  }
}
