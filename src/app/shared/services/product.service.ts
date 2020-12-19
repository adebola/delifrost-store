import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import {catchError, first, take, tap} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../classes/product';
import { environment } from 'src/environments/environment';

const PRODUCT_URL = environment.base_url + '/api/v1/store/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public Currency = { name: 'Naira', currency: '₦', price: 1 }; // Default Currency
  private subject = new BehaviorSubject<Product[]>([]);
  public products$: Observable<Product[]> = this.subject.asObservable();
  private subscription: Subscription;
  private products: Product[];

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.loadProducts();
  }

  private loadProducts() {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.http.get<Product[]>(PRODUCT_URL)
      .pipe(
        catchError(err => {
          const message = ' Unable to Load Products';
          this.toastrService.error(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap(products => {
          this.subject.next(products);
          this.products = products;
        })
      ).subscribe();
  }

  public findProductByBundleId(bundleId: number): Product {

    let returnProduct: Product;

    for (const product of this.products) {
      for (const bundle of product.bundles) {
        if (bundle.id == bundleId) {
          returnProduct = product;
          return product;
        }
      }
    }

    return returnProduct;
  }

  public uniqueBrands(): string[] {

    if (!this.products) {
      this.products$.pipe(take(1)).subscribe(products => {
        return this.findBrands(products);
      });
    } else {
      return this.findBrands(this.products);
    }
  }

  private findBrands(products: Product[]) {
    const brands = [];

    for (const product of products) {
      if (product.brand) {
        const index = brands.indexOf(product.brand);
        if (index === -1) {
          brands.push(product.brand);
        }
      }
    }

    return brands;
  }

  public searchProducts(searchString: string): Observable<Product[]> {

    return this.http.get<Product[]>(PRODUCT_URL + '/search/' + searchString,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  public getProductBySlug(slug: string): Observable<Product> {

    return of(this.products.find(item => item.productId === +slug));
  }

  // Sorting Filter
  public sortProducts(products: Product[], payload: string): any {

    if (payload === 'ascending' || payload === 'a-z') {
      return products.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    } else if (payload === 'z-a') {
      return products.sort((a, b) => {
        if (a.name > b.name) {
          return -1;
        } else if (a.name < b.name) {
          return 1;
        }
        return 0;
      });
    }
  }
}
